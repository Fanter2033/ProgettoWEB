const User = require("../entities/schemas/UserSchema");
const Model = require("./Model");
const mongoose = require("mongoose");
const UserDto = require("../entities/dtos/UserDto");
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
     * @return {{}|UserDto}
     */
    async getUser(username) {
        await this.checkMongoose();
        let filter = {"username": `${username}`};
        filter = this.mongo_escape(filter);
        let results = await this.userMongoose.find(filter);
        if (results.length === 1)
            return new UserDto(results[0]._doc);
        return {};
    }

    /**
     *
     * @param username
     * @returns {Promise<boolean>}
     * Given a username returns true if the user exists, false otherwise.
     */
    async userExists(username) {
        let user = await this.getUser(username);
        return (user).constructor.name === 'UserDto';
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
        try {
            await this.userMongoose.deleteOne(filter);
        } catch (ignored) {
            return false;
        }
        return true;
    }

    /**
     * @param userObj
     * @returns {Promise<boolean>}
     */
    async createUser(userObj) {
        await this.checkMongoose();
        userObj = this.mongo_escape(userObj.getDocument());
        let userInserting = new this.userMongoose(userObj);
        try {
            await userInserting.save();
        } catch (ignored) {
            return false;
        }
        return true;
    }

    /**
     * @param userObj {UserDto}
     * @param username {string}
     * @returns {Promise<boolean>}
     */
    async replaceUser(userObj, username) {
        await this.checkMongoose();
        let filter = {"username": `${username}`};
        filter = this.mongo_escape(filter);
        userObj = this.mongo_escape(userObj.getDocument());
        try {
            await this.userMongoose.replaceOne(filter, userObj);
        } catch (ignored) {
            return false;
        }
        return true;

    }

}