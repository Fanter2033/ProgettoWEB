module.exports = class DatabaseController {

    constructor(model) {
        this._model = model;
    }

    getModel() {
        return this._model;
    }

    async getDatabaseCollections() {
        return await this.getModel().getDatabaseCollections();
    }

}