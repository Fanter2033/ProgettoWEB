module.exports = class VipDto {

    #id;
    #linkedSmm;
    #linkedUsers;

    constructor(documentFromMongoose = null) {
        if(documentFromMongoose === null){
            this.#id = null;
            this.#linkedSmm = null;
            this.#linkedUsers = null;
        } else {
            this.#id = documentFromMongoose._id;
            this.#linkedSmm = documentFromMongoose.linkedSmm;
            this.#linkedUsers = documentFromMongoose.linkedUsers;
        }
    }

    getDocument(){
        return{
            _id : this.#id,
            linkedUsers: this.#linkedUsers,
            linkedSmm: this.#linkedSmm,
        }
    }

    get linkedUsers() {
        return this.#linkedUsers;
    }

    set linkedUsers(value) {
        this.#linkedUsers = value;
    }
    get linkedSmm() {
        return this.#linkedSmm;
    }

    set linkedSmm(value) {
        this.#linkedSmm = value;
    }
    get _id() {
        return this.#id;
    }

    set _id(value) {
        this.#id = value;
    }

}