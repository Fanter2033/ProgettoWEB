const User = require("../entities/User");
const Model = require("./Model");
const mongoose = require("mongoose");
module.exports = class UserModel extends Model {
    constructor(userCollectionName) {
        super(userCollectionName);
        this.connectedMongoose = null;
        this.userMongoose = null;
    }

    async checkMongoose(){
        if(this.connectedMongoose === null) {
            this.connectedMongoose = await this.connectMongoose();
            this.userMongoose = this.getMongooseUserModel(this.connectedMongoose, User);
        }
    }

    getMongooseUserModel(mongoose, schema) {
        return mongoose.model('User', schema);
    }

    /**
     * @param username
     * @return {{}|User}
     */
    async getUser(username) {
        await this.checkMongoose();
        let filter = {"username": `${username}`};
        filter = this.mongo_escape(filter);
        let results = await this.userMongoose.find(filter);
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
        let user = this.getUser(username);
        return (Object.keys(user).length > 0);
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
        await this.checkMongoose();
        let filter = {"username": `${username}`};
        filter = this.mongo_escape(filter);
        let response = await collection.deleteOne(filter);
        return response.deletedCount > 0;
    }

    /**
     * @param userObj
     * @returns {Promise<boolean>}
     */
    async createUser(userObj) {
        userObj = this.mongo_escape(userObj);
        let response = await this.userMongoose.insertOne(userObj);
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