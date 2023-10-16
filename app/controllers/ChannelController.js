const Controller = require("./Controller");
const ChannelDto = require("../entities/dtos/ChannelDto");

module.exports = class ModeController extends Controller {

    #_model;

    /**
     * @param {ChannelModel} model
     */
    constructor(model) {
        super();
        this.#_model = model;
    }

    /**
     * @param {ChannelDto} channelDto
     * @return {Promise<{msg: string, code: number, content: {object}}>}
     */
    async getChannel(channelDto) {
        let output = this.getDefaultOutput();

        if (this.checkChannelType(channelDto.type) === false) {
            output['code'] = 400;
            output['msg'] = 'Invalid type of channel. Bad request.';
            return output;
        }

        channelDto.channel_name = channelDto.channel_name.trim();

        if (channelDto.channel_name.length === 0) {
            output['code'] = 400;
            output['msg'] = 'Missing name. Bad Request.';
            return output;
        }

        if (channelDto.type === 'CHANNEL_HASHTAG') {
            let tmp = new ChannelDto();
            tmp.channel_name = channelDto.channel_name;
            tmp.type = 'CHANNEL_HASHTAG';
            tmp.private = false;
            output['content'] = tmp.getDocument();
            return output;
        }
        //we arrive here only for non hashtag channels. So we must check types and authorizations!

        //Retrieve the channel from model.
        let channel = await this.#_model.getChannel(channelDto);

        if (this.isObjectVoid(channel)) {
            //Channel not found. For every type we can switch things
            output['code'] = 404;
            output['msg'] = 'Channel not found.';
            return output;
        }

        //TODO CONTINUE HERE

        return output;
    };


    /**
     * @param {string} type
     * @return {boolean}
     *
     * Check if the type of string is valid, returns true if is valid, false otherwise.
     *
     */
    checkChannelType(type) {
        if (type === 'CHANNEL_OFFICIAL') return true;
        if (type === 'CHANNEL_USERS') return true;
        return type === 'CHANNEL_HASHTAG';

    }


}