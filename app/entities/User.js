module.exports = class User {

    constructor(username, email, firstname = '', lastname = '', password = '', registration_timestamp = 0) {
        this.username = username;
        this.email = email;
        this.firstname = firstname;
        this.lastname = lastname;
        this.password = password;
        this.registration_timestamp = registration_timestamp;
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
        return this.firstname;
    }

    setFirstname(value) {
        this.firstname = value;
    }

    getLastname() {
        return this.lastname;
    }

    setLastname(value) {
        this.lastname = value;
    }

    getPassword() {
        return this.password;
    }

    setPassword(value) {
        this.password = value;
    }

    getRegistrationTimestamp() {
        return this.registration_timestamp;
    }

    setRegistrationTimestamp(value) {
        this.registration_timestamp = value;
    }
}