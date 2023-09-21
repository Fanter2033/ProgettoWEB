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

    async authenticateUser(username, password_attempt, requested_role = 0) {
        let output = this.getDefaultOutput();
        if(isNaN(requested_role)) {
            output.code = 403;
            output.msg = '';
            return output;
        }
        let userControllerOutput = await this._userController.getUser(username);
        if(userControllerOutput.code !== 200) {
            output.code = 403;
            output.msg = '';
            return output;
        }
        let user = userControllerOutput.content;
        let hasRole = this.hasUserRequestedRole(user, requested_role);
        if(hasRole === false){
            output.code = 403;
            output.msg = '';
            return output;
        }
        let checkResult = await this.hashCheck(user.getPassword(), password_attempt);
        if(checkResult === false){
            output.code = 403;
            output.msg = '';
            return output;
        }
        //TODO CRARE LA SESSIONE e REGISTRARE I TENTATIVI
        console.log('Ei');
        return output;
    }


    /**
     *
     * @param {User} user
     * @param {number} requested_role
     * @return {boolean}
     *
     * Returns true if the given user has requested role, false otherwise.
     *
     */
    hasUserRequestedRole(user, requested_role = 0) {
        switch (requested_role){
            case 0:
                return user.checkIsUser();
            case 1:
                return user.checkIsSmm();
            case 2:
                return user.checkIsAdmin();
            default:
                return false;

        }
    }

}