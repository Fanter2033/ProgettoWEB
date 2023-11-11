const Controller = require("./Controller");
const VipDto = require("../entities/dtos/VipDto")

module.exports = class VipController extends Controller {
    constructor(model) {
        super();
        this._model = model;
    }

    /**
     *
     * @param username {String}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async getVip(username){
        let output = this.getDefaultOutput();
        let vip = await this._model.getVip(username);
        if(!(vip instanceof VipDto)){
            output["code"] = 404;
            output["msg"] = "Vip not found";
            return output;
        }
        output['content'] = vip.getDocument();
        return output;
    }

    /**
     * @param username {String}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async createVip(username){
        let output = this.getDefaultOutput();
        let vipObj = new VipDto();
        vipObj.user = username;
        vipObj.linkedSmm = "";
        vipObj.linkedUsers = "";

        let dbRes = await this._model.createVip(vipObj);
        if (dbRes)
            output['content'] = vipObj.getDocument();
        else{
            output["code"] = 500;
            output["msg"] = "Error creating Vip in db";
        }
        return output;
    }

    /**
     *
     * @param username {String}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async deleteVip(username){
        let output = this.getDefaultOutput();
        let vipObj = await this.getVip(username);
        if (vipObj["code"] !== 200) {
            output["code"] = vipObj['code'];
            output["msg"] = vipObj['msg'];
            return output;
        }

        let res = await this._model.deleteVip(username);
        if (res === false){
            output['code'] = 500;
            output['msg'] = 'Server error in deleting vip'
        }
        return output;
    }

    /**
     * @param username {String}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async disableSmm(username){
        let output = this.getDefaultOutput();
        let vipObj = await this. getVip(username);
        let res = await this._model.disableSmm(vipObj);
        if(res === false){
            output['code'] = 500;
            output['msg'] = 'Server error in deleting vip'
        }
        return output;
    }

    /**
     *
     * @param vipDto {VipDto}
     * @param smmDto {VipDto}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async pickSmm(vipDto, smmDto){
        let output = this.getDefaultOutput();
        let res = await this._model.pickSmm(vipDto, smmDto);
        if(res === false){
            output['code'] = 500
            output['msg'] = 'Server error in pickSmm';
            return output;
        }
        return output
    }


}