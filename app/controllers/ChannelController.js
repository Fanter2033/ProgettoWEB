const Controller = require("./Controller");
const ChannelDto = require("../entities/dtos/ChannelDto");
const ChannelRolesController = require("./ChannelRolesController");
const ChannelRolesModel = require("../models/ChannelRolesModel");
const ChannelRoleDto = require("../entities/dtos/ChannelRoleDto");
const UserController = require("./UserController");
const UserModel = require("../models/UserModel");
const UserDto = require("../entities/dtos/UserDto");
const SquealToChannelModel = require("../models/SquealToChannelModel");
let userController = new UserController(new UserModel());

module.exports = class ChannelController extends Controller {

    #_model;
    #channelRolesController;
    #squealsToChannelModel;

    /**
     * @param {ChannelModel} model
     */
    constructor(model) {
        super();
        this.#_model = model;
        this.#channelRolesController = new ChannelRolesController(new ChannelRolesModel());
        this.#squealsToChannelModel = new SquealToChannelModel();
    }

    /**
     * @param {ChannelDto} channelDto
     * @param {UserDto} authenticatedUser
     * @return {Promise<{msg: string, code: number, content: {}}>}
     */
    async createChannel(channelDto, authenticatedUser) {
        let output = this.getDefaultOutput();
        channelDto.channel_name = channelDto.channel_name.replace(' ', '_');
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

        if(this.containsOneLetter(channelDto.channel_name) === false
            || this.containsWhiteSpace(channelDto.channel_name)) {
            output['code'] = 400;
            output['msg'] = 'Invalid channel name.';
            return output;
        }

        let channelExists = await this.channelExists(channelDto);
        if (channelExists === true) {
            //Channel found. Cannot create
            output['code'] = 409;
            output['msg'] = 'Already exists.';
            return output;
        } else if (channelExists === null) {
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

        channelDto.locked = false;

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
            //unofficial channel. Insert the creator as Owner.
            let channelRoleDto = new ChannelRoleDto();
            channelRoleDto.channel_name = channelDto.channel_name;
            channelRoleDto.type = channelDto.type;
            channelRoleDto.role = autoload.config._CHANNEL_ROLE_OWNER;
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
     * @param {UserDto | {}} requestingUser
     * @param {number} offset
     * @param {number} limit
     * @param {string} search
     * @param {string} orderBy
     * @param {string} orderDir
     * @param {null | string} type
     * @return {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async getChannelList(requestingUser, offset, limit, search, orderBy, orderDir, type) {
        let output = this.getDefaultOutput();
        let s2c = new SquealToChannelModel();

        offset = parseInt(offset);
        limit = parseInt(limit);
        search = search.trim();
        orderBy = orderBy.trim();
        orderDir = orderDir.trim();

        offset = (isNaN(offset) ? 0 : offset);
        limit = (isNaN(limit) ? 10 : limit);
        if (limit > 100) limit = 100;

        orderDir = ((orderDir === 'ORDER_ASC') ? 'ORDER_ASC' : 'ORDER_DESC');

        output.content = {}
        output.content['channels'] = await this.#_model.getChannelList(offset, limit, search, orderBy, orderDir, type);
        for (const channelKey in output.content['channels']) {
            output.content['channels'][channelKey].posts = await s2c.getNumberAssoc(output.content['channels'][channelKey]);
        }
        output.content['totalCount'] = await this.#_model.getChannelCount(search, type);

        for (let i = 0; i < output.content['channels'].length; i++)
            output.content['channels'][i] = output.content['channels'][i].getDocument();

        return output;
    }

    /**
     * @param {ChannelDto} oldChannel
     * @param {ChannelDto} newChannel
     * @param {UserDto} authUser
     * @return {Promise<{msg: string, code: number, sub_code: number,content: {}}>}
     */
    async updateChannel(oldChannel, newChannel, authUser) {
        let output = this.getDefaultOutput();
        let exists = await this.channelExists(oldChannel);
        newChannel.channel_name = newChannel.channel_name.replace(' ', '_');
        let new_exists = await this.channelExists(newChannel);

        if (oldChannel.type === autoload.config._CHANNEL_TYPE_HASHTAG || newChannel.type === autoload.config._CHANNEL_TYPE_HASHTAG) {
            output['code'] = 400;
            output['msg'] = 'Operation not allowed for hashtags!!!.';
            return output;
        }

        if (exists !== true) {
            output['code'] = 404;
            output['msg'] = 'Channel not found.';
            return output;
        }

        let tmp = await this.getChannel(oldChannel);
        oldChannel = new ChannelDto(tmp.content);

        if (new_exists !== false && oldChannel.channel_name !== newChannel.channel_name) {
            output['code'] = 409;
            output['msg'] = 'Channel already exists.';
            return output;
        }

        //check the user authentication
        if (this.isObjectVoid(authUser)) {
            output['code'] = 403;
            output['msg'] = 'Not authenticated.';
            return output;
        }

        //Check if the user is an admin or has sufficient privileges to do operation.
        if (!authUser.isAdmin) {
            if (newChannel.type === autoload.config._CHANNEL_TYPE_OFFICIAL) {
                output['code'] = 403;
                output['msg'] = 'Not allowed for non-moderators.';
                return output;
            }

            let userRole = await this.getChannelUserRole(oldChannel, authUser.username);
            if (this.isObjectVoid(userRole.content)) {
                output['code'] = 401;
                output['msg'] = 'Not a subscriber of the channel.';
                return output;
            }
            let roleDto = new ChannelRoleDto(userRole.content);
            if (roleDto.role !== autoload.config._CHANNEL_ROLE_OWNER) {
                output['code'] = 401;
                output['msg'] = 'Not the owner of the channel.';
                return output;
            }
        }

        if (newChannel.type === autoload.config._CHANNEL_TYPE_OFFICIAL)
            newChannel.channel_name = newChannel.channel_name.toUpperCase();
        else  //unofficial
            newChannel.channel_name = newChannel.channel_name.toLowerCase();

        if(this.containsOneLetter(newChannel.channel_name) === false
            || this.containsWhiteSpace(newChannel.channel_name)) {
            output['code'] = 400;
            output['msg'] = 'Invalid channel name.';
            return output;
        }

        if (newChannel.type !== oldChannel.type || oldChannel.type !== newChannel.type) {
            //Now, let's check if the new channel do not exists.
            let newChannelExists = await this.channelExists(newChannel);
            if (newChannelExists !== false) {
                output['code'] = 400;
                output['msg'] = 'The new channel name invalid.';
                return output;
            }
        }


        //Now if is OK! Let's change
        newChannel.locked = oldChannel.locked;
        let result = await this.#_model.updateChannel(oldChannel, newChannel);
        if (result === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error (1).';
            return output;
        }

        if (newChannel.channel_name !== oldChannel.channel_name || oldChannel.type !== newChannel.type) {
            //Change references in sub relations.
            let ctrlOut = await this.#channelRolesController.substituteChannels(oldChannel, newChannel);
            if (ctrlOut['code'] !== 200) {
                output['code'] = 500;
                output['msg'] = 'Internal server error (2).';
                return output;
            }

            //Replace on substitution
            let result = await this.#squealsToChannelModel.substituteChannels(oldChannel, newChannel);
            if(result === false){
                output['code'] = 500;
                output['msg'] = 'Internal server error (3).';
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
    async channelExists(channelDto) {
        let getChannelOutput = await this.getChannel(channelDto);
        if (getChannelOutput['code'] === 200) return true;
        if (getChannelOutput['code'] === 404) return false;
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
            tmp.locked = false;
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
     * @param {string} username
     * @param {number|null} newRole
     * @param {UserDto} authenticatedUser
     * @return {Promise<{msg: string, code: number, sub_code: number,content: {}}>}
     *
     */
    async changeChannelRole(channelDto, username, newRole, authenticatedUser) {
        let output = this.getDefaultOutput();

        if (newRole === null || newRole === -1) {
            output['code'] = 400;
            output['msg'] = 'Bad request.';
            return output;
        }

        let channelExists = await this.channelExists(channelDto);
        if (channelExists !== true) {
            output['code'] = 404;
            output['msg'] = 'Not found.';
            return output;
        }

        let userObj = await userController.getUser(username);
        if (userObj['code'] !== 200) {
            output['code'] = 404;
            output['msg'] = 'User not found.';
            return output;
        }

        let doc = await this.getChannel(channelDto);
        channelDto = new ChannelDto(doc.content);

        if (channelDto.private === false && newRole < autoload.config._CHANNEL_ROLE_WRITE) {
            newRole = autoload.config._CHANNEL_ROLE_WRITE;
        }

        let channelRoleDto = new ChannelRoleDto();
        channelRoleDto.role = newRole;
        channelRoleDto.role_since = this.getCurrentTimestampSeconds();
        channelRoleDto.username = username;
        channelRoleDto.type = channelDto.type;
        channelRoleDto.channel_name = channelDto.channel_name;
        /*
        let result = await this.getChannelUserRole(channelDto, username);
        if (result['code'] === 404) {
            if (channelDto.private === true && newRole === 0)
                return await this.#channelRolesController.createRole(channelRoleDto);
            else if (channelDto.private === false && newRole === 2)
                return await this.#channelRolesController.createRole(channelRoleDto);
            else
                return await this.#channelRolesController.updateUserRole(channelRoleDto, authenticatedUser);
        }
         */

        return await this.#channelRolesController.updateUserRole(channelRoleDto, authenticatedUser);
    }

    /**
     * @param {ChannelDto} channelDto
     * @param {UserDto} authUser
     * @return {Promise<{msg: string, code: number, sub_code: number,content: {}}>}
     */
    async toggleChannelLock(channelDto, authUser) {
        let output = this.getDefaultOutput();

        let channelExists = await this.channelExists(channelDto);
        if (channelExists !== true) {
            output['code'] = 404;
            output['msg'] = 'Not found.';
            return output;
        }

        channelDto = await this.#_model.getChannel(channelDto);

        if (this.isObjectVoid(authUser) === true) {
            output['code'] = 403;
            output['msg'] = 'User not authenticated';
            return output;
        }

        if (!authUser.isAdmin) {
            output['code'] = 401;
            output['msg'] = 'Not allowed for non-moderators.';
            return output;
        }

        let newLock = channelDto.locked;
        newLock = !newLock;
        let result = await this.#_model.changeChannelLock(channelDto, newLock);
        if (result === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error.';
            return output;
        }
        return output;
    }

    /**
     * @param {ChannelDto} channelDto
     * @param {UserDto} authenticatedUser
     * @return {Promise<{msg: string, code: number, content: {object}}>}
     */
    async deleteChannel(channelDto, authenticatedUser) {
        let output = this.getDefaultOutput();

        if (this.isObjectVoid(authenticatedUser) === true) {
            output['code'] = 403;
            output['msg'] = 'User not authenticated';
            return output;
        }

        let channelExists = await this.channelExists(channelDto);
        if (channelExists === false) {
            output['code'] = 404;
            output['msg'] = 'Channel not found';
            return output;
        }

        if (authenticatedUser.isAdmin === false) {
            //Ok if is not an admin let's check if the role is valid to delete.
            //In particular let's check if there is only one role.
            let roleCtrl = await this.getChannelUserRole(channelDto, authenticatedUser.username);
            if (roleCtrl.code !== 200) {
                output['code'] = 401;
                output['msg'] = 'Operation not allowed (1)';
                return output;
            }

            //Role found. Let's check if is creator's channel
            let role = new ChannelRoleDto(roleCtrl['content'])
            if (role.role !== autoload.config._CHANNEL_ROLE_OWNER) {
                output['code'] = 403;
                output['msg'] = 'Operation not allowed (2)';
                return output;
            }
        }

        //If we are here we can delete the channel.
        //Before delete the channel from the collection of the channel we should delete the associated roles.
        //We'll use sub-controller.
        let subCtrlResult = await this.#channelRolesController.deleteChannelRoles(channelDto);
        if (subCtrlResult['code'] !== 200) {
            output['code'] = 500;
            output['msg'] = 'Internal server error (1)';
            return output;
        }

        //We can safely delete the channel from the channel collection
        let modelResult = await this.#_model.deleteChannel(channelDto);
        if (modelResult === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error (2)';
            return output;
        }

        modelResult = await this.#squealsToChannelModel.deleteChannelRef(channelDto);
        if (modelResult === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error (2)';
            return output;
        }

        return output;
    }

    /**
     * @param {ChannelDto} channelDto
     * @param {number} role
     * @return {Promise<{msg: string, code: number, sub_code: number,content: {}}>}
     */
    async getChannelSubscribers(channelDto, role = -1) {
        let output = this.getDefaultOutput();

        let channelExists = await this.channelExists(channelDto);
        if (channelExists === false) {
            output['code'] = 404;
            output['msg'] = 'Channel not found';
            return output;
        }

        if (isNaN(role))
            role = -1;

        output['content'] = await this.#channelRolesController.getChannelSubscribers(channelDto, role);
        return output;
    }

    /**
     * @param {ChannelDto} channelDto
     * @param {string} username
     * @return {Promise<{msg: string, code: number, content: {}}>}
     */
    async getChannelUserRole(channelDto, username) {
        let output = this.getDefaultOutput();

        username = username.trim();
        if (username.length === 0) {
            output['code'] = 400;
            output['msg'] = 'Not valid username';
            return output;
        }

        let user = await userController.getUser(username);
        if (user['code'] !== 200) {
            //User not found
            output['code'] = 404;
            output['msg'] = 'Not found. (3)';
            return output;
        }
        user = new UserDto(user.content);

        //Note: the Type hashtag channels exists in everytime by definition. Escape useless controls.
        if (channelDto.type === autoload.config._CHANNEL_TYPE_HASHTAG) {
            let response = new ChannelRoleDto();
            response.role = autoload.config._CHANNEL_ROLE_WRITE;
            response.type = channelDto.type;
            response.channel_name = channelDto.channel_name;
            response.role_since = 0;
            response.username = username;
            output['content'] = response.getDocument();
            return output;
        }

        if (channelDto.type === autoload.config._CHANNEL_TYPE_OFFICIAL && user.isAdmin) {
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
        if (channelExists !== true) {
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
        if (ctrlOut['code'] !== 200) {
            if (channelDto.type === autoload.config._CHANNEL_TYPE_OFFICIAL && user.isAdmin === false) {
                let response = new ChannelRoleDto();
                response.role = autoload.config._CHANNEL_ROLE_READ;
                response.type = channelDto.type;
                response.channel_name = channelDto.channel_name;
                response.role_since = 0;
                response.username = username;
                output['content'] = response.getDocument();
                return output;
            }
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

    checkChannelPublicType(type) {
        if (type === 'CHANNEL_OFFICIAL') return true;
        return type === 'CHANNEL_HASHTAG';
    }

    /**
     * @param {ChannelDto[]} dtos
     * @return {Promise<boolean>}
     */
    async thereIsPublicChannel(dtos) {
        for (const dto of dtos)
            if (this.checkChannelPublicType(dto.channel_type))
                return true;
        //mmm we should scan every channel
        for (const dto of dtos) {
            let result = await this.#_model.getChannel(dto);
            if (!(result instanceof ChannelDto))
                continue;
            if (result.private === false)
                return true;
        }
        return false;
    }

    /**
     * @param dto {ChannelDto}
     * @param authUser {UserDto}
     * @return {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async followChannel(dto, authUser) {
        let output = this.getDefaultOutput();

        let channelExists = await this.channelExists(dto);
        if (channelExists !== true) {
            output['code'] = 404;
            output['msg'] = 'Not found. (1)';
            return output;
        }

        if (this.isAuthenticatedUser(authUser) === false) {
            output['code'] = 403;
            output['msg'] = 'Not authenticated';
            return output;
        }

        let roleDto = new ChannelRoleDto();
        roleDto.channel_name = dto.channel_name;
        roleDto.type = dto.type;
        roleDto.username = authUser.username;
        let currentRole = await this.#channelRolesController.getChannelRoleOfUser(roleDto);
        if(currentRole.code === 200){
            output.code = 208;
            output.msg = 'Already following';
            return output;
        }

        let role = 0;
        if (dto.type === autoload.config._CHANNEL_TYPE_HASHTAG)
            role = 2;
        else if (dto.type === autoload.config._CHANNEL_TYPE_OFFICIAL)
            role = 1;
        else {
            //Users
            dto = await this.#_model.getChannel(dto);
            if (dto.private === false)
                role = 2;
        }

        let newRole = new ChannelRoleDto();
        newRole.type = dto.type;
        newRole.channel_name = dto.channel_name;
        newRole.role_since = this.getCurrentTimestampSeconds();
        newRole.username = authUser.username;
        newRole.role = role;

        let ctrlOut = await this.#channelRolesController.createRole(newRole);
        if(ctrlOut.code !== 200){
            output['code'] = 500;
            output['msg'] = 'Internal server error';
            return output;
        }

        return output;
    }


}