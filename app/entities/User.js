const {Schema} = require( "mongoose");

module.exports = new Schema({
    username: {type: String, index: true, unique: true},
    email: {type: String, index: true, unique: true},
    first_name: String,
    last_name: String,
    psw_shadow: String,
    registration_timestamp: Number,
    isUser: Boolean,
    isSmm: Boolean,
    isAdmin: Boolean
});
/*
module.exports = class User {

    constructor(username, email, firstname = '', lastname = '', password = '', registration_timestamp = 0, isUser = false, isSmm = false, isAdmin = false) {
        this.username = username;
        this.email = email;
        this.first_name = firstname;
        this.last_name = lastname;
        this.psw_shadow = password;
        this.registration_timestamp = registration_timestamp;
        this.isUser = isUser;
        this.isSmm = isSmm;
        this.isAdmin = isAdmin;
    }


    getUsername() {
        return this.username;
    }

    setUsername(value) {
        this.username = value;
    }

    getEmail() {
        return this.email;
    }

    setEmail(value) {
        this.email = value;
    }

    getFirstname() {
        return this.first_name;
    }

    setFirstname(value) {
        this.first_name = value;
    }

    getLastname() {
        return this.last_name;
    }

    setLastname(value) {
        this.last_name = value;
    }

    getPassword() {
        return this.psw_shadow;
    }

    setPassword(value) {
        this.psw_shadow = value;
    }

    getRegistrationTimestamp() {
        return this.registration_timestamp;
    }

    setRegistrationTimestamp(value) {
        this.registration_timestamp = value;
    }


    checkIsUser() {
        return this.isUser;
    }

    checkIsSmm() {
        return this.isSmm;
    }

    checkIsAdmin() {
        return this.isAdmin;
    }
}
 */