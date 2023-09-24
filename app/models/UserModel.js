const User = require("../entities/User");
const Model = require("./Model");
const mongoose = require("mongoose");
module.exports = class UserModel extends Model {
    constructor(userCollectionName) {
        super(userCollectionName);
    }

    getMongooseUserModel(mongoose, schema) {
        return mongoose.model('User', schema);
    }

    async getUser(username) {
        let connectMongoose = await this.connectMongoose();
        let userMongoose = this.getMongooseUserModel(connectMongoose, User);
        let filter = {"username": `${username}`};
        filter = this.mongo_escape(filter);
        let results = await userMongoose.find(filter);
        if (results.length === 1)
            return results[0];
        return {};
    }

    /**
     *
     * @param username
     * @returns {Promise<boolean>}
     * Given a username returns true if the user exists, false otherwise.
     */
    async userExists(username) {
        let filter = {"username": `${username}`};
        filter = this.mongo_escape(filter);
        let collection = await this.getCollection();
        let results = await collection.find(filter).toArray();
        return results.length >= 1;
    }

    /**
     *
     * @param username
     * @returns {Promise<boolean>}
     *
     * Given an username this function delete it from database.
     * Returns true on success, false otherwise.
     *
     */
    async deleteUser(username) {
        let filter = {"username": `${username}`};
        filter = this.mongo_escape(filter);
        let collection = await this.getCollection();
        let response = await collection.deleteOne(filter);
        return response.deletedCount > 0;
    }

    /**
     * @param userObj
     * @returns {Promise<boolean>}
     */
    async createUser(userObj) {
        let collection = await this.getCollection();
        userObj = this.mongo_escape(userObj);
        let response = await collection.insertOne(userObj);
        if (response)
            return true;
        return false;
    }

    /**
     * @param userObj {User}
     * @param username {string}
     * @returns {Promise<boolean>}
     */
    async replaceUser(userObj, username) {
        let collection = await this.getCollection();
        let filter = {"username": `${username}`};
        filter = this.mongo_escape(filter);
        userObj = this.mongo_escape(filter);
        let response = await collection.replaceOne(filter, userObj);
        if (response.modifiedCount > 0)
            return true;
        return false;
    }

}