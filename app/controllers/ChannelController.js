const Controller = require("./Controller");
const ChannelDto = require("../entities/dtos/ChannelDto");
const ChannelRolesController = require("./ChannelRolesController");
const ChannelRolesModel = require("../models/ChannelRolesModel");
const ChannelRoleDto = require("../entities/dtos/ChannelRoleDto");
const UserController = require("./UserController");
const UserModel = require("../models/UserModel");
const UserDto = require("../entities/dtos/UserDto");
let userController = new UserController(new UserModel());

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

        if (channelDto.type === 'CHANNEL_OFFICIAL') {
            channelDto.channel_name = channelDto.channel_name.toUpperCase();
        } else { //unofficial
            channelDto.channel_name = channelDto.channel_name.toLowerCase();
        }

        let channelExists = await this.channelExists(channelDto);
        if (channelExists === true) {
            //Channel found. Cannot create
            output['code'] = 409;
            output['msg'] = 'Already exists.';
            return output;
        } else if(channelExists === null){
            output['code'] = 500;
            output['msg'] = 'Internal server error. The Existing channel control has an error. This message should never be send';
            return output;
        }

        //if we are here, the authentication is required
        if (this.isAuthenticatedUser(authenticatedUser) === false) {
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
     * @return {Promise<boolean | null>}
     * Given a ChannelDto returns true if the channel exists, false otherwise, null in case of error.
     */
    async channelExists(channelDto){
        let getChannelOutput = await this.getChannel(channelDto);
        if(getChannelOutput['code'] === 200) return true;
        if(getChannelOutput['code'] === 404) return false;
        return null;
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
     * @param {ChannelDto} channelDto
     * @param {UserDto} authenticatedUser
     * @return {Promise<{msg: string, code: number, content: {object}}>}
     */
    async deleteChannel(channelDto, authenticatedUser) {
        let output = this.getDefaultOutput();

        if(this.isObjectVoid(authenticatedUser) === true){
            output['code'] = 403;
            output['msg'] = 'User not authenticated';
            return output;
        }

        let channelExists = await this.channelExists(channelDto);
        if(channelExists === false){
            output['code'] = 404;
            output['msg'] = 'Channel not found';
            return output;
        }

        if(authenticatedUser.isAdmin() === false){
            //Ok if is not an admin let's check if the role is valid to delete.
            //In particular let's check if there is only one role.
            let roleCtrl = await this.#channelRolesController.getChannelUserRole(channelDto, authenticatedUser.username);
            if(roleCtrl.code !== 200){
                output['code'] = 401;
                output['msg'] = 'Operation not allowed (1)';
                return output;
            }

            //Role found. Let's check if is creator's channel
            let role = new ChannelRoleDto(output['content'].getDocument())
            if(role.role !== autoload.config._CHANNEL_ROLE_OWNER){
                output['code'] = 403;
                output['msg'] = 'Operation not allowed (2)';
                return output;
            }
        }

        //If we are here we can delete the channel.
        //Before delete the channel from the collection of the channel we should delete the associated roles.
        //We'll use sub-controller.
        let subCtrlResult = this.#channelRolesController.deleteChannelRoles(channelDto);
        if(subCtrlResult['code'] !== 200){
            output['code'] = 500;
            output['msg'] = 'Internal server error (1)';
            return output;
        }

        //We can safely delete the channel from the channel collection
        let modelResult = await this.#_model.deleteChannel(channelDto);
        if(modelResult === false){
            output['code'] = 500;
            output['msg'] = 'Internal server error (2)';
            return output;
        }

        //TODO THIS FUNCTIONS MUST BE TESTED

        return output;
    }

    /**
     * @param {ChannelDto} channelDto
     * @param {string} username
     * @return {Promise<{msg: string, code: number, content: {object}}>}
     */
    async getChannelUserRole(channelDto, username) {
        let output = this.getDefaultOutput();

        username = username.trim();
        if(username.length === 0){
            output['code'] = 400;
            output['msg'] = 'Not valid username';
            return output;
        }

        let user = await userController.getUser(username);
        if(user['code'] !== 200){
            //User not found
            output['code'] = 404;
            output['msg'] = 'Not found. (3)';
            return output;
        }
        user = new UserDto(user.content);

        //Note: the Type hashtag channels exists in everytime by definition. Escape useless controls.
        if(channelDto.type === autoload.config._CHANNEL_TYPE_HASHTAG){
            let response = new ChannelRoleDto();
            response.role = autoload.config._CHANNEL_ROLE_WRITE;
            response.type = channelDto.type;
            response.channel_name = channelDto.channel_name;
            response.role_since = 0;
            response.username = username;
            output['content'] = response.getDocument();
            return output;
        }

        if(channelDto.type === autoload.config._CHANNEL_TYPE_OFFICIAL && user.isAdmin){
            let response = new ChannelRoleDto();
            response.role = autoload.config._CHANNEL_ROLE_ADMIN;
            response.type = channelDto.type;
            response.channel_name = channelDto.channel_name;
            response.role_since = 0;
            response.username = username;
            output['content'] = response.getDocument();
            return output;
        }

        let channelExists = await this.channelExists(channelDto);
        if(channelExists !== true){
            output['code'] = 404;
            output['msg'] = 'Not found. (1)';
            return output;
        }

        //Channel exists! So... use sub-controller to get the user role, if exists!
        let roleDto = new ChannelRoleDto();
        roleDto.channel_name = channelDto.channel_name;
        roleDto.type = channelDto.type;
        roleDto.username = username;
        let ctrlOut = await this.#channelRolesController.getChannelRoleOfUser(roleDto);
        if(ctrlOut['code'] !== 200){
            output['code'] = 404;
            output['msg'] = 'Not found. (2)';
            return output;
        }
        output['content'] = ctrlOut['content'];
        return output;
    }


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