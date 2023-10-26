const Model = require("./Model");
const Channel = require("../entities/schemas/ChannelSchema");
const ChannelDto = require("../entities/dtos/ChannelDto");
const User = require("../entities/schemas/UserSchema");
const UserDto = require("../entities/dtos/UserDto");

module.exports = class ChannelModel extends Model {
    constructor(collectionName) {
        super(collectionName);
    }

    /**
     * @param {ChannelDto} channelDto
     * @return Promise<{ChannelDto | {}}>
     */
    async getChannel(channelDto) {
        await this.checkMongoose("Channel", Channel);
        let filter = {
            "type": `${this.mongo_escape(channelDto.type)}`,
            "channel_name": `${this.mongo_escape(channelDto.channel_name)}`
        };
        let results = await this.entityMongooseModel.find(filter);
        if (results.length === 1)
            return new ChannelDto(results[0]._doc);
        return {};
    }

    /**
     * @param {ChannelDto} channelDto
     * @return {Promise<boolean>}
     */
    async createChannel(channelDto){
        await this.checkMongoose("Channel", Channel);
        channelDto = this.mongo_escape(channelDto.getDocument());
        let channelInserting = new this.entityMongooseModel(channelDto);
        try {
            await channelInserting.save();
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
     * @param {null | string} type
     * @returns {Promise<ChannelDto[] | {}>}
     */
    async getChannelList(offset, limit, search, orderBy, orderDir, type = null) {
        await this.checkMongoose("Channel", Channel);
        orderDir = (orderDir === 'ORDER_ASC' ? 'asc' : 'desc');
        let filter = {
            channel_name: {$regex: this.mongo_escape(search)}
        };

        if(type !== null)
            filter['type'] = this.mongo_escape(type);

        let sorting = {};
        sorting[orderBy] = orderDir;
        sorting = this.mongo_escape(sorting);
        if (orderBy === '')
            sorting = {};
        offset = this.mongo_escape(offset);
        limit = this.mongo_escape(limit);
        try {
            let results = await this.entityMongooseModel
                .find(filter)
                .sort(sorting)
                .skip(offset)
                .limit(limit);

            let output = [];
            for (let i = 0; i < results.length; i++)
                output.push(new ChannelDto(results[i]._doc));
            return output;
        } catch (ignored) {
            return {}
        }
    }

    /**
     * @param {string} search
     * @param {null | string} type
     * @return {Promise<number>}
     *
     * Returns the number of all channels in the DB.
     */
    async getChannelCount(search, type) {
        let filter = {
            channel_name: {$regex: this.mongo_escape(search)}
        };

        if(type !== null)
            filter['type'] = this.mongo_escape(type);

        return await this.entityMongooseModel.count(filter);
    }

    /**
     * @param {ChannelDto} channelDto
     * @return Promise<boolean>
     */
    async deleteChannel(channelDto) {
        await this.checkMongoose("Channel", Channel);
        let filter = {
            "type": `${this.mongo_escape(channelDto.type)}`,
            "channel_name": `${this.mongo_escape(channelDto.channel_name)}`
        };
        try {
            await this.entityMongooseModel.deleteOne(filter);
        } catch (ignored){
            return false;
        }
        return true;

    }

}

