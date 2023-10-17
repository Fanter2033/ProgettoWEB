const autoload = require('../autoload/autoload');
const Controller = require("./Controller");
const QuoteDto = require("../entities/dtos/QuoteDto")

module.exports = class QuoteController extends Controller {

    constructor(model) {
        super();
        this._model = model;
    }
    async getQuote(username){
        let out = this.getDefaultOutput();
        let quote = await this._model.getQuote(username);
        if(!((quote) instanceof QuoteDto)){
            out['code'] = 404;
            out['msg'] = 'Not found';
            return out;
        }
        out['content'] = quote.getDocument();
        return out;
    }

    /**
        @param username {string}
        @return Promise<{msg: string, code: number, content: {}}>
        precondition: user exist, already checked in createUser
     */
    async createQuote(username) {
        let output = this.getDefaultOutput();
        let quoteObj = new QuoteDto();
        quoteObj.id = username;
        quoteObj.remaining_daily = autoload.config._QUOTE_DEFAULT_DAILY;
        quoteObj.remaining_weekly = autoload.config._QUOTE_DEFAULT_WEEKLY;
        quoteObj.remaining_monthly = autoload.config._QUOTE_DEFAULT_MONTHLY;
        quoteObj.limit_daily =  quoteObj.remaining_daily;
        quoteObj.limit_weekly =  quoteObj.remaining_weekly;
        quoteObj.limit_monthly =  quoteObj.remaining_monthly;

        let dataBaseRes = await this._model.createQuote(quoteObj);
        if(dataBaseRes)
            output['content'] = quoteObj;
        else{
            output['code'] = 500;
            output['msg'] = 'Error creating quote in db';
        }
        return  output;
    }

    /**
     * @param username {string}
     * @return Promise<{msg: string, code: number, content: {}}>
     */
    async deleteQuote(username) {
        let output = this.getDefaultOutput();
        let quoteObj = await this.getQuote(username);
        if(quoteObj['code'] !== 200){
            output['code'] = 404;
            output['msg'] = 'Not found';
            return output;
        }

        //Quota exists. Delete its.
        let result = await this._model.deleteQuote(username);
        if(result === false){
            output['code'] = 500;
            output['msg'] = 'Server error.';
        }

        return output;
    }

}