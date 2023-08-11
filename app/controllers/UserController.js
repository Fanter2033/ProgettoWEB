module.exports = class UserController {

    constructor(model) {
        this._model = model;
    }

    getModel() {
        return this._model;
    }

    async getUser(username) {
        return await this._model.getUser(username);
    }

}