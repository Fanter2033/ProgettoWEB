const User = require("../entities/User");
module.exports = class UserModel {
    constructor(userCollectionName) {
        this.userCollectionName = userCollectionName;
    }

    async getUser(username) {
        let conn = await autoload.mongoConnectionFunctions.getDatabaseConnection();
        await conn.connect();
        let database = await conn.db(autoload.config._DATABASE_NAME);
        let filter = {"username": `${username}`};
        let collection = await database.collection("users").find(filter).toArray();
        if(collection.length === 1)
            return new User(collection[0].username, collection[0].email, collection[0].first_name, collection[0].last_name, collection[0].psw_shadow, collection[0].registration_timestamp);
        return {};
    }

}