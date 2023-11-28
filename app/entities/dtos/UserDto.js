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
    #vip;
    #locked;
    #verbalized_popularity;
    #verbalized_unpopularity;
    #reset;
    #pfp;

    constructor(documentFromMongoose = null) {
        if (documentFromMongoose === null) {
            this.#username = null;
            this.#email = null;
            this.#first_name = null;
            this.#last_name = null;
            this.#registration_timestamp = null;
            this.#psw_shadow = null;
            this.#isAdmin = null;
            this.#isSmm = null;
            this.#isUser = null;
            this.#vip = null;
            this.#locked = null;
            this.#verbalized_popularity = 0;
            this.#verbalized_unpopularity = 0;
            this.#reset = '';
            this.#pfp = '';
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
            this.#vip = documentFromMongoose.vip;
            this.#locked = documentFromMongoose.locked;
            this.#verbalized_popularity = documentFromMongoose.verbalized_popularity;
            this.#verbalized_unpopularity = documentFromMongoose.verbalized_popularity;
            if(typeof documentFromMongoose.verbalized_popularity !== 'undefined')
                this.#reset = documentFromMongoose.reset;
            else
                this.#reset = '';
            this.#pfp = documentFromMongoose.pfp;
        }

    }


    /**
     * @return {string}
     */
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

    get vip() {
        return this.#vip;
    }

    set vip(value) {
        this.#vip = value;
    }

    get locked() {
        return this.#locked;
    }

    set locked(value) {
        this.#locked = value;
    }

    get verbalized_popularity() {
        return this.#verbalized_popularity;
    }

    set verbalized_popularity(value) {
        this.#verbalized_popularity = value;
    }

    get verbalized_unpopularity() {
        return this.#verbalized_unpopularity;
    }

    set verbalized_unpopularity(value) {
        this.#verbalized_unpopularity = value;
    }

    get reset() {
        return this.#reset;
    }

    set reset(value) {
        this.#reset = value;
    }

    get pfp() {
        return this.#pfp;
    }

    set pfp(value) {
        this.#pfp = value;
    }

    /**
     * @param {boolean} returnReset
     */
    getDocument(returnReset = false) {
        let out = {
            username: this.#username,
            email: this.#email,
            first_name: this.#first_name,
            last_name: this.#last_name,
            registration_timestamp: this.#registration_timestamp,
            psw_shadow: this.#psw_shadow,
            isAdmin: this.#isAdmin,
            isSmm: this.#isSmm,
            isUser: this.#isUser,
            vip: this.#vip,
            locked: this.#locked,
            verbalized_popularity: this.#verbalized_popularity,
            verbalized_unpopularity: this.#verbalized_unpopularity,
            pfp: this.#pfp
        }
        if (returnReset === true)
            out['reset'] = this.#reset;

        return out;
    }

}