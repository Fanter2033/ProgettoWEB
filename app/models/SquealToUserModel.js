const Model = require("./Model");
const SquealUser = require('../entities/schemas/SquealUser');
const SquealChannel = require("../entities/schemas/SquealChannel");
module.exports = class SquealToUserModel extends Model {
    constructor() {
        super();
    }

    /**
     * @param {Squeal2UserDto} dto
     * @return {Promise<boolean>}
     */
    async createAssocSquealUser(dto) {
        await this.checkMongoose("squeal_to_users", SquealUser);
        let doc = this.mongo_escape(dto.getDocument());
        let newAssoc = new this.entityMongooseModel(doc);
        try {
            await newAssoc.save();
        } catch (ignored) {
            return false;
        }
        return true;
    }


    /**
     * @param {number} squeal_id
     * @param {string} username
     * @return {Promise<boolean>}
     */
    async isUserDest(squeal_id, username) {
        await this.checkMongoose("squeal_to_users", SquealUser);

        squeal_id = this.mongo_escape(squeal_id);
        username = this.mongo_escape(username);

        let filter = {
            "squeal_id": `${squeal_id}`,
            "destination_username": `${username}`
        }
        let results = await this.entityMongooseModel.find(filter);
        if (results.length === 0)
            return false;
        return true;
    }

    /**
     * @param oldUsername {string}
     * @param newUsername {string}
     * @return {Promise<boolean>}
     */
    async replaceUser(oldUsername, newUsername) {
        await this.checkMongoose("squeal_to_users", SquealUser);
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
    async deleteUser(username) {
        await this.checkMongoose("squeal_to_users", SquealUser);
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

    /**
     * @param username {string}
     * @param excludeFrom {number}
     * @param excludeTo {number}
     * @param limit {number}
     * @return {Promise<number[]>}
     */
    async getSquealsToUser(username, excludeFrom, excludeTo, limit) {
        await this.checkMongoose("squeal_to_users", SquealUser);

        username = this.mongo_escape(username);
        excludeFrom = this.mongo_escape(excludeFrom);
        excludeTo = this.mongo_escape(excludeTo);
        limit = this.mongo_escape(limit);

        let filter = {
            "destination_username": `${username}`,
            $or: [
                {$expr: {$lt: ["$squeal_id", `${excludeFrom}`]}},
                {$expr: {$gt: ["$squeal_id", `${excludeTo}`]}},
            ]
        }
        let output = [];
        try {
            let result = await this.entityMongooseModel.find(filter).sort({squeal_id: -1}).limit(limit);
            for (const resultElement of result)
                if(output.length === 0 || output[output.length - 1] !== resultElement._doc['squeal_id'])
                    output.push(resultElement._doc['squeal_id']);
            return output;
        } catch (ignored) {
            return output;
        }
    }


    /**
     * @param {string} search_sender
     * @return {Promise<numbers[] | []>}
     */
    async getIdSquealsFromDestSearchUsers(search_sender){
        await this.checkMongoose("squeal_to_users", SquealUser);
        search_sender = this.mongo_escape(search_sender);
        let filter = {
            destination_username: {$regex: search_sender}
        };

        let out = [];

        if(search_sender === '')
            return out;

        let result = await this.entityMongooseModel.find(filter).sort({squeal_id: -1});
        for (const resultElement of result)
            out.push(resultElement._doc['squeal_id']);
        return out;
    }


}