module.exports = class CommentDto {
    #squeal_id;
    #username;
    #comment;

    constructor(documentFromMongoose = null) {
        if (documentFromMongoose === null) {
            this.#squeal_id = null;
            this.#username = null;
            this.#comment = null;
        } else {
            this.#squeal_id = documentFromMongoose.squeal_id;
            this.#username = documentFromMongoose.username;
            this.#comment = documentFromMongoose.comment;
        }
    }


    get squeal_id() {
        return this.#squeal_id;
    }

    set squeal_id(value) {
        this.#squeal_id = value;
    }

    get username() {
        return this.#username;
    }

    set username(value) {
        this.#username = value;
    }

    get comment() {
        return this.#comment;
    }

    set comment(value) {
        this.#comment = value;
    }

    getDocumentAttachSqueal() {
        return{
            username: this.#username,
            comment: this.#comment
        }
    }

    getDocument(){
        return{
            squeal_id: this.#squeal_id,
            username: this.#username,
            comment: this.#comment
        }
    }

}

