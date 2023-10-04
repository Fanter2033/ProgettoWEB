const User = require("../entities/schemas/UserSchema");
const Model = require("./Model");
const mongoose = require("mongoose");
const UserDto = require("../entities/dtos/UserDto");
module.exports = class UserModel extends Model {
    constructor(userCollectionName) {
        super(userCollectionName);
    }

    /**
     * @param username
     * @return {{}|UserDto}
     */
    async getUser(username) {
        await this.checkMongoose("User", User);
        let filter = {"username": `${username}`};
        filter = this.mongo_escape(filter);
        let results = await this.entityMongooseModel.find(filter);
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
        await this.checkMongoose("User", User);
        let filter = {"username": `${username}`};
        filter = this.mongo_escape(filter);
        try {
            await this.entityMongooseModel.deleteOne(filter);
        } catch (ignored) {
            return false;
        }
        return true;
    }

    /**
     * @param userObj {UserDto}
     * @returns {Promise<boolean>}
     */
    async createUser(userObj) {
        await this.checkMongoose("User", User);
        userObj = this.mongo_escape(userObj.getDocument());
        let userInserting = new this.entityMongooseModel(userObj);
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
        await this.checkMongoose("User", User);
        let filter = {"username": `${username}`};
        filter = this.mongo_escape(filter);
        userObj = this.mongo_escape(userObj.getDocument());
        try {
            await this.entityMongooseModel.replaceOne(filter, userObj);
        } catch (ignored) {
            return false;
        }
        return true;

    }

}