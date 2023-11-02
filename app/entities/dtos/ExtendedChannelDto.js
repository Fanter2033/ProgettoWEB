const {repository: documentFromMongoose} = require("ejs/ejs");
const ChannelDto = require("./ChannelDto");
module.exports = class ExtendedChannelDto extends ChannelDto {

    #owner;
    #subscribers;
    #posts;

    constructor(documentFromMongoose = null) {
        super(documentFromMongoose)
        if (documentFromMongoose === null) {
            this.#owner = null;
            this.#subscribers = null;
            this.#posts = null;
        }
    }

    get owner() {
        return this.#owner;
    }

    set owner(value) {
        this.#owner = value;
    }

    get subscribers() {
        return this.#subscribers;
    }

    set subscribers(value) {
        this.#subscribers = value;
    }

    get posts() {
        return this.#posts;
    }

    set posts(value) {
        this.#posts = value;
    }

    getDocument() {
        let output = super.getDocument();
        output["owner"] = this.#owner;
        output["subscribers"] = this.#subscribers;
        output["posts"] = this.#posts;
        return output;
    }

}