const Model = require("./Model");
const Squeal = require("../entities/schemas/SquealSchema");
const SquealDto = require("../entities/dtos/SquelDto");
const UserDto = require("../entities/dtos/UserDto");

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
     * @param squealDto {SquealDto}
     * @returns {Promise<boolean>}
     */
    async postSqueal(squealDto){
        await  this.checkMongoose("Squeal", Squeal);
        squealDto = this.mongo_escape(squealDto.getDocument());
        let newSqueal = new this.entityMongooseModel(squealDto);
        try {
            await newSqueal.save();
        } catch (ignored){
            return false;
        }
        return true;
    }

    /**
     * @return {Promise<number>}
     * Returns the next id of the squeal
     */
    async getNextId(){
        await  this.checkMongoose("Squeal", Squeal);
        let result = await this.entityMongooseModel.find({}).sort({'_id': 'desc'}).limit(1);
        if (result.length === 1)
            return parseInt(result[0]) + 1;
        return 1;
    }

}