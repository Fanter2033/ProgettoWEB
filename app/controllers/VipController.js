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
        vipObj._id = username;
        vipObj.linkedSmm = null;
        vipObj.linkedUsers = null;

        let dbRes = await  this._model.createVip(vipObj);
        if (dbRes)
            output['content'] = vipObj;
        else{
            output["code"] = 500;
            output["msg"] = "Error creating Vip in db";
        }
        return output;
    }


}