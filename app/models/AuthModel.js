const Model = require("./Model");
module.exports = class AuthModel extends Model {
    constructor(attemptCollection) {
        super(attemptCollection);
    }
}