const Model = require("./Model");
const SquealChannel = require("../entities/schemas/SquealChannel");
const Squeal2ChannelDto = require("../entities/dtos/Squeal2ChannelDto");
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
            tmp.channel_type = result._doc['channel_type'];
            output.push(tmp);
        }
        return output;
    }


    /**
     * @param channels {ChannelDto[]}
     * @return {Promise<number[]>}
     */
    async getAllSquealsToChannels(channels, excludeFrom, excludeTo, limit) {
        await this.checkMongoose("squeal_to_channels", SquealChannel);
        let ids = [];
        let filterOr = [];
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


}