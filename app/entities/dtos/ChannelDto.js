const {repository: documentFromMongoose} = require("ejs/ejs");
module.exports = class QuoteDto {

    #channel_name;
    #type;
    #private;

    constructor(documentFromMongoose = null) {
        if (documentFromMongoose === null) {
            this.#channel_name = null;
            this.#type = null;
            this.#private = null;
        } else {
            this.#channel_name = documentFromMongoose.channel_name;
            this.#type = documentFromMongoose.type;
            this.#private = documentFromMongoose.private;
        }
    }

    getDocument() {
        return {
            channel_name: this.#channel_name,
            type: this.#type,
            private: this.#private
        }
    }


    get channel_name() {
        return this.#channel_name;
    }

    set channel_name(value) {
        this.#channel_name = value;
    }

    get type() {
        return this.#type;
    }

    set type(value) {
        this.#type = value;
    }

    get private() {
        return this.#private;
    }

    set private(value) {
        this.#private = value;
    }
}