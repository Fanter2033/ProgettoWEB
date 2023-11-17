const ChannelDto = require("./ChannelDto");
module.exports = class ChannelRoleDto {

    #channel_name;
    #type;
    #username;
    #role;
    #role_since;

    constructor(documentFromMongoose = null) {
        if (documentFromMongoose === null) {
            this.#channel_name = null;
            this.#type = null;
            this.#username = null;
            this.#role = null;
            this.#role_since = null;
        } else {
            this.#channel_name = documentFromMongoose.channel_name;
            this.#type = documentFromMongoose.type;
            this.#username = documentFromMongoose.username;
            this.#role = documentFromMongoose.role;
            this.#role_since = documentFromMongoose.role_since;
        }
    }

    getDocument() {
        return {
            channel_name: this.#channel_name,
            type: this.#type,
            username: this.#username,
            role: this.#role,
            role_since: this.#role_since
        }
    }

    /**
     * @return {ChannelDto}
     */
    getChannelDto(){
        let out = new ChannelDto();
        out.type = this.#type;
        out.channel_name = this.#channel_name;
        return out;
    }


    /**
     * @return {string}
     */
    get channel_name() {
        return this.#channel_name;
    }

    /**
     * @param {string} value
     */
    set channel_name(value) {
        this.#channel_name = value;
    }

    /**
     * @return {string}
     */
    get type() {
        return this.#type;
    }

    /**
     * @param {string} value
     */
    set type(value) {
        this.#type = value;
    }

    /**
     * @return {string}
     */
    get username() {
        return this.#username;
    }

    /**
     * @param {string} value
     */
    set username(value) {
        this.#username = value;
    }

    /**
     * @return {number}
     */
    get role() {
        return this.#role;
    }

    /**
     * @param {number} value
     */
    set role(value) {
        this.#role = value;
    }

    get role_since() {
        return this.#role_since;
    }

    set role_since(value) {
        this.#role_since = value;
    }
}