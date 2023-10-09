//testing per registrazione e login
const bcrypt = require('bcrypt')
const config = require('../config/squealer')
module.exports = class Controller {

    constructor() {
        this._emailRegex = config._REGEX_EMAIL;
        this.bcrypt = bcrypt;
    }


    /**
     *
     * @param obj
     * @returns {boolean}
     *
     * Gived an object returns true if is void, false otherwise.
     *
     */
    isObjectVoid(obj) {
        if(obj === undefined || obj === null) return true;
        if (Object.keys(obj).length === 0)
            return true;
        return false;
    }

    isInstanceOfClass(object, className) {
        return object.constructor.name === className;
    }

    getDefaultOutput() {
        return {
            'code': 200,
            'msg': 'Ok.',
            'content': {}
        };
    }

    /**
     * @returns {number}
     */
    getCurrentTimestampMillis() {
        return Date.now();
    }

    /**
     * @returns {number}
     */
    getCurrentTimestampSeconds() {
        return parseInt(this.getCurrentTimestampMillis() / 1000);
    }

    /**
     * @param email
     * @return {boolean}
     *
     * Returns true if param passed is an email, false otherwise.
     *
     */
    isEmail(email) {
        if (email !== '' && email.match(this._emailRegex))
            return true;
        return false;
    }

    /**
     *
     * @param string {string}
     * @param saltRound {number}
     */
    async crypt(string, saltRound = config._CIPHER_SALT) {
        return bcrypt.genSalt(saltRound)
            .then(salt => {
                return bcrypt.hash(string, salt);
            })
            .then(hash => {
                return hash;
            });
    }

    /**
     *
     * @param hash {string}
     * @param string {string}
     * @param saltRound {number}
     * @return Promise
     *
     * If the string is the hash passed returns true, false otherwise.
     *
     */
    async hashCheck(hash, string, saltRound = config._CIPHER_SALT) {
        return bcrypt
            .compare(string, hash)
            .then(res => {
                return res;
            });
    }

    /**
     * @param max {number}
     * @return {number}
     */
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

}