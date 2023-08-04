//General autoload file.
//It is used to require all autoload files for every request.

const config = require('../config/squealer');
const mongoConnection = require('./databaseConnection');
mongoConnection.setDatabaseParams(config._DATABASE_USER, config._DATABASE_PWD, config._DATABASE_HOST, config._DATABASE_PORT, config._DATABASE_NAME, config._DATABASE_EXTRA);


//Export all for all routers!
exports.config = config;
exports.mongoConnectionFunctions = mongoConnection;

