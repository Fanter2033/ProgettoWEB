module.exports = class User {

    constructor(username, email, firstname = '', lastname = '', password = '', registration_timestamp = 0) {
        this._username = username;
        this._email = email;
        this._firstname = firstname;
        this._lastname = lastname;
        this._password = password;
        this._registration_timestamp = registration_timestamp;
    }


    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get firstname() {
        return this._firstname;
    }

    set firstname(value) {
        this._firstname = value;
    }

    get lastname() {
        return this._lastname;
    }

    set lastname(value) {
        this._lastname = value;
    }

    get password() {
        return this._password;
    }

    set password(value) {
        this._password = value;
    }

    get registration_timestamp() {
        return this._registration_timestamp;
    }

    set registration_timestamp(value) {
        this._registration_timestamp = value;
    }
}