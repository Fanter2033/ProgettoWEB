module.exports = class Squeal2UserDto {
    #squeal_id;
    #destination_username;

    constructor(documentFromMongoose = null) {
        if (documentFromMongoose === null) {
            this.#squeal_id = null;
            this.#destination_username = null;
        } else {
            this.#squeal_id = documentFromMongoose.squeal_id;
            this.#destination_username = documentFromMongoose.destination_username;
        }
    }


    get squeal_id() {
        return this.#squeal_id;
    }

    set squeal_id(value) {
        this.#squeal_id = value;
    }

    get destination_username() {
        return this.#destination_username;
    }

    set destination_username(value) {
        this.#destination_username = value;
    }

    getDocument(){
        return{
            squeal_id: this.#squeal_id,
            destination_username: this.#destination_username,
        }
    }

}

