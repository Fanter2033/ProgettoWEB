module.exports = class Squeal2ChannelDto {
    #squeal_id;
    #channel_type;
    #channel_name;

    constructor(documentFromMongoose = null) {
        if (documentFromMongoose === null) {
            this.#squeal_id = null;
            this.#channel_type = null;
            this.#channel_name = null;
        } else {
            this.#squeal_id = documentFromMongoose.squeal_id;
            this.#channel_type = documentFromMongoose.channel_type;
            this.#channel_name = documentFromMongoose.channel_name;
        }
    }


    get squeal_id() {
        return this.#squeal_id;
    }

    set squeal_id(value) {
        this.#squeal_id = value;
    }

    get channel_name() {
        return this.#channel_name;
    }

    set channel_name(value) {
        this.#channel_name = value;
    }

    get channel_type() {
        return this.#channel_type;
    }

    set channel_type(value) {
        this.#channel_type = value;
    }

    getDocument(){
        return{
            squeal_id: this.#squeal_id,
            channel_type: this.#channel_type,
            channel_name: this.#channel_name
        }
    }

}

