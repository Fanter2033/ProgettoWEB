const Controller = require("./Controller");
const UserController = require("./UserController");
const UserModel =  require("../models/UserModel");
const autoload = require('../autoload/autoload');

let userController = new UserController(new UserModel(autoload.config._USER_COLLECTION));
module.exports = class ModeController extends Controller {

    constructor(model) {
        super();
        this._model = model;
    }

    async getQuote(username){
        let out = this.getDefaultOutput()
        let userOut = await userController.getUser(username);
        if(userOut.code !== 200 || this.isObjectVoid(userOut['content'])){
            out['code'] = 404;
            out['msg'] = 'Not found';
            return out;
        }
        let quote = await this._model.getQuote(username);
        out['content'] = quote.getDocument();
        return out;
    }
}