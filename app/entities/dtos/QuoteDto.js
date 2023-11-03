module.exports = class QuoteDto {
    #id;
    #limit_daily;
    #limit_weekly;
    #limit_monthly;
    #remaining_daily;
    #remaining_weekly;
    #remaining_monthly;


    constructor(documentFromMongoose = null) {
        if (documentFromMongoose === null) {
            this.#id = null;
            this.#limit_daily = null;
            this.#limit_weekly = null;
            this.#limit_monthly = null;
            this.#remaining_daily = null;
            this.#remaining_weekly = null;
            this.#remaining_monthly = null;
        } else {
            this.#id = documentFromMongoose._id;
            this.#limit_daily = documentFromMongoose.limit_daily;
            this.#limit_weekly = documentFromMongoose.limit_weekly;
            this.#limit_monthly = documentFromMongoose.limit_monthly;
            this.#remaining_daily = documentFromMongoose.remaining_daily;
            this.#remaining_weekly = documentFromMongoose.remaining_weekly;
            this.#remaining_monthly = documentFromMongoose.remaining_monthly;
        }
    }

    getDocument() {
        return {
            _id: this.#id,
            limit_daily: this.#limit_daily,
            limit_weekly: this.#limit_weekly,
            limit_monthly: this.#limit_monthly,
            remaining_daily: this.#remaining_daily,
            remaining_weekly: this.#remaining_weekly,
            remaining_monthly: this.#remaining_monthly,
        }
    }


    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get limit_daily() {
        return this.#limit_daily;
    }

    set limit_daily(value) {
        this.#limit_daily = value;
    }

    get limit_weekly() {
        return this.#limit_weekly;
    }

    set limit_weekly(value) {
        this.#limit_weekly = value;
    }

    get limit_monthly() {
        return this.#limit_monthly;
    }

    set limit_monthly(value) {
        this.#limit_monthly = value;
    }

    get remaining_daily() {
        return this.#remaining_daily;
    }

    set remaining_daily(value) {
        this.#remaining_daily = value;
    }

    get remaining_weekly() {
        return this.#remaining_weekly;
    }

    set remaining_weekly(value) {
        this.#remaining_weekly = value;
    }

    get remaining_monthly() {
        return this.#remaining_monthly;
    }

    set remaining_monthly(value) {
        this.#remaining_monthly = value;
    }
}