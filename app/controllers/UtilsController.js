const Controller = require("./Controller");
const SquealToUserModel = require("../models/SquealToUserModel");
const SquealController = require("./SquealController");
const SquealModel = require("../models/SquealModel");


module.exports = class UtilsController extends Controller {
    constructor() {
        super();
    }

    /**
     * @param authUser {UserDto}
     * @param excludeFrom {number}
     * @param excludeTo {number}
     * @param sessionId {string}
     * @return {Promise<{msg: string, code: number, sub_code: number,content: {}}>}
     */
    async getSquealsToUser(authUser, excludeFrom, excludeTo, sessionId){
        let output = this.getDefaultOutput();

        if(this.isAuthenticatedUser(authUser) === false){
            output["code"] = 403;
            output["msg"] = "Forbidden";
            return output;
        }

        let squealToUserModel = new SquealToUserModel();
        let squealCtrl = new SquealController(new SquealModel());
        let result = await squealToUserModel.getSquealsToUser(authUser.username, excludeFrom, excludeTo, autoload.config._LIMIT_RETURN_POSTS);
        let promises = [];
        for (const id of result)
            promises.push(squealCtrl.getSqueal(id, authUser, sessionId));
        promises = await Promise.all(promises);
        let content = [];
        for (const promiseResult of promises)
            if(promiseResult.code === 200)
                content.push(promiseResult.content);
        output.content = content;
        return output;
    }


};
