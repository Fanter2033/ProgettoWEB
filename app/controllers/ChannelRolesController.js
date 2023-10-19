const Controller = require("./Controller");
const ChannelRoleDto = require("../entities/dtos/ChannelRoleDto");
/**
 * @type {ChannelRolesController}
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
    async createRole(channelRoleDto){
        let output = this.getDefaultOutput();
        //no controls to do here. Let's insert
        let insertSuccessful = await this.#_model.insertRole(channelRoleDto);
        if(insertSuccessful === false){
            output['code'] = 500;
            output['msg'] = 'Error inserting';
        }

        output['content'] = channelRoleDto.getDocument();
        return output;
    }

    /**
     * @param {string} username
     * @return {Promise<{msg: string, code: number, sub_code: number,content: {}}>}
     */
    async deleteUserRole(username) {
        let output = this.getDefaultOutput();
        let channelRoleDto = new ChannelRoleDto();
        channelRoleDto.username = username;
        channelRoleDto.role = autoload.config._CHANNEL_ROLE_OWNER;
        let channels = await this.#_model.getChannelsByRoleDto(channelRoleDto);
        return output;
    }

}