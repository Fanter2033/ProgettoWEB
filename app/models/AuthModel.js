const Model = require("./Model");
const AuthenticationAttempt = require("../entities/schemas/AuthenticationAttemptSchema");
module.exports = class AuthModel extends Model {
    constructor(attemptCollection) {
        super(attemptCollection);
    }

    /**
     * @param {AuthenticationAttemptDto} attemptObj
     * @return {Promise<boolean>}
     */
    async insertAttempt(attemptObj) {
        await this.checkMongoose('auth_attempt', AuthenticationAttempt)
        attemptObj = this.mongo_escape(attemptObj.getDocument());
        let attemptSaving = new this.entityMongooseModel(attemptObj);
        try {
            attemptSaving.save();
        } catch (ignored) {
            return false;
        }
        return true;
    }
}