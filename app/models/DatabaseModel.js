module.exports = class DatabaseModel {
    constructor(getDatabaseConnection) {
        this.getDatabaseConnection = getDatabaseConnection;
    }

    async getDatabaseCollections() {
        let conn = await autoload.mongoConnectionFunctions.getDatabaseConnection();
        await conn.connect().then();
        let database = await conn.db(autoload.config._DATABASE_NAME);
        return await database.listCollections().toArray();
    }

}