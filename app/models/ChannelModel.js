const Model = require("./Model");
const Channel = require("../entities/schemas/ChannelSchema");
const ChannelDto = require("../entities/dtos/ChannelDto");

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

