module.exports = class DatabaseController {

    constructor(model) {
        this._model = model;
    }

    getModel() {
        return this._model;
    }

    /**
     *
     * @returns {Promise<*>}
     *
     * returns
     */
    async getDatabaseCollections() {
        return await this.getModel().getDatabaseCollections();
    }

    async getCollectionContent(content) {
        return await this.getModel().getCollectionContent(content);
    }

    /**
     * @param collectionName
     * @param field
     * @returns {Promise<{code: number}>}
     *
     * This function create an unique index on mongodb for selected filed on the collection passwd as first param to this method,
     * Returns 400 in case of error.
     */
    async makeUniqueIndex(collectionName, field) {
        let output = {"code": 200};
        if(await this.getModel().collectionExists(collectionName) === false) {
            output['code'] = 400;
            output['msg'] = 'Collection do not exists';
            return output;
        }

        let databaseResponse = await this.getModel().makeFieldUnique(collectionName, field);
        output['msg'] = databaseResponse;
        return output;
    }

}