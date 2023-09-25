module.exports = class UserDto {

    #username;
    #email;
    #first_name;
    #last_name;
    #registration_timestamp;
    #psw_shadow;
    #isAdmin;
    #isSmm;
    #isUser;

    constructor(documentFromMongoose = null) {
        if(documentFromMongoose === null) {
            this.#username = null;
            this.#email = null;
            this.#first_name = null;
            this.#last_name = null;
            this.#registration_timestamp = null;
            this.#psw_shadow = null;
            this.#isAdmin = null;
            this.#isSmm = null;
            this.#isUser = null;
        } else {
            this.#username = documentFromMongoose.username;
            this.#email = documentFromMongoose.email;
            this.#first_name = documentFromMongoose.first_name;
            this.#last_name = documentFromMongoose.last_name;
            this.#registration_timestamp = documentFromMongoose.registration_timestamp;
            this.#psw_shadow = documentFromMongoose.psw_shadow;
            this.#isAdmin = documentFromMongoose.isAdmin;
            this.#isSmm = documentFromMongoose.isSmm;
            this.#isUser = documentFromMongoose.isUser;
        }

    }


    get username() {
        return this.#username;
    }

    set username(value) {
        this.#username = value;
    }

    get email() {
        return this.#email;
    }

    set email(value) {
        this.#email = value;
    }

    get first_name() {
        return this.#first_name;
    }

    set first_name(value) {
        this.#first_name = value;
    }

    get last_name() {
        return this.#last_name;
    }

    set last_name(value) {
        this.#last_name = value;
    }

    get registration_timestamp() {
        return this.#registration_timestamp;
    }

    set registration_timestamp(value) {
        this.#registration_timestamp = value;
    }

    get psw_shadow() {
        return this.#psw_shadow;
    }

    set psw_shadow(value) {
        this.#psw_shadow = value;
    }

    get isAdmin() {
        return this.#isAdmin;
    }

    set isAdmin(value) {
        this.#isAdmin = value;
    }

    get isSmm() {
        return this.#isSmm;
    }

    set isSmm(value) {
        this.#isSmm = value;
    }

    get isUser() {
        return this.#isUser;
    }

    set isUser(value) {
        this.#isUser = value;
    }

    getDocument() {
        return {
            username: this.#username,
            email: this.#email,
            first_name: this.#first_name,
            last_name: this.#last_name,
            registration_timestamp: this.#registration_timestamp,
            psw_shadow: this.#psw_shadow,
            isAdmin: this.#isAdmin,
            isSmm: this.#isSmm,
            isUser: this.#isUser
        }
    }

}