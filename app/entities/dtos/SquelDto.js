module.exports = class SquealDto {

    #id;
    #date;
    #destinations;
    #sender;
    #reactions;
    #message_type;
    #positive_value;
    #negative_value;
    #critical_mass;

    constructor(documentFromMongoose = null) {
        if (documentFromMongoose === null) {
            this.#id = null;
            this.#date = null;
            this.#destinations = null;
            this.#sender = null;
            this.#reactions = null;
            this.#message_type = null;
            this.#positive_value = null;
            this.#negative_value = null;
            this.#critical_mass = null;
        } else {
            this.#id = documentFromMongoose._id;
            this.#date = documentFromMongoose.date;
            this.#destinations = documentFromMongoose.destination;
            this.#sender = documentFromMongoose.sender;
            this.#reactions = documentFromMongoose.reactions;
            this.#message_type = documentFromMongoose.message_type;
            this.#positive_value = documentFromMongoose.positive_value;
            this.#negative_value = documentFromMongoose.negative_value;
            this.#critical_mass = documentFromMongoose.critical_mass;
        }
    }

    getDocument(){
        return{
            _id: this.#id,
            date: this.#date,
            destinations: this.#destinations,
            sender: this.#sender,
            reactions: this.#reactions,
            message_type: this.#message_type,
            positive_value: this.#positive_value,
            negative_value: this.#negative_value,
            critical_mass: this.#critical_mass,
        }
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get date() {
        return this.#date;
    }

    set date(value) {
        this.#date = value;
    }

    get destinations() {
        return this.#destinations;
    }

    set destinations(value) {
        this.#destinations = value;
    }

    get sender() {
        return this.#sender;
    }

    set sender(value) {
        this.#sender = value;
    }

    get reactions() {
        return this.#reactions;
    }

    set reactions(value) {
        this.#reactions = value;
    }

    get message_type() {
        return this.#message_type;
    }

    set message_type(value) {
        this.#message_type = value;
    }

    get positive_value() {
        return this.#positive_value;
    }

    set positive_value(value) {
        this.#positive_value = value;
    }

    get negative_value() {
        return this.#negative_value;
    }

    set negative_value(value) {
        this.#negative_value = value;
    }

    get critical_mass() {
        return this.#critical_mass;
    }

    set critical_mass(value) {
        this.#critical_mass = value;
    }
}

