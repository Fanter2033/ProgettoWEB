//testing per registrazione e login

/* BASE CONTROLLER CLASS */
const bcryptjs = require('bcryptjs')
const config = require('../config/squealer')
module.exports = class Controller {

    constructor() {
        this._emailRegex = config._REGEX_EMAIL;
        this.bcryptjs = bcryptjs;
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

    /**
     *
     * @param object
     * @param className
     * @returns {boolean}
     *
     * check if a given object is an instance of a given class
     */
    isInstanceOfClass(object, className) {
        return object.constructor.name === className;
    }

    /**
     *
     * @returns {{msg: string, code: number, sub_code: number,content: {}}}
     */
    getDefaultOutput() {
        return {
            'code': 200,
            'sub_code': 0,
            'msg': 'Ok.',
            'content': {}
        };
    }

    /**
     * @returns {number}
     *
     * return the current date
     */
    getCurrentTimestampMillis() {
        return Date.now();
    }

    /**
     * @returns {number}
     *
     * return the current date in
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
     *
     * crypt a string then create the hash with the salt and return the final hash
     */
    async crypt(string, saltRound = config._CIPHER_SALT) {
        return bcryptjs.genSalt(saltRound)
            .then(salt => {
                return bcryptjs.hash(string, salt);
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
        return bcryptjs
            .compare(string, hash)
            .then(res => {
                return res;
            });
    }

    /**
     * @param max {number}
     * @return {number}
     *
     * get a random value
     */
    getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    /**
     * @param unknown
     * return {boolean}
     * Given an unknown type object returns true if his type is UserDto
     */
    isUserDto(unknown) {
        return unknown instanceof UserDto;
    }

    /**
     * @param authenticatedUser
     * @return {boolean}
     * Given the authenticated user param, return true if the user is authenticated, false otherwise
     */
    isAuthenticatedUser(authenticatedUser){
        return !this.isObjectVoid(authenticatedUser);
    }



    /**
     * @return {string}
     */
    getCurrentDate() {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return yyyy + '/' + mm + '/' + dd;
    }

    /**
     * @return {string|number}
     */
    getCurrentHour() {
        const today = new Date();
        let hr = today.getHours();
        if (hr < 10)
            hr = '0' + hr;
        return hr;
    }

    /**
     * @return {string|number}
     */
    getCurrentMinute() {
        const today = new Date();
        let min = today.getMinutes();
        if (min < 10)
            min = '0' + min;
        return min;
    }

    /**
     * @return {string|number}
     */
    getCurrentSecond() {
        const today = new Date();
        let sec = today.getSeconds();
        if (sec < 10)
            sec = '0' + sec;
        return sec;
    }

    /**
     * @param {string} string
     * @return {boolean}
     */
    isBase64(string) {
        if (string.trim().length === 0) return false;
        return Buffer.from(string, 'base64').toString('base64') === string;
    }

    /**
     * @param {string} string
     * @return {boolean}
     */
    isYoutubeVideo(string) {
        return string.startsWith("https://www.youtube.com/watch");
    }


}