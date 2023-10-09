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

    /**
     *
     * @param {number} offset
     * @param {number} limit
     * @param {string} search
     * @param {string} orderBy
     * @param {string} orderDir
     * @returns {Promise<UserDto | {}>}
     */
    async getUserList(offset, limit, search, orderBy, orderDir) {
        await this.checkMongoose("User", User);
        orderDir = (orderDir === 'ORDER_ASC' ? 'asc' : 'desc');
        let filter = {
            $or: [
                {username: {$regex: this.mongo_escape(search)}},
                {first_name: {$regex: this.mongo_escape(search)}},
                {last_name: {$regex: this.mongo_escape(search)}},
                {email: {$regex: this.mongo_escape(search)}}
            ]
        };
        let sorting = {};
        sorting[orderBy] = orderDir;
        sorting = this.mongo_escape(sorting);

        if (orderBy === '')
            sorting = {};

        offset = this.mongo_escape(offset);
        limit = this.mongo_escape(limit);
        try {
            let results = await this.entityMongooseModel
                .find(filter)
                .sort(sorting)
                .skip(offset)
                .limit(limit);

            let output = [];
            for (let i = 0; i < results.length; i++)
                output.push(new UserDto(results[i]._doc));
            return output;
        } catch (ignored) {
            return {}
        }
    }

    /**
     * @return {Promise<number>}
     * Returns the number of all users in the DB.
     */
    async getUserCount() {
        return await this.entityMongooseModel.count();
    }

}