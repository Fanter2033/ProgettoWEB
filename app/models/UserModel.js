const User = require("../entities/User");
const Model = require("./Model");
module.exports = class UserModel extends Model {
    constructor(userCollectionName) {
        super(userCollectionName);
    }

    async getUser(username) {
        let filter = {"username": `${username}`};
        filter = this.mongo_escape(filter);
        let collection = await this.getCollection();
        let results = await collection.find(filter).toArray();
        if (results.length === 1)
            return new User(results[0].username, results[0].email, results[0].first_name, results[0].last_name, results[0].psw_shadow, results[0].registration_timestamp);
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
        let response = await collection.insertOne(userObj);
        if(response)
            return true;
        return false;
    }

}