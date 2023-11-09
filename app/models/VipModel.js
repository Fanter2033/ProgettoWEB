const Model = require("./Model");
const VipUser = require("../entities/schemas/VipSchema");
const VipDto = require("../entities/dtos/VipDto")

module.exports = class VipModel extends Model {
    constructor(userCollectionName) {
        super(userCollectionName);
    }

    /**
     * @param username {String}
     * @returns {Promise<VipDto|{}>}
     */
    async getVip(username){
        await this.checkMongoose("VipUser", VipUser);
        let filter = { user: `${username}`};
        let vipFound = await this.entityMongooseModel.find(filter);
        if(vipFound.length === 1)
            return new VipDto(vipFound[0]);
        return {};
    }

    /**
     * @param VipUserObj {VipDto}
     * @returns {Promise<boolean>}
     */
    async createVip(VipUserObj){
        await this.checkMongoose("VipUser", VipUser);
        VipUserObj = this.mongo_escape(VipUserObj.getDocument());
        let newVipUser = new this.entityMongooseModel(VipUserObj);

        try {
            await newVipUser.save();
        } catch (ignored) {
            return false;
        }
        return true;
    }

    /**
     *
     * @param username {String}
     * @returns {Promise<boolean>}
     */
    async deleteVip(username){
        await this.checkMongoose("VipUser", VipUser);
        let filter = { user: `${username}`};
        filter = this.mongo_escape(filter);
        try {
            await this.entityMongooseModel.deleteOne(filter);
        } catch (ignored) {
            return false;
        }
        return true;
    }

    async disableSmm(vipObj){
        await this.checkMongoose("VipUser", VipUser);
        let filter = { user: `${vipObj.username}`};
        filter = this.mongo_escape(filter);
        vipObj.linkedUsers = [];
        vipObj = this.mongo_escape(vipObj);
        try{
            await this.entityMongooseModel.updateOne(filter, vipObj);
        } catch (ignored){
            return false;
        }
        return true;
    }
}