module.exports = class SquealIrDto {
    #squeal_id;
    #is_session_id
    #value;
    #reactions;

    constructor(documentFromMongoose = null) {
        if (documentFromMongoose === null) {
            this.#squeal_id = null;
            this.#is_session_id = null;
            this.#value = null;
            this.#reactions = null;
        } else {
            this.#squeal_id = documentFromMongoose.squeal_id;
            this.#is_session_id = documentFromMongoose.is_session_id;
            this.#value = documentFromMongoose.value;
            this.#reactions = documentFromMongoose.reaction;
        }
    }


    get squeal_id() {
        return this.#squeal_id;
    }

    set squeal_id(value) {
        this.#squeal_id = value;
    }

    get is_session_id() {
        return this.#is_session_id;
    }

    set is_session_id(value) {
        this.#is_session_id = value;
    }

    get value() {
        return this.#value;
    }

    set value(value) {
        this.#value = value;
    }

    get reactions() {
        return this.#reactions;
    }

    set reactions(value) {
        this.#reactions = value;
    }

    getDocument(){
        return {
            squeal_id: this.#squeal_id,
            is_session_id: this.#is_session_id,
            value: this.#value,
            reaction: this.#reactions
        }
    }

}

