const Model = require("./Model");
module.exports = class AuthModel extends Model {
    constructor(attemptCollection) {
        super(attemptCollection);
    }

    /**
     * @param {AuthenticationAttempt} attemptObj
     * @return {Promise<boolean>}
     */
    async insertAttempt(attemptObj) {
        let collection = await this.getCollection();
        attemptObj = this.mongo_escape(attemptObj);
        let response = await collection.insertOne(attemptObj);
        if (response) return true;
        return false;
    }
}