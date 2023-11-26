const User = require("../entities/schemas/UserSchema");
const Model = require("./Model");
const UserDto = require("../entities/dtos/UserDto");
const Channel = require("../entities/schemas/ChannelSchema");
module.exports = class UserModel extends Model {
    constructor(userCollectionName) {
        super(userCollectionName);
    }

    /**
     * @param username
     * @return {{}|UserDto}
     */
    async getUser(username) {
        await this.checkMongoose("User", User);
        let filter = {username: `${username}`};
        filter = this.mongo_escape(filter);
        let results = await this.entityMongooseModel.find(filter);
        if (results.length === 1) return new UserDto(results[0]._doc);
        return {};
    }

    /**
     * @param email
     * @return {{}|UserDto}
     */
    async getUserByEmail(email) {
        await this.checkMongoose("User", User);
        let filter = {"email": `${email}`};
        filter = this.mongo_escape(filter);
        let results = await this.entityMongooseModel.find(filter);
        if (results.length === 1)
            return new UserDto(results[0]._doc);
        return {};
    }

    /**
     *
     * @param {String} username
     * @param {String} email
     * @returns {Promise<boolean>}
     * Given a username returns true if the user exists, false otherwise.
     */
    async userExists(username, email = '') {
        let user = await this.getUser(username);
        if ((user).constructor.name === 'UserDto')
            return true;
        if (email === '')
            return false;
        user = await this.getUserByEmail(email);
        return (user).constructor.name === 'UserDto';
    }

    /**
     * @param {string} email
     * @return {Promise<boolean>}
     */
    async userExistsByEmail(email) {
        let user = await this.getUserByEmail(email);
        return (user).constructor.name === 'UserDto';
    }

    /**
     *
     * @param username
     * @returns {Promise<boolean>}
     *
     * Given an username this function delete it from database.
     * Returns true on success, false otherwise.
     *
     */
    async deleteUser(username) {
        await this.checkMongoose("User", User);
        let filter = {"username": `${username}`};
        filter = this.mongo_escape(filter);
        try {
            await this.entityMongooseModel.deleteOne(filter);
        } catch (ignored) {
            return false;
        }
        return true;
    }

    /**
     * @param userObj {UserDto}
     * @returns {Promise<boolean>}
     */
    async createUser(userObj) {
        await this.checkMongoose("User", User);
        userObj = this.mongo_escape(userObj.getDocument(true));
        let userInserting = new this.entityMongooseModel(userObj);
        try {
            await userInserting.save();
        } catch (ignored) {
            return false;
        }
        return true;
    }

    /**
     * @param userObj {UserDto}
     * @param username {string}
     * @returns {Promise<boolean>}
     */
    async replaceUser(userObj, username) {
        await this.checkMongoose("User", User);
        let filter = {"username": `${username}`};
        filter = this.mongo_escape(filter);
        userObj = this.mongo_escape(userObj.getDocument(true));
        try {
            await this.entityMongooseModel.replaceOne(filter, userObj);
        } catch (ignored) {
            return false;
        }
        return true;

    }

    /**
     *
     * @param {number} offset
     * @param {number} limit
     * @param {string} search
     * @param {string} orderBy
     * @param {string} orderDir
     * @returns {Promise<UserDto | {}>}
     */
    async getUserList(offset, limit, search, orderBy, orderDir) {
        await this.checkMongoose("User", User);
        orderDir = (orderDir === 'ORDER_ASC' ? 'asc' : 'desc');
        let filter = {
            $or: [
                {username: {$regex: this.mongo_escape(search)}},
                {first_name: {$regex: this.mongo_escape(search)}},
                {last_name: {$regex: this.mongo_escape(search)}},
                {email: {$regex: this.mongo_escape(search)}}
            ]
        };
        let sorting = {};
        sorting[orderBy] = orderDir;
        sorting = this.mongo_escape(sorting);

        if (orderBy === '')
            sorting = {};

        offset = this.mongo_escape(offset);

        try {
            let results;
            if(limit > 0){
                limit = this.mongo_escape(limit);
                results = await this.entityMongooseModel
                    .find(filter)
                    .sort(sorting)
                    .skip(offset)
                    .limit(limit);
            } else {
                results = await this.entityMongooseModel
                    .find(filter)
                    .sort(sorting)
                    .skip(offset)
            }

            let output = [];
            for (let i = 0; i < results.length; i++)
                output.push(new UserDto(results[i]._doc));
            return output;
        } catch (ignored) {
            return {}
        }
    }

    /**
     * @param {string} search
     * @return {Promise<number>}
     *
     * Returns the number of all users in the DB.
     */
    async getUserCount(search) {
        let filter = {
            $or: [
                {username: {$regex: this.mongo_escape(search)}},
                {first_name: {$regex: this.mongo_escape(search)}},
                {last_name: {$regex: this.mongo_escape(search)}},
                {email: {$regex: this.mongo_escape(search)}}
            ]
        };
        return await this.entityMongooseModel.count(filter);
    }

    /**
     * @param userObj {UserDto}
     * @param newLock {number}
     * @returns {Promise<boolean>}
     */
    async changeUserLock(userObj, newLock) {
        await this.checkMongoose("User", User);
        let filter = {"username": `${userObj.username}`};
        filter = this.mongo_escape(filter);
        userObj.locked = newLock;
        userObj = this.mongo_escape(userObj.getDocument(true));
        try {
            await this.entityMongooseModel.updateOne(filter, userObj);
        } catch (ignored) {
            return false;
        }
        return true;
    }

    async changeVipStatus(userDto, newVipStat){
        await this.checkMongoose("User", User);
        let filter = {"username": `${userDto.username}`};
        filter = this.mongo_escape(filter);
        userDto.vip = newVipStat;
        userDto = this.mongo_escape(userDto.getDocument(true));
        try {
            await this.entityMongooseModel.updateOne(filter, userDto);
        } catch (ignored) {
            return false;
        }
        return true;
    }


    /**
     * @param username {string}
     * @param field {string}
     * @param newValue {*}
     * @return {Promise<boolean>}
     */
    async updateUserField(username, field, newValue){
        await this.checkMongoose("User", User);
        let filter = {"username": `${username}`};
        filter = this.mongo_escape(filter);
        let update = {};
        update[field] = newValue
        update = this.mongo_escape(update);
        try {
            await this.entityMongooseModel.updateOne(filter, update);
        } catch (ignored) {
            return false;
        }
        return true;
    }


    async changeSmmStatus(userDto, newSmmStat){
        await this.checkMongoose("User", User);
        let filter = {"username": `${userDto.username}`};
        filter = this.mongo_escape(filter);
        userDto.isSmm = newSmmStat;
        userDto = this.mongo_escape(userDto.getDocument(true));
        try {
            await this.entityMongooseModel.updateOne(filter, userDto);
        } catch (ignored) {
            return false;
        }
        return true;
    }
}
