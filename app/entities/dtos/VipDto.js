module.exports = class VipDto {

    #user;
    #linkedSmm;
    #linkedUsers;

    constructor(documentFromMongoose = null) {
        if(documentFromMongoose === null){
            this.#user = null;
            this.#linkedSmm = null;
            this.#linkedUsers = null;
        } else {
            this.#user = documentFromMongoose.user;
            this.#linkedSmm = documentFromMongoose.linkedSmm;
            this.#linkedUsers = documentFromMongoose.linkedUsers;
        }
    }

    getDocument(){
        return{
            user : this.#user,
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
    get user() {
        return this.#user;
    }

    set user(value) {
        this.#user = value;
    }

}