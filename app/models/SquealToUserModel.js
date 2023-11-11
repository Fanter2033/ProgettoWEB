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


    /**
     * @param {number} squeal_id
     * @param {string} username
     * @return {Promise<boolean>}
     */
    async isUserDest(squeal_id, username){
        await  this.checkMongoose("squeal_to_users", SquealUser);

        squeal_id = this.mongo_escape(squeal_id);
        username = this.mongo_escape(username);

        let filter = {
            "squeal_id": `${squeal_id}`,
            "destination_username": `${username}`
        }
        let results = await this.entityMongooseModel.find(filter);
        if(results === 0)
            return false;
        return true;
    }

    /**
     * @param oldUsername {string}
     * @param newUsername {string}
     * @return {Promise<boolean>}
     */
    async replaceUser(oldUsername, newUsername){
        await  this.checkMongoose("squeal_to_users", SquealUser);
        let filter = {
            "destination_username": `${oldUsername}`
        }
        filter = this.mongo_escape(filter);
        let update = {
            "destination_username": `${newUsername}`
        }
        update = this.mongo_escape(update);
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
        await  this.checkMongoose("squeal_to_users", SquealUser);
        let filter = {
            "destination_username": `${username}`
        }
        filter = this.mongo_escape(filter);
        try {
            let result = await this.entityMongooseModel.deleteMany(filter);
            return true;
        } catch (ignored) {
            return false;
        }
    }

}