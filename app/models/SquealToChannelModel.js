const Model = require("./Model");
const SquealChannel = require("../entities/schemas/SquealChannel");
const ChannelDto = require("../entities/dtos/ChannelDto");

module.exports = class SquealToChannelModel extends Model {
    constructor() {
        super();
    }

    /**
     * @param {Squeal2ChannelDto} dto
     * @return {Promise<boolean>}
     */
    async createAssocSquealChannel(dto) {
        await this.checkMongoose("squeal_to_channels", SquealChannel);
        let doc = this.mongo_escape(dto.getDocument());
        let newAssoc = new this.entityMongooseModel(doc);
        try {
            await newAssoc.save();
        } catch (ignored) {
            return false;
        }
        return true;
    }

    /**
     * @param {number} id
     * @return {Promise<number>}
     */
    async countChannelLinked(id) {
        await this.checkMongoose("squeal_to_channels", SquealChannel);
        id = this.mongo_escape(id);
        let filter = {
            "squeal_id": `${id}`
        }
        let results = await this.entityMongooseModel.find(filter);
        return results.length;
    }

    /**
     * @param id
     * @return {Promise<ChannelDto[]>}
     */
    async getDestinationsChannels(id) {
        await this.checkMongoose("squeal_to_channels", SquealChannel);
        id = this.mongo_escape(id);
        let filter = {
            "squeal_id": `${id}`
        }
        let results = await this.entityMongooseModel.find(filter);
        let output = [];
        for (const result of results) {
            let tmp = new ChannelDto();
            tmp.channel_name = result._doc['channel_name'];
            tmp.type = result._doc['channel_type'];
            output.push(tmp);
        }
        return output;
    }


    /**
     * @param channels {ChannelDto[]}
     * @param excludeFrom
     * @param excludeTo
     * @param limit
     * @return {Promise<number[]>}
     */
    async getAllSquealsToChannels(channels, excludeFrom, excludeTo, limit) {
        await this.checkMongoose("squeal_to_channels", SquealChannel);
        let ids = [];
        let filterOr = [];
        if(channels.length === 0)
            return ids;

        for (const channel of channels) {
            filterOr.push({
                channel_name: channel.channel_name,
                channel_type: channel.type
            });
        }
        filterOr = this.mongo_escape(filterOr);
        let filter = {
            $and: [
                {$or: filterOr},
                {
                    $or: [
                        {$expr: {$lt: ["$squeal_id", `${excludeFrom}`]}},
                        {$expr: {$gt: ["$squeal_id", `${excludeTo}`]}},
                    ]
                }
            ]
        }
        let results = await this.entityMongooseModel.find(filter);
        for (const result of results) {
            ids.push(result._doc['squeal_id']);
        }
        return ids;
    }


    /**
     * @param channel {ChannelDto}
     * @return {Promise<number>}
     */
    async getNumberAssoc(channel) {
        await this.checkMongoose("squeal_to_channels", SquealChannel);
        let filter = {
            channel_name: channel.channel_name,
            channel_type: channel.type
        };
        filter = this.mongo_escape(filter);
        return await this.entityMongooseModel.find(filter).count();
    }

    /**
     * @param {ChannelDto} oldChannel
     * @param {ChannelDto} newChannel
     * @return {Promise<boolean>}
     */
    async substituteChannels(oldChannel, newChannel){
        await this.checkMongoose("squeal_to_channels", SquealChannel);
        let filter = {"channel_name": `${oldChannel.channel_name}`, "channel_type": oldChannel.type};
        filter = this.mongo_escape(filter);
        let update = {"channel_name": newChannel.channel_name, "channel_type": newChannel.type};
        update = this.mongo_escape(update);
        try {
            await this.entityMongooseModel.updateMany(filter, update);
            return true;
        } catch (ignored) {
            return false;
        }
    }

    /**
     * @param {ChannelDto} channelDto
     * @return {Promise<boolean>}
     */
    async deleteChannelRef(channelDto){
        await this.checkMongoose("squeal_to_channels", SquealChannel);

        let filter = {};
        if(channelDto.type !== null) filter['channel_type'] = this.mongo_escape(channelDto.type);
        if(channelDto.channel_name !== null) filter['channel_name'] = this.mongo_escape(channelDto.channel_name);

        try {
            await this.entityMongooseModel.deleteMany(filter);
        } catch (ignored) {
            return false;
        }
        return true;
    }

    /**
     * @param {string} search_dest
     * @return {Promise<numbers[] | []>}
     */
    async getIdSquealsFromDestSearchChannels(search_dest){
        await this.checkMongoose("squeal_to_channels", SquealChannel);
        search_dest = this.mongo_escape(search_dest);
        let filter = {
            channel_name: {$regex: search_dest}
        };

        if(search_dest === '')
            return [];

        let out = [];
        let result = await this.entityMongooseModel.find(filter).sort({squeal_id: -1});
        for (const resultElement of result)
            out.push(resultElement._doc['squeal_id']);
        return out;
    }


    /**
     * @param squeal_id
     * @return {Promise<boolean>}
     */
    async deleteSqueal(squeal_id){
        await this.checkMongoose("squeal_to_channels", SquealChannel);

        squeal_id = this.mongo_escape(squeal_id);

        let filter = {
            "squeal_id": `${squeal_id}`,
        }
        try {
            await this.entityMongooseModel.deleteMany(filter);
            return true;
        } catch (ignored) {
            return false;
        }
    }

    /**
     * @param {Squeal2ChannelDto} dto
     * @return {Promise<boolean>}
     */
    async checkAssocSquealChannel(dto) {
        await this.checkMongoose("squeal_to_channels", SquealChannel);
        let doc = this.mongo_escape(dto.getDocument());
        try {
            let count = new this.entityMongooseModel.find(doc).count();
            return count === 1;

        } catch (ignored) {
            return false;
        }
    }

}