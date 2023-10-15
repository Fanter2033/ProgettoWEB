const Controller = require("./Controller");

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
     * @param {string} param
     * @return {Promise<void>}
     */
    async getChannel(param) {
        //TODO CONTINUE HERE
    };





}