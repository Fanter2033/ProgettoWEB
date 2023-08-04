const { MongoClient } = require("mongodb");
let username, password, host, port, database, extra;
let uri = '';

exports.setDatabaseParams = function (Fusername, Fpassword, Fhost, Fport, Fdatabase, Fextra) {
    username = Fusername;
    password = Fpassword;
    host = Fhost;
    port = Fport;
    database = Fdatabase;
    extra = Fextra
    uri = `mongodb://${username}:${password}@${host}:${port}/${database}${extra}`;
}

exports.getDatabaseConnection = function () {
    return MongoClient.connect(uri);
}