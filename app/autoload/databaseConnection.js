//node module for the database connection with Mongo
const { MongoClient } = require("mongodb");
let username, password, host, port, database, extra;
let uri = '';

//init the variables and create a single uri for the database
exports.setDatabaseParams = function (Fusername, Fpassword, Fhost, Fport, Fdatabase, Fextra) {
    username = Fusername;
    password = Fpassword;
    host = Fhost;
    port = Fport;
    database = Fdatabase;
    extra = Fextra
    uri = `mongodb://${username}:${password}@${host}:${port}/${database}${extra}`;
}

/**
 * @returns {Promise<MongoClient>}
 *
 * connect to the mongo client
 */
exports.getDatabaseConnection = function () {
    return MongoClient.connect(uri);
}

/**
 * get the uri from the Mongo server
 * @return {string}
 *
 * get the database uri
 */
exports.getDatabaseConnectionUri = function () {
    return `mongodb://${username}:${password}@${host}:${port}/${database}${extra}`;
}