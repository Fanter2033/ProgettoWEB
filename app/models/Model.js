const mongo_escape = require('mongo-escape').escape;
module.exports = class Model {

    mongo_escape;

    collection_name;

    constructor(collection_name) {
        this.mongo_escape = mongo_escape;
        this.collection_name = collection_name;
    }

    /**
     * @returns {Promise<Db>}
     * Ritorna la promessa del database in config.
     */
    async getDatabase() {
        let conn = await autoload.mongoConnectionFunctions.getDatabaseConnection();
        await conn.connect();
        return conn.db(autoload.config._DATABASE_NAME);
    }

    /**
     * @param collection
     * @returns {Promise<Collection<Document>>}
     * Data il nome di una collezione ritorna la promessa per quella collezione.
     */
    async getCollection(collection = '') {
        if(collection === '') collection = this.collection_name;
        let database = await this.getDatabase();
        return database.collection(collection);
    }

}