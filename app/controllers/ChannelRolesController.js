const Controller = require("./Controller");
const ChannelRoleDto = require("../entities/dtos/ChannelRoleDto");
const ChannelDto = require("../entities/dtos/ChannelDto");
/**
 * HUGELY IMPORTANT
 * TO AVOID CIRCULAR DEPENDENCIES DO NOT IMPORT HERE CHANNEL CONTROLLER AND USER CONTROLLER.
 * Ty <3
 *
 * @author romanellas
 *
 */
module.exports = class ChannelRolesController extends Controller {
    #_model;

    /**
     * @param {ChannelRolesModel} model
     */
    constructor(model) {
        super();
        this.#_model = model;
    }


    /**
     * @param {ChannelRoleDto} channelRoleDto
     * @return {Promise<{msg: string, code: number, content: {}}>}
     * Precondition: User exists
     * Precondition: Channel exists
     * Precondition: Requesting user has authorization to do this
     */
    async createRole(channelRoleDto) {
        let output = this.getDefaultOutput();
        //no controls to do here. Let's insert
        let insertSuccessful = await this.#_model.insertRole(channelRoleDto);
        if (insertSuccessful === false) {
            output['code'] = 500;
            output['msg'] = 'Error inserting';
        }

        output['content'] = channelRoleDto.getDocument();
        return output;
    }

    /**
     * @param {string} username
     * @param {UserDto} authenticatedUser
     * @return {Promise<{msg: string, code: number, sub_code: number,content: {}}>}
     */
    async deleteUserRole(username, authenticatedUser) {
        let output = this.getDefaultOutput();
        let channelRoleDto = new ChannelRoleDto();
        channelRoleDto.username = username;
        channelRoleDto.role = autoload.config._CHANNEL_ROLE_OWNER;
        let channels = await this.#_model.getChannelsByRoleDto(channelRoleDto);
        let channelRolesSubstitutes = [];
        for (const key in channels) {
            let channelDto = channels[key];
            //Se siamo i proprietari dobbiamo cercare un utente che abbia il privilegio massimo dunque
            channelRoleDto = new ChannelRoleDto();
            channelRoleDto.role = autoload.config._CHANNEL_ROLE_ADMIN;
            channelRoleDto.type = channelDto.type;
            channelRoleDto.channel_name = channelDto.channel_name;
            let userResults = [];
            do {
                userResults = await this.#_model.getUsersByRoleDto(channelRoleDto, 1);
                channelRoleDto.role = channelRoleDto.role - 1;
            } while (channelRoleDto.role >= autoload.config._CHANNEL_ROLE_WAITING_ACCEPT && userResults.length === 0);

            //To avoid to have negative numbers on channelRoleDto.role we increment its by one. Hence we get the real role of found user!
            channelRoleDto.role = channelRoleDto.role + 1;

            if (userResults.length === 0) {
                output['code'] = 400;
                output['sub_code'] = 1;
                output['msg'] = `No sobstitute for §${channelRoleDto.channel_name} channel!`
                output['content'] = channelRoleDto.channel_name;
                return output;
            }

            channelRoleDto.username = userResults[0].username;
            channelRoleDto.role = autoload.config._CHANNEL_ROLE_OWNER;
            channelRoleDto.role_since = this.getCurrentTimestampSeconds();
            channelRolesSubstitutes.push(channelRoleDto);
        }

        let promises = [];

        //Update substitutes!
        for (const key in channelRolesSubstitutes) {
            //Eseguiamo tutte le operazioni in parallelo e le aspettiamo tutte
            promises.push(this.updateUserRole(channelRolesSubstitutes[key], authenticatedUser, true));
        }

        for (let i = 0; i < promises.length; i++) {
            let result = await promises[i];
            if(result['code'] !== 200){
                output['code'] = 500;
                output['sub_code'] = 3;
                output['msg'] = `Error updating roles`;
            }
        }


        //Got substitutes. Let's delete the current user roles!
        let deleteResult = await this.#_model.deleteUserRoles(username);
        if (deleteResult === false) {
            output['code'] = 500;
            output['sub_code'] = 2;
            output['msg'] = `Error trying to delete the user's role. This message should be never shown!`;
        }


        return output;
    }

    /**
     *
     * @param {ChannelDto} channelDto
     * @return {Promise<{msg: string, code: number, sub_code: number,content: {}}>}
     * PRECONDITION: REQUEST IS VALID. THE USER IS AUTHENTICATED AND HAS AUTHORIZATION TO DO THE CHANNEL DELETE.
     * BE CAREFUL!
     *
     * Returns code 500 in case of errors. Code 200 otherwise.
     *
     */
    async deleteChannelRoles(channelDto){
        let output = this.getDefaultOutput();
        //Controls already executed.
        let channelRoleDto = new ChannelRoleDto();
        channelRoleDto.channel_name = channelDto.channel_name;
        channelRoleDto.type = channelDto.type;
        let result = await this.#_model.deleteAllChannelRoles(channelRoleDto);
        if(result === false){
            output['code'] = 500;
            output['msg'] = 'Internal server error.'
            return output;
        }
        return output;
    }

    /**
     * @param {ChannelDto} oldChannel
     * @param {ChannelDto} newChannel
     * @return {Promise<{msg: string, code: number, sub_code: number,content: {}}>}
     */
    async substituteChannels(oldChannel, newChannel){
        let output = this.getDefaultOutput();

        //no controls to do here
        let result = await this.#_model.substituteChannels(oldChannel, newChannel);
        if(!result){
            output['code'] = 500;
            output['msg'] = 'Internal server error.'
            return output;
        }
        return output;
    }

    /**
     * @param oldUsername {string}
     * @param newUsername {string}
     * @return {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async substituteUser(oldUsername, newUsername){
        let output = this.getDefaultOutput();

        //no controls to do here
        let result = await this.#_model.substituteUsers(oldUsername, newUsername);
        if(!result){
            output['code'] = 500;
            output['msg'] = 'Internal server error.'
            return output;
        }
        return output;
    }

    /**
     * @param {ChannelDto} channelDto
     * @param {number} role
     * @return {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     * Given a channelDto returns all users that are subscribers of the channel. In content, saves an array of usernames.
     * NOT A UserDto!!!
     */
    async getChannelSubscribers(channelDto, role){
        let output = this.getDefaultOutput();

        let result = await this.#_model.getAllChannelRoles(channelDto, role);
        let usernames = [];
        for (const roles of result) {
            usernames.push(roles.username);
        }

        output["content"] = usernames;
        return output;
    }


    /**
     *
     * @param {ChannelRoleDto} channelRole
     * @param {UserDto} authenticatedUser
     * @param {boolean} escape_control
     * @returns {Promise<{msg: string, code: number, sub_code: number,content: {}}>}
     *
     * Given a channelRole update the role field with the indicated one.
     * username, channel_name, channel_type are used for search
     * role_since is ignored.
     *
     */
    async updateUserRole(channelRole, authenticatedUser, escape_control = false) {
        let output = this.getDefaultOutput();

        if (channelRole.role < autoload.config._CHANNEL_ROLE_WAITING_ACCEPT || channelRole.role > autoload.config._CHANNEL_ROLE_OWNER) {
            output['code'] = 400;
            output['msg'] = 'Invalid role';
        }

        if(this.isObjectVoid(authenticatedUser)){
            output['code'] = 403;
            output['msg'] = 'Not authenticated';
            return output;
        }

        //Check the user permissions!
        //But first we should know requesting user role.
        let requestingUserRole = new ChannelRoleDto();
        requestingUserRole.channel_name = channelRole.channel_name;
        requestingUserRole.type = channelRole.type;
        requestingUserRole.username = authenticatedUser.username;

        let userChannelRole = await this.#_model.getRolesByDto(requestingUserRole);
        if(userChannelRole === null && authenticatedUser.isAdmin === false){
            output['code'] = 403;
            output['msg'] = 'No role for requesting user';
            return output;
        }

        if ((
            authenticatedUser.isAdmin ||
            (userChannelRole !== null &&
                (userChannelRole.role === autoload.config._CHANNEL_ROLE_OWNER || userChannelRole.role === autoload.config._CHANNEL_ROLE_ADMIN))
        ) === false) {
            output['code'] = 401;
            output['sub_code'] = 1;
            output['msg'] = 'Unauthorized (1)';
            return output;
        }

        if(channelRole.role === autoload.config._CHANNEL_ROLE_OWNER && userChannelRole.role !== autoload.config._CHANNEL_ROLE_OWNER && !authenticatedUser.isAdmin){
            output['code'] = 401;
            output['sub_code'] = 2;
            output['msg'] = 'Unauthorized (2)';
            return output;
        }

        if(channelRole.role === autoload.config._CHANNEL_ROLE_ADMIN && userChannelRole.role !== autoload.config._CHANNEL_ROLE_OWNER && !authenticatedUser.isAdmin){
            output['code'] = 401;
            output['sub_code'] = 3;
            output['msg'] = 'Unauthorized (3)';
            return output;
        }

        if(channelRole.role === autoload.config._CHANNEL_ROLE_OWNER){
            let channelDto = new ChannelDto();
            channelDto.type = channelRole.type;
            channelDto.channel_name = channelRole.channel_name;
            let ctrlOut = await this.getChannelSubscribers(channelDto, autoload.config._CHANNEL_ROLE_OWNER);
            if(ctrlOut.code !== 200){
                output['code'] = 500;
                output['msg'] = 'Internal server error (2)';
                return output;
            }
            let owners = ctrlOut.content;
            for (let username in owners){
                //Downgrade old owners.
                let newRole = new ChannelRoleDto();
                newRole.channel_name = channelRole.channel_name;
                newRole.type = channelRole.type;
                newRole.role = autoload.config._CHANNEL_ROLE_ADMIN;
                newRole.username = username;
                let result = await this.#_model.updateRoleGrade(newRole)
                if(result === false) {
                    output['code'] = 500;
                    output['msg'] = 'Internal server error (2)';
                    return output;
                }
            }
        } else if(!escape_control && userChannelRole !== null && userChannelRole.role < channelRole.role && authenticatedUser.isAdmin === false){
            output['code'] = 401;
            output['sub_code'] = 4;
            output['msg'] = 'Unauthorized (4)';
            return output;
        }

        let current_role = await this.getChannelRoleOfUser(channelRole);
        if(current_role['code'] === 404){
            return this.createRole(channelRole);
        }

        let result = await this.#_model.updateRoleGrade(channelRole);
        if(result === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error';
            return output;
        }

        return output;
    }

    /**
     * @param {ChannelRoleDto} channelRoleDto
     * @return {Promise<{msg: string, code: number, sub_code: number,content: {}}>}
     */
    async getChannelRoleOfUser(channelRoleDto){
        let output = this.getDefaultOutput();

        let modelResult = await this.#_model.getUserRole(channelRoleDto);
        if(modelResult === null){
            output['code'] = 404;
            output['msg'] = 'User role not found'
            output['sub_code'] = 1;
            return output;
        }

        output['content'] = modelResult.getDocument();
        return output;
    }

}