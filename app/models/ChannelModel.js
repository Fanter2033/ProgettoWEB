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


}

