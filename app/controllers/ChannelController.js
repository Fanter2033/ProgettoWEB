const Controller = require("./Controller");
const ChannelDto = require("../entities/dtos/ChannelDto");
const ChannelRolesController = require("./ChannelRolesController");
const ChannelRolesModel = require("../models/ChannelRolesModel");
const ChannelRoleDto = require("../entities/dtos/ChannelRoleDto");

module.exports = class ChannelController extends Controller {

    #_model;
    #channelRolesController;

    /**
     * @param {ChannelModel} model
     */
    constructor(model) {
        super();
        this.#_model = model;
        this.#channelRolesController = new ChannelRolesController(new ChannelRolesModel());
    }

    /**
     * @param {ChannelDto} channelDto
     * @param {UserDto} authenticatedUser
     * @return {Promise<{msg: string, code: number, content: {}}>}
     */
    async createChannel(channelDto, authenticatedUser) {
        let output = this.getDefaultOutput();
        if (this.checkChannelType(channelDto.type) === false) {
            output['code'] = 400;
            output['msg'] = 'Invalid type of channel. Bad request.';
            return output;
        }

        // noinspection JSIncompatibleTypesComparison
        if (channelDto.type === 'CHANNEL_HASHTAG') {
            output['code'] = 400;
            output['msg'] = 'Invalid type of channel. Bad request.';
            return output;
        }

        let ctrlOut = await this.getChannel(channelDto);
        if (ctrlOut['content'] instanceof ChannelDto) {
            //Channel found. Cannot create
            output['code'] = 409;
            output['msg'] = 'Already exists.';
            return output;
        }

        //if we are here, the authentication is required
        if (this.isObjectVoid(authenticatedUser)) {
            //User not logged
            output['code'] = 403;
            output['msg'] = 'Please login.';
            return output;
        }

        //if we are creating an admin channel we should check if the user is an admin
        // noinspection JSIncompatibleTypesComparison
        if (channelDto.type === 'CHANNEL_OFFICIAL' && authenticatedUser.isAdmin === false) {
            //User logged but not an admin
            output['code'] = 401;
            output['msg'] = 'Non-moderators cannot create official channels.';
            return output;
        }

        if (channelDto.type === 'CHANNEL_OFFICIAL') {
            channelDto.channel_name = channelDto.channel_name.toUpperCase();
        } else { //unofficial
            channelDto.channel_name = channelDto.channel_name.toLowerCase();
        }

        //if we are here al checks is OK!
        //Let's create channel into database.
        let modelOutput = await this.#_model.createChannel(channelDto);

        if (modelOutput === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error.';
            return output;
        }

        //channel official do not require any relationship.
        output['content'] = channelDto.getDocument();

        // noinspection JSIncompatibleTypesComparison
        if (channelDto.type !== 'CHANNEL_OFFICIAL') {
            //unofficial channel. Insert the creator as Admin.
            let channelRoleDto = new ChannelRoleDto();
            channelRoleDto.channel_name = channelDto.channel_name;
            channelRoleDto.type = channelDto.type;
            channelRoleDto.role = autoload.config._CHANNEL_ROLE_ADMIN;
            channelRoleDto.username = authenticatedUser.username;
            let roleOut = await this.#channelRolesController.createRole(channelRoleDto);
            if (roleOut['code'] !== 200) {
                output['code'] = 500;
                output['msg'] = 'Internal server error.';
                return output;
            }
        }


        return output;
    }


    /**
     * @param {ChannelDto} channelDto
     * @return {Promise<{msg: string, code: number, content: {object}}>}
     * Given a channel returns the channel object.
     * It is used to check if a channel exists.
     * No checks on authenticated user is required.
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

        if (!(channel instanceof ChannelDto)) {
            //Channel not found. For every type we can switch things
            output['code'] = 404;
            output['msg'] = 'Channel not found.';
            return output;
        }

        output['content'] = channel.getDocument();

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