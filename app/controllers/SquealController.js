const Controller = require("./Controller");
const SquealDto = require("../entities/dtos/QuoteDto");
const QuoteController = require("./QuoteController");

module.exports = class SquealController extends Controller {
    constructor(model) {
        super();
        this._model = model;
    }

    async getSqueal(identifier){
        let output = this.getDefaultOutput();

        let squeal = this._model.getSqueal(identifier);
        if(this.isObjectVoid(squeal)) {
            output['code'] = 404;
            output['msg'] = 'Channel not found.';
            return output;
        }
        output['content'] = squeal.getDocument();
        return output;
    }
}