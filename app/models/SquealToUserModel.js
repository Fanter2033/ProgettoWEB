const Model = require("./Model");
const SquealUser = require('../entities/schemas/SquealUser');
module.exports = class SquealToUserModel extends Model {
    constructor() {
        super();
    }

    /**
     * @param {Squeal2UserDto} dto
     * @return {Promise<boolean>}
     */
    async createAssocSquealUser(dto){
        await  this.checkMongoose("squeal_to_users", SquealUser);
        let doc = this.mongo_escape(dto.getDocument());
        let newAssoc = new this.entityMongooseModel(doc);
        try {
            await newAssoc.save();
        } catch (ignored){
            return false;
        }
        return true;
    }

}