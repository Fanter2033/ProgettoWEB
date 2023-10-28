const mongo_escape = require('mongo-escape').escape;
const mongoose = require('mongoose');
const autoload = require('../autoload/autoload');
module.exports = class Model {

    mongo_escape;
    collection_name;

    constructor(collection_name) {
        this.mongo_escape = mongo_escape;
        this.collection_name = collection_name;
        this.connectedMongoose = null;      //for the connection
        this.entityMongooseModel = null;    //for the specific model
    }

    /**
     * @param name
     * @param schema
     * @returns {Promise<void>}
     *
     * check the connection and get the entity
     */
    async checkMongoose(name, schema){
        if(this.connectedMongoose === null || this.entityMongooseModel === null) {
            this.connectedMongoose = await this.connectMongoose();
            this.entityMongooseModel = this.connectedMongoose.model(name, schema);
        }
    }

    /**
     * @returns {Promise<Db>}
     *
     * Ritorna la promessa del database in config.
     */
    async getDatabase() {
        let conn = await autoload.mongoConnectionFunctions.getDatabaseConnection();
        await conn.connect();
        return conn.db(autoload.config._DATABASE_NAME);
    }

    /**
     * @return {Promise<void>}
     *
     * connect to DataBase (stored in autoload module)
     */
    async connectMongoose(){
        return mongoose.connect(autoload.mongoConnectionFunctions.getDatabaseConnectionUri());
    }

    /**
     * @param collection
     * @returns {Promise<Collection<Document>>}
     *
     * Data il nome di una collezione ritorna la promessa per quella collezione.
     */
    async getCollection(collection = '') {
        if(collection === '') collection = this.collection_name;
        let database = await this.getDatabase();
        return database.collection(collection);
    }

}