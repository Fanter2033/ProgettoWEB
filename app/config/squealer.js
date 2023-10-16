/* CONFIG FILE */

exports._APPLICATION_NAME = 'squealer';

//Developing mode
exports.isDebug = true;

//Webserver
exports._WEBSERVER_PORT = 8000;

//Mongo db database
if(exports.isDebug){
    exports._DATABASE_USER = "site222317";
    exports._DATABASE_PWD = "tagira5A";
    exports._DATABASE_HOST = "217.61.59.180";    //Aka alpaca-vps
    exports._DATABASE_PORT = '7917';
    exports._DATABASE_NAME = "site222317";
    exports._DATABASE_EXTRA = "";
}else{
    exports._DATABASE_USER = "site222317";
    exports._DATABASE_PWD = "tagira5A";
    exports._DATABASE_HOST = "mongo_site222317"; //macchina lab dimmerda
    exports._DATABASE_PORT = '27017';
    exports._DATABASE_NAME = "site222317";
    exports._DATABASE_EXTRA = "?authSource=admin&writeConcern=majority";
}

//Regex
exports._REGEX_EMAIL = /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

//Cipher settings
exports._CIPHER_SALT = 12;

//Collection name
exports._USER_COLLECTION = 'users';
exports._AUTH_ATTEMPTS_COLLECTION = 'auth_attempts';
exports._SESSION_COLLECTION = 'sessions';

//Quote
exports._QUOTE_DEFAULT_DAILY = 1000;
exports._QUOTE_DEFAULT_WEEKLY = 1000 * 6;
exports._QUOTE_DEFAULT_MONTHLY = 1000 * 20;

//Channels roles
exports._CHANNEL_ROLE_ADMIN = 3;
exports._CHANNEL_ROLE_WRITE = 2;
exports._CHANNEL_ROLE_READ = 1;

//channel privacy
exports._CHANNEL_TYPE_OFFICIAL = 'CHANNEL_OFFICIAL';
exports._CHANNEL_TYPE_USER = 'CHANNEL_USER';
exports._CHANNEL_TYPE_HASHTAG = 'CHANNEL_HASHTAG';

//Session params
exports._SESSION_SECRET = '5DE1ya358SlHeJY52MbH8SHssFJqQh8TZVAyiVKBGDuCl1ZmFlXMqRTRj8hzSqFUJ5iPZwzKt1ERhqR0oabSMFSVxV9HM7KNZhkhQ1wdpkgY70QB5wixx5QvFbeV0uml';


