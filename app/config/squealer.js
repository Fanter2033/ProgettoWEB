//Config file

//Developing mode
exports.isDebug = true;

//Webserver
exports._WEBSERVER_PORT = 8000;

//Mongo db database
if(exports.isDebug){
    exports._DATABASE_USER = "site222317";
    exports._DATABASE_PWD = "tagira5A";
    exports._DATABASE_HOST = "217.61.59.180"; //Aka alpaca-vps
    exports._DATABASE_PORT = '7917';
    exports._DATABASE_NAME = "site222317";
    exports._DATABASE_EXTRA = "";
}else{
    exports._DATABASE_USER = "site222317";
    exports._DATABASE_PWD = "tagira5A";
    exports._DATABASE_HOST = "mongo_site222317";
    exports._DATABASE_PORT = '27017';
    exports._DATABASE_NAME = "site222317";
    exports._DATABASE_EXTRA = "";
}
