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


/*
exports.getDatabaseConnection = function (username, password, host, port, database, extra) {
    let MongoClient = require('mongodb').MongoClient;
    let uri = `mongodb://${username}:${password}@${host}:${port}/${extra}`;
    console.log(uri);
    let client = new MongoClient(uri);
    client.db("database")
    return client.connect()
};
 */

/*
connection.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Connected to database!");
    db.close();
});
 */

/*
// if I want to insert into the database...
    const connect = connection
    connect.then(() => {
        const doc = { id: 3 }
        const db = client.db('database_name')
        const coll = db.collection('collection_name')
        coll.insertOne(doc, (err, result) => {
            if(err) throw err
        })
    })
 */