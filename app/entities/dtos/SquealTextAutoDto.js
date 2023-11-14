module.exports = class SquealDto {
    #id;
    #iteration;
    #iteration_end;
    #quota_update_cost;
    #next_scheduled_operation;

    constructor(documentFromMongoose = null) {
        if (documentFromMongoose === null) {
            this.#id = null;
            this.#iteration = null;
            this.#iteration_end = null;
            this.#quota_update_cost = null;
            this.#next_scheduled_operation = null;
        } else {
            this.#id = documentFromMongoose._id;
            this.#iteration = documentFromMongoose.iteration;
            this.#iteration_end = documentFromMongoose.iteration_end;
            this.#quota_update_cost = documentFromMongoose.quota_update_cost;
            this.#next_scheduled_operation = documentFromMongoose.next_scheduled_operation;
        }
    }

    getDocument(){
        return{
            _id: this.#id,
            iteration: this.#iteration,
            iteration_end: this.#iteration_end,
            quota_update_cost: this.#quota_update_cost,
            next_scheduled_operation: this.#next_scheduled_operation,
        }
    }


}

