module.exports = class SquealStat {
    #squeal_id;
    #sender;
    #timestamp;
    #positive_value;
    #negative_value;

    constructor(squeal_id, sender, timestamp, positive_value, negative_value) {
        this.#squeal_id = squeal_id;
        this.#sender = sender;
        this.#timestamp = timestamp;
        this.#positive_value = positive_value;
        this.#negative_value = negative_value;
    }

    getDocument(){
        return {
            squeal_id: this.#squeal_id,
            sender: this.#sender,
            timestamp: this.#timestamp,
            positive_value: this.#positive_value,
            negative_value: this.#negative_value,
        }
    }

};
