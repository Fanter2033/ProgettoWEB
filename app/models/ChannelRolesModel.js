const Model = require("./Model");
const ChannelRoleSchema = require("../entities/schemas/ChannelRoleSchema");
const UserDto = require("../entities/dtos/UserDto");
const ChannelDto = require("../entities/dtos/ChannelDto");
const ChannelRoleDto = require("../entities/dtos/ChannelRoleDto");
const Channel = require("../entities/schemas/ChannelSchema");
module.exports = class ChannelRolesModel extends Model {
    constructor(collectionName) {
        super(collectionName);
    }

    /**
     * @param channelRoleDto {ChannelRoleDto}
     * @return {Promise<boolean>}
     */
    async insertRole(channelRoleDto){
        await this.checkMongoose("ChannelRole", ChannelRoleSchema);
        channelRoleDto = this.mongo_escape(channelRoleDto.getDocument());
        let channelInserting = new this.entityMongooseModel(channelRoleDto);
        try {
            await channelInserting.save();
        } catch (ignored) {
            return false;
        }
        return true;
    }


    /**
     * @param {ChannelRoleDto} roleDto
     * @return {Promise<ChannelDto[]>}
     *
     * Given roleDto, returns the ChannelDto of associate channels.
     * BE CAREFUL! Is returned a partial ChannelDto
     * BECAUSE WE HAVE ONLY TYPE AND NAME.
     * USE ChannelModel to get full ChannelDto!!!
     *
     */
    async getChannelsByRoleDto(roleDto){
        await this.checkMongoose("ChannelRole", ChannelRoleSchema);
        let output = [];
        let username = roleDto.username;
        let type = roleDto.type;
        let role = roleDto.role;
        let channel_name = roleDto.channel_name;

        let filter = {};
        if(username !== null) filter['username'] = this.mongo_escape(username);
        if(type !== null) filter['type'] = this.mongo_escape(type);
        if(role !== null) filter['role'] = this.mongo_escape(role);
        if(channel_name !== null) filter['channel_name'] = this.mongo_escape(channel_name);

        try {
            let results = await this.entityMongooseModel.find(filter);
            for (let i = 0; i < results.length; i++){
                let singleResult = new ChannelDto();
                singleResult.createFromChannelRole(new ChannelRoleDto(results[i]._doc));
                output.push(singleResult);
            }
        } catch (ignored) {
            return [];
        }

        return output;
    }

    /**
     * @param {ChannelRoleDto} roleDto
     * @param {number} limit
     * @param {string} sortBy
     * @param {boolean} sortAsc
     * @return {Promise<UserDto[]>}
     *
     * Given roleDto, returns the UserDto of associate users.
     * BE CAREFUL! Is returned a partial UserDto
     * BECAUSE WE HAVE ONLY USERNAME.
     * USE UserModel to get full UserDto!!!
     *
     */
    async getUsersByRoleDto(roleDto, limit = 10,sortBy = "role_since", sortAsc = true){
        await this.checkMongoose("ChannelRole", ChannelRoleSchema);
        let output = [];
        let username = roleDto.username;
        let type = roleDto.type;
        let role = roleDto.role;
        let channel_name = roleDto.channel_name;

        let filter = {};
        if(username !== null) filter['username'] = this.mongo_escape(username);
        if(type !== null) filter['type'] = this.mongo_escape(type);
        if(role !== null) filter['role'] = this.mongo_escape(role);
        if(channel_name !== null) filter['channel_name'] = this.mongo_escape(channel_name);

        let sort = {}
        if(sortBy !== ''){
            sort[sortBy] = (sortAsc ? 1 : -1);
        }

        try {
            let results = await this.entityMongooseModel.find(filter).sort(sort);
            for (let i = 0; i < results.length; i++){
                let singleResult = new UserDto();
                let role = new ChannelRoleDto(results[i]._doc);
                singleResult.username = role.username;
                output.push(singleResult);
            }
        } catch (ignored) {
            return [];
        }

        return output;
    }


    /**
     *
     * @param {ChannelRoleDto} roleDto
     * @return {Promise< ChannelRoleDto|null >}
     */
    async getRolesByDto(roleDto){
        await this.checkMongoose("ChannelRole", ChannelRoleSchema);

        let username = roleDto.username;
        let type = roleDto.type;
        let role = roleDto.role;
        let channel_name = roleDto.channel_name;

        let filter = {};
        if(username !== null) filter['username'] = this.mongo_escape(username);
        if(type !== null) filter['type'] = this.mongo_escape(type);
        if(role !== null) filter['role'] = this.mongo_escape(role);
        if(channel_name !== null) filter['channel_name'] = this.mongo_escape(channel_name);

        try {
            let results = await this.entityMongooseModel.find(filter).limit(1);
            return new ChannelRoleDto(results[0]._doc);
        } catch (ignored) {
            return null;
        }
    }

    /**
     * @param {ChannelRoleDto} roleDto
     * @return {ChannelRoleDto | null}
     */
    async updateRoleGrade(roleDto) {
        await this.checkMongoose("ChannelRole", ChannelRoleSchema);

        let filter = {};
        if(roleDto.username !== null) filter['username'] = this.mongo_escape(roleDto.username);
        if(roleDto.type !== null) filter['type'] = this.mongo_escape(roleDto.type);
        if(roleDto.channel_name !== null) filter['channel_name'] = this.mongo_escape(roleDto.channel_name);

        roleDto = this.mongo_escape(roleDto.getDocument());

        try {
            await this.entityMongooseModel.findOneAndUpdate(filter, roleDto);
        } catch (ignored) {
            return false;
        }

        return true;

    }


    /**
     * @param {string} username
     * @return {Promise<boolean>}
     */
    async deleteUserRoles(username){
        await this.checkMongoose("ChannelRole", ChannelRoleSchema);

        let filter = {
            username: this.mongo_escape(username)
        };

        try {
            await this.entityMongooseModel.deleteMany(filter);
        } catch (ignored) {
            return false;
        }
        return true;
    }

    /**
     * @param {ChannelRoleDto} roleDto
     * @return {Promise<ChannelRoleDto|null>}
     * returns the ChannelRoleDto in the database, null if not found.
     */
    async getUserRole(roleDto) {
        await this.checkMongoose("ChannelRole", ChannelRoleSchema);

        let filter = {};
        if(roleDto.username !== null) filter['username'] = this.mongo_escape(roleDto.username);
        if(roleDto.type !== null) filter['type'] = this.mongo_escape(roleDto.type);
        if(roleDto.channel_name !== null) filter['channel_name'] = this.mongo_escape(roleDto.channel_name);

        try {
            let result = await this.entityMongooseModel.findOne(filter);
            return new ChannelRoleDto(result._doc);
        } catch (ignored) {
            return null;
        }
    }

    /**
     * @param {ChannelDto} oldChannel
     * @param {ChannelDto} newChannel
     * @return {Promise<boolean>}
     */
    async substituteChannels(oldChannel, newChannel){
        await this.checkMongoose("ChannelRole", ChannelRoleSchema);
        let filter = {"channel_name": `${oldChannel.channel_name}`, "type": oldChannel.type};
        filter = this.mongo_escape(filter);
        let update = {"channel_name": newChannel.channel_name, "type": newChannel.type};
        update = this.mongo_escape(update);
        try {
            let result = await this.entityMongooseModel.updateMany(filter, update);
            return true;
        } catch (ignored) {
            return false;
        }
    }

    /**
     * @param {ChannelDto} channelDto
     * @param {number} role
     * @return {Promise<ChannelRoleDto[]>}
     */
    async getAllChannelRoles(channelDto, role = -1){
        await this.checkMongoose("ChannelRole", ChannelRoleSchema);
        let output = [];
        let type = channelDto.type;
        let channel_name = channelDto.channel_name;

        let filter = {};
        if(type !== null) filter['type'] = this.mongo_escape(type);
        if(channel_name !== null) filter['channel_name'] = this.mongo_escape(channel_name);
        if(role !== -1)
            filter['role'] = this.mongo_escape(role);

        try {
            let results = await this.entityMongooseModel.find(filter);
            for (let i = 0; i < results.length; i++){
                let res = new ChannelRoleDto(results[i]._doc);
                output.push(res);
            }
        } catch (ignored) {
            return [];
        }

        return output;
    }


    /**
     * @param {ChannelRoleDto} roleDto
     * @return {Promise<boolean>}
     */
    async deleteAllChannelRoles(roleDto){
        await this.checkMongoose("ChannelRole", ChannelRoleSchema);

        let filter = {};
        if(roleDto.type !== null) filter['type'] = this.mongo_escape(roleDto.type);
        if(roleDto.channel_name !== null) filter['channel_name'] = this.mongo_escape(roleDto.channel_name);

        try {
            await this.entityMongooseModel.deleteMany(filter);
        } catch (ignored) {
            return false;
        }
        return true;
    }



}