module.exports = class SquealTextAutoDto {
    #id;
    #iteration;
    #iteration_end;
    #quota_update_cost;
    #next_scheduled_operation;
    #delay_seconds;
    #original_content;

    constructor(documentFromMongoose = null) {
        if (documentFromMongoose === null) {
            this.#id = null;
            this.#iteration = null;
            this.#iteration_end = null;
            this.#quota_update_cost = null;
            this.#next_scheduled_operation = null;
            this.#delay_seconds = null;
            this.#original_content = null;
        } else {
            this.#id = documentFromMongoose._id;
            this.#iteration = documentFromMongoose.iteration;
            this.#iteration_end = documentFromMongoose.iteration_end;
            this.#quota_update_cost = documentFromMongoose.quota_update_cost;
            this.#next_scheduled_operation = documentFromMongoose.next_scheduled_operation;
            this.#delay_seconds = documentFromMongoose.delay_seconds;
            this.#original_content = documentFromMongoose.original_content;
        }
    }

    getDocument(){
        return{
            _id: this.#id,
            iteration: this.#iteration,
            iteration_end: this.#iteration_end,
            quota_update_cost: this.#quota_update_cost,
            next_scheduled_operation: this.#next_scheduled_operation,
            delay_seconds: this.#delay_seconds,
            original_content: this.#original_content
        }
    }


    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get iteration() {
        return this.#iteration;
    }

    set iteration(value) {
        this.#iteration = value;
    }

    get iteration_end() {
        return this.#iteration_end;
    }

    set iteration_end(value) {
        this.#iteration_end = value;
    }

    get quota_update_cost() {
        return this.#quota_update_cost;
    }

    set quota_update_cost(value) {
        this.#quota_update_cost = value;
    }

    get next_scheduled_operation() {
        return this.#next_scheduled_operation;
    }

    set next_scheduled_operation(value) {
        this.#next_scheduled_operation = value;
    }


    get delay_seconds() {
        return this.#delay_seconds;
    }

    set delay_seconds(value) {
        this.#delay_seconds = value;
    }


    /**
     * @return {string}
     */
    get original_content() {
        return this.#original_content;
    }

    set original_content(value) {
        this.#original_content = value;
    }
}

