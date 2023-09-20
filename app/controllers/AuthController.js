const Controller = require("./Controller");
const UserController = require("./UserController");
const UserModel = require("../models/UserModel");
const {config} = require("../autoload/autoload");
const User = require("../entities/User");
module.exports = class AuthController extends Controller {

    constructor(model) {
        super();
        this._model = model;
        this._userController = new UserController(new UserModel(config._USER_COLLECTION));
    }

    async authenticateUser(username, password_attempt) {
        let output = this.getDefaultOutput();
        let userControllerOutput = await this._userController.getUser(username);
        if(userControllerOutput.code !== 200) {
            output.code = 403;
            output.msg = '';
            return output;
        }
        let user = userControllerOutput.content;
        console.log(await this.crypt('59741404'));
        let checkResult = await this.hashCheck(user.getPassword(), password_attempt);
        console.log(checkResult);
        if(checkResult === false){
            output.code = 403;
            output.msg = '';
            return output;
        }
        //TODO CRARE LA SESSIONE e REGISTRARE I TENTATIVI
        console.log('Ei');
        return output;
    }

}