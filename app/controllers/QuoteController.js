const Controller = require("./Controller");
const UserController = require("./UserController");
const UserModel =  require("../models/UserModel");
const QuoteDto = require("../entities/dtos/QuoteDto")
const autoload = require('../autoload/autoload');
const {config} = require("../autoload/autoload");
const {_QUOTE_DEFAULT_MONTHLY} = require("../config/squealer");

let userController = new UserController(new UserModel(autoload.config._USER_COLLECTION));
module.exports = class ModeController extends Controller {
    constructor(model) {
        super();
        this._model = model;
    }
    async getQuote(username){
        let out = this.getDefaultOutput()
        let userOut = await userController.getUser(username);
        if(this.isObjectVoid(userOut) && userOut.code !== 200){
            out['code'] = 404;
            return out;
        }
        let quote = await this._model.getQuote(username);
        out['content'] = quote.getDocument();
        return out;
    }

    /*
     precondition: user exist, already cheacked in createUser
     */
    async createQuote(username) {
        let output = this.getDefaultOutput();
        let quoteObj = new QuoteDto();
        quoteObj.id = username;
        quoteObj.remaining_daily = config._QUOTE_DEFAULT_DAILY;
        quoteObj.remaining_weekly = config._QUOTE_DEFAULT_WEEKLY;
        quoteObj.remaining_monthly = config-_QUOTE_DEFAULT_MONTHLY;
        quoteObj.limit_daily =  quoteObj.remaining_daily;
        quoteObj.limit_weekly =  quoteObj.remaining_weekly;
        quoteObj.limit_weekly =  quoteObj.remaining_weekly;

        let dataBaseRes = await this._model.createQuote(quoteObj);
        if(dataBaseRes)
            output['content'] = quoteObj;
        else{
            output['code'] = 500;
            output['msg'] = 'Error creating quote in db';
            return  output;
        }
        return  output;
    }
}