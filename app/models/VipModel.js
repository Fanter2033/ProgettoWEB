const Model = require("./Model");
const VipUser = require("../entities/schemas/VipSchema")

module.exports = class VipModel extends Model {
    constructor(userCollectionName) {
        super(userCollectionName);
    }

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
}