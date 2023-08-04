class DatabaseController {

    constructor(model) {
        this._model = model;
    }

    getModel() {
        return this._model;
    }

    getDatabaseCollections() {
        return this.getModel().getDatabaseCollections();
    }

}