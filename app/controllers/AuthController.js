const Controller = require("./Controller");
const UserController = require("./UserController");
const UserModel = require("../models/UserModel");
const AuthenticationAttemptDto = require("../entities/dtos/AuthenticationAttemptDto");
const {config} = require("../autoload/autoload");
module.exports = class AuthController extends Controller {
    constructor(model) {
        super();
        this._model = model;
        this._userController = new UserController(
            new UserModel(config._USER_COLLECTION)
        );
        this.invokerIp = "";
    }

    /**
     *
     * @param requestObject
     * @param responseObject
     * @param username
     * @param password_attempt
     * @param requested_role
     * @returns {Promise<{msg: string, code: number, content: {}}>}
     *
     * verifies user credentials, tracks login attempts,
     * and returns a success or failure result along with authentication details.
     *
     */
    async authenticateUser(requestObject, responseObject, username, password_attempt, requested_role = 0) {
        let output = this.getDefaultOutput();
        requested_role = parseInt(requested_role);
        if (isNaN(requested_role)) {
            output.code = 403;
            output.msg = "";
            return output;
        }

        //dto
        let attempt = new AuthenticationAttemptDto();
        //this.invokerIp, this.getCurrentTimestampMillis(), 403, username, requested_role
        attempt.ipAddress = this.invokerIp;
        attempt.timestampStart = this.getCurrentTimestampMillis();
        attempt.serverResponseCode = 403;
        attempt.requestedUsername = username;
        attempt.requestedRole = requested_role;

        let userControllerOutput = await this._userController.getUser(username);
        if (userControllerOutput.code !== 200) {
            attempt.timestampEnd = this.getCurrentTimestampMillis();
            await this._model.insertAttempt(attempt);
            output.code = 403;
            output.msg = "";
            return output;
        }
        let user = userControllerOutput.content;
        let hasRole = this.hasUserRequestedRole(user, requested_role);
        if (hasRole === false) {
            attempt.timestampEnd = this.getCurrentTimestampMillis();
            await this._model.insertAttempt(attempt);
            output.code = 403;
            output.msg = "";
            return output;
        }
        let checkResult = await this.hashCheck(user.psw_shadow, password_attempt);
        if (checkResult === false) {
            attempt.timestampEnd = this.getCurrentTimestampMillis();
            await this._model.insertAttempt(attempt);
            output.code = 403;
            output.msg = "";
            return output;
        }
        attempt.timestampEnd = this.getCurrentTimestampMillis();
        attempt.serverResponseCode = 204;
        await this._model.insertAttempt(attempt);
        requestObject.session.user = user;
        requestObject.session.save();
        return output;
    }

    deAuthenticateUser(requestObject) {
        let output = this.getDefaultOutput();
        if (this.isAuthLogged(requestObject) === false) {
            output.code = 404;
            output.msg = "Not authenticated.";
            return output;
        }
        requestObject.session.destroy();
        output.code = 204;
        return output;
    }

    /**
     * @param {string} invokerIp
     *
     * save the client ip addr
     */
    setInvokerIp(invokerIp) {
        this.invokerIp = invokerIp;
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
        switch (requested_role) {
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

    /**
     * @param request
     * return {Boolean}
     */
    isAuthLogged(request) {
        if (request.session && request.session.user && request.session.user.username)
            return true;
        return false;
    }

    /**
     * @param request
     * return {Promise<Boolean>}
     */
    async isAuthAdmin(request) {
        if (this.isAuthLogged(request) === false)
            return false;
        let user = await this._userController.getUser(request.session.user.username);
        return user.isAdmin;
    }

    /**
     * Given request param returns the
     * @param request
     * @return {Promise<{}|UserDto>}
     */
    async getAuthenticatedUser(request) {
        if (this.isAuthLogged(request)) {
            await this.updateUser(request);
            return request.session.user;
        }
        return {};
    }

    /**
     * @param {object} request
     * @return Promise<void>
     */
    async updateUser(request) {
        if (this.isAuthLogged(request)) {
            let requestUser = await this._userController.getUser(request.session.user.username);
            if (requestUser.code === 200) {
                request.session.user = requestUser.content;
                request.session.save();
            }
        }
    }
}
