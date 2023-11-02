const Model = require("./Model");
const Squeal = require("../entities/schemas/SquealSchema");
const SquealDto = require("../entities/dtos/SquelDto");

module.exports = class SquealModel extends Model {
    constructor(CollectionName) {
        super(CollectionName);
    }

    /**
     *
     * @param identifier {Number}
     * @returns {Promise<SquealDto|{}>}
     */
    async getSqueal(identifier){
        await this.checkMongoose("Squeal", Squeal);
        let filter = {_id: `${identifier}`};
        filter = this.mongo_escape(filter);
        let result = await this.entityMongooseModel.find(filter);
        if(result === 1)
            return new SquealDto(result[0]._doc);
        return {};
    }

    /**
     *
     * @param squealObj {SquealDto}
     * @returns {Promise<boolean>}
     */
    async postSqueal(squealObj){
        await  this.checkMongoose("Squeal", Squeal);
        squealObj = this.mongo_escape(squealObj.getDocument());
        let newSqueal = new this.entityMongooseModel(squealObj);
        try {
            await newSqueal.save();
        } catch (ignored){
            return false;
        }
        return  true;
    }

}