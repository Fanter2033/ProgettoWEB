const Controller = require("./Controller");
const UserController = require("./UserController");
const UserModel = require("../models/UserModel");
const {config} = require("../autoload/autoload");
const session = require('express-session')
const AuthenticationAttemptDto = require('../entities/dtos/AuthenticationAttemptDto');
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
        let output = this.getDefaultOutput();
        requested_role = parseInt(requested_role);
        if(isNaN(requested_role)) {
            output.code = 403;
            output.msg = '';
            return output;
        }

        let attempt = new AuthenticationAttemptDto();
        //this.invokerIp, this.getCurrentTimestampMillis(), 403, username, requested_role
        attempt.ipAddress = this.invokerIp;
        attempt.timestampStart = this.getCurrentTimestampMillis();
        attempt.serverResponseCode = 403;
        attempt.requestedUsername = username;
        attempt.requestedRole = requested_role;

        let userControllerOutput = await this._userController.getUser(username);
        if(userControllerOutput.code !== 200) {
            attempt.timestampEnd = this.getCurrentTimestampMillis();
            await this._model.insertAttempt(attempt);
            output.code = 403;
            output.msg = '';
            return output;
        }
        let user = userControllerOutput.content;
        let hasRole = this.hasUserRequestedRole(user, requested_role);
        if(hasRole === false){
            attempt.timestampEnd = this.getCurrentTimestampMillis();
            await this._model.insertAttempt(attempt);
            output.code = 403;
            output.msg = '';
            return output;
        }
        let checkResult = await this.hashCheck(user.psw_shadow, password_attempt);
        if(checkResult === false){
            attempt.timestampEnd = this.getCurrentTimestampMillis();
            await this._model.insertAttempt(attempt);
            output.code = 403;
            output.msg = '';
            return output;
        }
        attempt.timestampEnd = this.getCurrentTimestampMillis();
        attempt.serverResponseCode = 200;
        await this._model.insertAttempt(attempt);
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