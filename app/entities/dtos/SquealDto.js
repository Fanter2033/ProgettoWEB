module.exports = class SquealDto {

    #id;
    #date;
    #sender;
    #message_type;
    #positive_value;
    #negative_value;
    #critical_mass;
    #quote_cost;
    #content;

    constructor(documentFromMongoose = null) {
        if (documentFromMongoose === null) {
            this.#id = null;
            this.#date = null;
            this.#sender = null;
            this.#message_type = null;
            this.#positive_value = null;
            this.#negative_value = null;
            this.#critical_mass = null;
            this.#quote_cost = null;
            this.#content = null;
        } else {
            this.#id = documentFromMongoose._id;
            this.#date = documentFromMongoose.date;
            this.#sender = documentFromMongoose.sender;
            this.#message_type = documentFromMongoose.message_type;
            this.#positive_value = documentFromMongoose.positive_value;
            this.#negative_value = documentFromMongoose.negative_value;
            this.#critical_mass = documentFromMongoose.critical_mass;
            this.#quote_cost = documentFromMongoose.quote_cost;
            this.#content = documentFromMongoose.content;
        }
    }

    getDocument(){
        return{
            _id: this.#id,
            date: this.#date,
            sender: this.#sender,
            message_type: this.#message_type,
            positive_value: this.#positive_value,
            negative_value: this.#negative_value,
            critical_mass: this.#critical_mass,
            quote_cost: this.#quote_cost,
            content: this.#content,
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

    get sender() {
        return this.#sender;
    }

    set sender(value) {
        this.#sender = value;
    }

    /**
     * @return {string}
     */
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

    get quote_cost() {
        return this.#quote_cost;
    }

    set quote_cost(value) {
        return this.#quote_cost = value;
    }

    get content(){
        return this.#content;
    }

    set content(value){
        return this.#content = value;
    }
}

