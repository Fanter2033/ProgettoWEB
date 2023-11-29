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
        let filter = { "user": `${username}`};
        let vipFound = await this.entityMongooseModel.find(filter);
        if(vipFound.length === 1)
            return new VipDto(vipFound[0]._doc);
        return {};
    }

    /**
     * create a vip entity from the db
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
     * just delete a vip entity from the db
     * @param username {String}
     * @returns {Promise<boolean>}
     */
    async deleteVip(username){
        await this.checkMongoose("VipUser", VipUser);
        let filter = { "user": `${username}`};
        filter = this.mongo_escape(filter);
        try {
            await this.entityMongooseModel.deleteOne(filter);
        } catch (ignored) {
            return false;
        }
        return true;
    }

    /**
     * clear the linked
     * @param vipDto {VipDto}
     * @returns {Promise<boolean>}
     */
    async disableSmm(vipDto){
        await this.checkMongoose("VipUser", VipUser);
        let filter = { user: `${vipDto.user}`};
        filter = this.mongo_escape(filter);
        vipDto.linkedUsers = [];
        vipDto = this.mongo_escape(vipDto.getDocument());
        try{
            await this.entityMongooseModel.updateOne(filter, vipDto);
        } catch (ignored){
            return false;
        }
        return true;
    }

    /**
     * - the vip will have a linkedSmm and
     * - the smm will have a user added in his list of linkedAccounts
     * @param vipDto {VipDto}
     * @param SmmDto {VipDto}
     * @returns {Promise<boolean>}
     */
    async pickSmm(vipDto, SmmDto){
        await this.checkMongoose("VipUser", VipUser);
        vipDto['linkedSmm'] = SmmDto.user;
        let filter = {"user": `${vipDto.user}`};
        filter = this.mongo_escape(filter);
        vipDto = this.mongo_escape(vipDto.getDocument());

        let SmmFilter = {"user": `${SmmDto.user}`};
        SmmFilter = this.mongo_escape(SmmFilter);

        try{
            await this.entityMongooseModel.updateOne(filter, vipDto);
            await this.entityMongooseModel.updateOne (SmmFilter,
                { $push: {linkedUsers: `${vipDto.user}`}}, //apparentemente funziona
        )
        } catch (ignored) {
            return false;
        }
        return true;
    }

    /**
     * - the vip will have his linkedSmm set to null and
     * - the smm will have a user removed from his list of linkedAccounts
     * @param vipDto {VipDto}
     * @param smmDto {VipDto}
     * @returns {Promise<boolean>}
     */
    async removeSmm(vipDto, smmDto){
        await this.checkMongoose("VipUser", VipUser);
        vipDto['linkedSmm'] = "";
        let filter = {"user": `${vipDto['user']}`};

        filter = this.mongo_escape(filter);
        vipDto = this.mongo_escape(vipDto.getDocument());

        let SmmFilter = {"user": `${smmDto['user']}`}
        SmmFilter = this.mongo_escape(SmmFilter);

        try {
            await this.entityMongooseModel.updateOne(filter, vipDto);
            await this.entityMongooseModel.updateOne(SmmFilter,
                { $pull:{ linkedUsers: `${vipDto.user}` }}
            );
        } catch (ignored) {
            return false;
        }
        return true;
    }
}