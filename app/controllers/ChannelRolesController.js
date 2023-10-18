const Controller = require("./Controller");
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
     * @return {Promise<void>}
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
            output['msg'] = 'error inserting';
        }

        output['content'] = channelRoleDto.getDocument();
        return output;
    }

}