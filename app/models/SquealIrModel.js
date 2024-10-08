const Model = require("./Model");
const SquealIrSchema = require("../entities/schemas/SquealIrSchema");
const SquealIrDto = require("../entities/dtos/SquealIrDto");
module.exports = class SquealIrModel extends Model {
    constructor() {
        super();
    }

    /**
     * @param {SquealIrDto} dto
     * @return {Promise<boolean>}
     */
    async createAssocSquealUser(dto){
        await  this.checkMongoose("squeal_impression_reactions", SquealIrSchema);
        let doc = this.mongo_escape(dto.getDocument());
        let newAssoc = new this.entityMongooseModel(doc);
        try {
            await newAssoc.save();
        } catch (ignored){
            return false;
        }
        return true;
    }

    /**
     * @param {SquealIrDto} dto
     * @return {Promise<boolean>}
     */
    async assocExists(dto){
        await  this.checkMongoose("squeal_impression_reactions", SquealIrSchema);
        let filter = this.mongo_escape(dto.getDocument());

        try {
            let result = await this.entityMongooseModel.find(filter);
            return result.length !== 0;
        } catch (ignored){
            return false;
        }
    }

    /**
     * @param {SquealIrDto} dto
     * @return {Promise<SquealIrDto>}
     */
    async getCurrentAssoc(dto){
        await  this.checkMongoose("squeal_impression_reactions", SquealIrSchema);
        let filter = this.mongo_escape(dto.getDocument());
        if(typeof filter.reaction !== 'undefined')
            delete filter.reaction;
        try {
            let result = await this.entityMongooseModel.find(filter);
            return new SquealIrDto(result[0]._doc);
        } catch (ignored){
            return {};
        }
    }

    async deleteCurrentAssoc(dto){
        await  this.checkMongoose("squeal_impression_reactions", SquealIrSchema);
        let filter = this.mongo_escape(dto.getDocument());
        if(typeof filter.reaction !== 'undefined')
            delete filter.reaction;
        try {
            let result = await this.entityMongooseModel.deleteMany(filter);
            return true;
        } catch (ignored){
            return false;
        }
    }

    /**
     * @param {SquealIrDto} dto
     * @return {Promise<boolean>}
     */
    async insertReactionIntoAssoc(dto){
        await  this.checkMongoose("squeal_impression_reactions", SquealIrSchema);
        let filter = this.mongo_escape(dto.getDocument());
        if(typeof filter.reaction !== 'undefined')
            delete filter.reaction;
        let newAssoc = this.mongo_escape(dto.getDocument());
        try {
            await this.entityMongooseModel.findOneAndReplace(filter, newAssoc);
            return true;
        } catch (ignored){
            return false;
        }
    }

    /**
     * @param oldUsername {string}
     * @param newUsername {string}
     * @return {Promise<boolean>}
     */
    async replaceUser(oldUsername, newUsername){
        await  this.checkMongoose("squeal_impression_reactions", SquealIrSchema);
        let filter = {value: `${oldUsername}`, is_session_id: false};
        filter = this.mongo_escape(filter);
        let update = {value: `${newUsername}`, is_session_id: false};
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
        await  this.checkMongoose("squeal_impression_reactions", SquealIrSchema);
        let filter = {value: `${username}`, is_session_id: false};
        filter = this.mongo_escape(filter);
        try {
            let result = await this.entityMongooseModel.deleteMany(filter);
            return true;
        } catch (ignored) {
            return false;
        }
    }


    /**
     * @param {number} squeal_id
     * @return {Promise<number>}
     * Given a squeal id returns the total impression assoc to it
     */
    async countImpression(squeal_id){
        await  this.checkMongoose("squeal_impression_reactions", SquealIrSchema);
        if(isNaN(squeal_id))
            return -1;

        let filter = {squeal_id: `${squeal_id}`};
        filter = this.mongo_escape(filter);
        try {
            let result = await this.entityMongooseModel.count(filter);
            return result;
        } catch (ignored) {
            return -1;
        }
    }

}