const Controller = require("./Controller");
const UserController = require("./UserController");
const UserModel = require("../models/UserModel");
const {config} = require("../autoload/autoload");
const session = require('express-session')
const AuthenticationAttempt = require('../entities/AuthenticationAttempt');
module.exports = class AuthController extends Controller {

    constructor(model, invokerIp) {
        super();
        this._model = model;
        this._userController = new UserController(new UserModel(config._USER_COLLECTION));
        this.invokerIp = '';
    }

    /**
     * @param {string} invokerIp
     */
    setInvokerIp(invokerIp) {
        this.invokerIp = invokerIp;
    }

    async authenticateUser(requestObject, responseObject, username, password_attempt, requested_role = 0) {

        /*
        if(typeof requestObject.session.username !== 'undefined') {
            responseObject.redirect('admin/dashboard');
        }
         */

        let output = this.getDefaultOutput();
        requested_role = parseInt(requested_role);
        if(isNaN(requested_role)) {
            output.code = 403;
            output.msg = '';
            return output;
        }

        let attempt = new AuthenticationAttempt(this.invokerIp, this.getCurrentTimestampMillis(), 403, username, requested_role);

        let userControllerOutput = await this._userController.getUser(username);
        if(userControllerOutput.code !== 200) {
            attempt.setTimestampEnd(this.getCurrentTimestampMillis());
            this._model.insertAttempt(attempt);
            output.code = 403;
            output.msg = '';
            return output;
        }
        let user = userControllerOutput.content;
        let hasRole = this.hasUserRequestedRole(user, requested_role);
        if(hasRole === false){
            attempt.setTimestampEnd(this.getCurrentTimestampMillis());
            this._model.insertAttempt(attempt);
            output.code = 403;
            output.msg = '';
            return output;
        }
        let checkResult = await this.hashCheck(user.psw_shadow, password_attempt);
        if(checkResult === false){
            attempt.setTimestampEnd(this.getCurrentTimestampMillis());
            this._model.insertAttempt(attempt);
            output.code = 403;
            output.msg = '';
            return output;
        }
        attempt.setTimestampEnd(this.getCurrentTimestampMillis());
        attempt.setServerResponseCode(200);
        this._model.insertAttempt(attempt);
        requestObject.session.user = user;
        requestObject.session.save();
        return output;
    }


    /**
     *
     * @param {UserDto} user
     * @param {number} requested_role
     * @return {boolean}
     *
     * Returns true if the given user has requested role, false otherwise.
     *
     */
    hasUserRequestedRole(user, requested_role = 0) {
        switch (requested_role){
            case 0:
                return user.isUser;
            case 1:
                return user.isSmm;
            case 2:
                return user.isAdmin;
            default:
                return false;

        }
    }
}