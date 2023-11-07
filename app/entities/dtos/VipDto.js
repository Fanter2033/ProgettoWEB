module.exports = class VipDto {

    #_id;
    #linkedSmm;
    #linkedUsers;

    constructor(documentFromMongoose = null) {
        if(documentFromMongoose === null){
            this.#_id = null;
            this.#linkedSmm = null;
            this.#linkedUsers = null;
        } else {
            this.#_id = documentFromMongoose._id;
            this.#linkedSmm = documentFromMongoose.linkedSmm;
            this.#linkedUsers = documentFromMongoose.linkedUsers;
        }
    }

    getDocument(){
        return{
            _id : this.#_id,
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
        return this.#_id;
    }

    set _id(value) {
        this.#_id = value;
    }

}