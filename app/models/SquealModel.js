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
        if(result.length === 1)
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
     * @param squealDto {SquealDto}
     * @param squeal_id {number}
     * @returns {Promise<boolean>}
     */
    async replaceSqueal(squealDto, squeal_id){
        await  this.checkMongoose("Squeal", Squeal);
        let squealDoc = this.mongo_escape(squealDto.getDocument());
        squeal_id = parseInt(squeal_id);
        if(isNaN(squeal_id))
            return false;

        try {
            await this.entityMongooseModel.findByIdAndUpdate(squealDto.id, squealDoc);
            return true;
        } catch (ignored){
            return false;
        }
    }

    /**
     * @return {Promise<number>}
     * Returns the next id of the squeal
     */
    async getNextId(){
        await  this.checkMongoose("Squeal", Squeal);
        let result = await this.entityMongooseModel.find({}).sort({'_id': 'desc'}).limit(1);
        if (result.length === 1)
            return parseInt(result[0]._doc._id) + 1;
        return 1;
    }

    /**
     * @param oldUsername {string}
     * @param newUsername {string}
     * @return {Promise<boolean>}
     */
    async replaceUser(oldUsername, newUsername){
        await this.checkMongoose("Squeal", Squeal);
        let filter = {sender: `${oldUsername}`};
        filter = this.mongo_escape(filter);
        let update = {sender: `${newUsername}`}
        try {
            let result = await this.entityMongooseModel.updateMany(filter, update);
            return true;
        } catch (ignored) {
            return false;
        }
    }

    /**
     * @param username {string}
     * @return {Promise<boolean>}
     */
    async deleteUser(username){
        await this.checkMongoose("Squeal", Squeal);
        let filter = {sender: `${username}`};
        filter = this.mongo_escape(filter);
        let update = {sender: `${username}`}
        try {
            await this.entityMongooseModel.deleteMany(filter, update);
            return true;
        } catch (ignored) {
            return false;
        }
    }

}