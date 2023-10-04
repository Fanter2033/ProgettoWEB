//General autoload file.
//It is used to require all autoload files for every request.

const config = require('../config/squealer');
const mongoConnection = require('./databaseConnection');
mongoConnection.setDatabaseParams(config._DATABASE_USER, config._DATABASE_PWD, config._DATABASE_HOST, config._DATABASE_PORT, config._DATABASE_NAME, config._DATABASE_EXTRA);


//Export all for all routers!
exports.config = config;
exports.mongoConnectionFunctions = mongoConnection;

const logger = require('npmlog');
const loggerFile = require('npmlog-file');

exports.logger = logger;
exports.loggerFile = loggerFile;
exports.logRequests = function (requestObject, next) {
    exports.loggerFile.write(autoload.logger, `logs/accesslog_${(new Date).toISOString().split('T')[0]}.txt`);
    exports.logger.info(`[${(new Date).toISOString().split('T')[0]} ${(new Date).toISOString().split('T')[1].split('.')[0]}][${requestObject.method}][${requestObject.socket.remoteAddress}] Has requested the document: ${requestObject.originalUrl}. \n Request body: ${JSON.stringify(requestObject.body)} \n`);
    next();
}