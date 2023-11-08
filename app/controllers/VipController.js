const Controller = require("./Controller");
const VipDto = require("../entities/dtos/VipDto")

module.exports = class VipController extends Controller {
    constructor(model) {
        super();
        this._model = model;
    }

    async createVip(username){
        let output = this.getDefaultOutput();
        let vipObj = new VipDto();
        vipObj.id = username;
        vipObj.linkedSmm = [];
        vipObj.linkedUsers = [];

        let dbRes = await this._model.createVip(vipObj);
        if (dbRes)
            output['content'] = vipObj;
        else{
            output["code"] = 500;
            output["msg"] = "Error creating Vip in db";
        }
        return output;
    }

    async deleteVip(username){
        //TODO
    }


}