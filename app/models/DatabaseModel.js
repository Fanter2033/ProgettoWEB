module.exports = class DatabaseModel {
    constructor() {
    }

    async getDatabaseCollections() {
        let conn = await autoload.mongoConnectionFunctions.getDatabaseConnection();
        await conn.connect().then();
        let database = await conn.db(autoload.config._DATABASE_NAME);
        return await database.listCollections().toArray();
    }

    async getCollectionContent(collectionName) {
        let conn = await autoload.mongoConnectionFunctions.getDatabaseConnection();
        await conn.connect();
        let database = await conn.db(autoload.config._DATABASE_NAME);
        let collectionData = await database.collection(collectionName).find({}).toArray();
        return collectionData;
    }

    /**
     * @param collectionName
     * @returns {Promise<boolean>}
     *
     * given collectionName return true if exists, false otherwise.
     *
     */
    async collectionExists(collectionName) {
        let collections = await this.getDatabaseCollections();
        for (const collectionsKey in collections)
            if (collections[collectionsKey].name === collectionName)
                return true;
        return false;
    }

    /**
     *
     * @param collectionName
     * @param field
     * @returns {Promise<string>}
     * returns the name of the index created or already exists.
     */
    async makeFieldUnique(collectionName, field) {
        let conn = await autoload.mongoConnectionFunctions.getDatabaseConnection();
        await conn.connect();
        let database = await conn.db(autoload.config._DATABASE_NAME);
        let request = {};
        request[field] = 1;
        request['unique'] = 1;
        return await database.collection(collectionName).createIndex(request);
    }

}