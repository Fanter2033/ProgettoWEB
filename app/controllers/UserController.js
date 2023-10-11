const Controller = require("./Controller");
module.exports = class UserController extends Controller {

    constructor(model) {
        super();
        this._model = model;
    }

    /**
     *
     * @param username {String}
     * @param authenticatedUser {UserDto}
     * @returns {Promise<*|UserDto|{}>}
     *
     * Given a username, this functions returns the user, if found. Error 404 otherwise.
     */
    async getUser(username) {
        let output = this.getDefaultOutput();

        username = username.trim().toLowerCase();
        if (username.length === 0) {
            output['code'] = 400;
            output['msg'] = 'No username sent.';
            return output;
        }

        let user = await this._model.getUser(username);
        if (!this.isInstanceOfClass(user, 'UserDto')) {
            //User not found!
            output['code'] = 404;
            output['msg'] = 'User not found.';
        } else
            //User found
            output['content'] = user.getDocument();
        return output;
    }

    /**
     *
     * @param username {string}
     * @param authenticatedUser {UserDto}
     * @returns {Promise<{msg: string, code: number, content: {}}>}
     *
     * Delete a user if it exist, the operation can be made only by the deleting user or a squealer Admin.
     *
     */
    async deleteUser(username, authenticatedUser) {
        let output = this.getDefaultOutput();

        username = username.trim();
        if (username.length === 0) {
            output['code'] = 400;
            output['msg'] = 'No username sent.';
            return output;
        }

        if (this.isObjectVoid(authenticatedUser) || (!authenticatedUser.isAdmin && authenticatedUser.username !== username)) {
            output['code'] = 403;
            output['msg'] = 'Forbidden.';
            return output;
        }

        if (await this._model.userExists(username) === false) {
            //User not found!
            output['code'] = 404;
            output['msg'] = 'User not found.';
            return output;
        }

        //Let's delete the user!
        if (await this._model.deleteUser(username) === false) {
            //Errors!
            output['code'] = 400;
            output['msg'] = 'Delete executed but no user were deleted.';
        }

        return output;
    }

    /**
     * @param userObj {UserDto}
     * @param authenticatedUser {UserDto}
     * @returns {Promise<Object>}
     *
     * Given the user object returns code 200 if the user is created, false otherwise.
     */
    async createUser(userObj, authenticatedUser) {
        let output = this.getDefaultOutput();
        let ctrl_response = this.controlUser(userObj);
        if (ctrl_response !== 0) {
            output['code'] = 400;
            output['req_error'] = -100 + ctrl_response;
            output['msg'] = 'Email not valid or field is not populate.';
            return output;
        }

        //Check the username do not exists
        if (await this._model.userExists(userObj.username, userObj.email)) {
            output['code'] = 400;
            output['req_error'] = -1;
            output['msg'] = 'Username already exists.';
            return output;
        }

        if(userObj.isAdmin && this.isObjectVoid(authenticatedUser) && !authenticatedUser.isAdmin){
            userObj.isAdmin = false;
        }

        if (!userObj.isUser && !userObj.isSmm && !userObj.isAdmin) {
            output['code'] = 400;
            output['req_error'] = -2;
            output['msg'] = 'User has no authorization.';
            return output;
        }

        //Salt! - A lot of SALT!!!
        userObj.psw_shadow = await this.crypt(userObj.psw_shadow);

        let databaseResponse = await this._model.createUser(userObj);
        if (databaseResponse)
            output['content'] = userObj;
        else {
            output['code'] = 500;
            output['msg'] = 'Error inserting into DB.';
        }

        return output;
    }

    /**
     *
     * @param newUser {UserDto}
     * @param oldUsername {string}
     * @param authenticatedUser {UserDto}
     * @returns {Promise<Object>}
     */
    async updateUser(newUser, oldUsername, authenticatedUser) {
        let output = this.getDefaultOutput();
        let ctrl_response = this.controlUser(newUser, true);
        if (ctrl_response !== 0) {
            output['code'] = 400;
            output['req_error'] = -100 + ctrl_response;
            output['msg'] = 'Email not valid or field is not populate.';
            return output;
        }

        if (this.isObjectVoid(authenticatedUser) || (!authenticatedUser.isAdmin && authenticatedUser.username !== oldUsername)) {
            output['code'] = 403;
            output['req_error'] = -4;
            output['msg'] = 'Forbidden.';
            return output;
        }

        if (await this._model.userExists(oldUsername) === false) {
            output['code'] = 400;
            output['req_error'] = -3;
            output['msg'] = 'Old user do not exists.';
            return output;
        }

        let oldUserObj = await this._model.getUser(oldUsername);

        if (await this._model.userExistsByEmail(newUser.email) && newUser.email !== oldUserObj.email) {
            output['code'] = 400;
            output['req_error'] = -1;
            output['msg'] = 'Email already used';
            return output;
        }

        if (await this._model.userExists(newUser.username) && newUser.username !== oldUsername) {
            output['code'] = 400;
            output['req_error'] = -1;
            output['msg'] = 'Email already used';
            return output;
        }

        if (!newUser.isUser && !newUser.isSmm && !newUser.isAdmin) {
            output['code'] = 400;
            output['req_error'] = -2;
            output['msg'] = 'User has no authorization.';
            return output;
        }


        newUser.registration_timestamp = oldUserObj.registration_timestamp;
        if(newUser.psw_shadow !== '')
            newUser.psw_shadow = await this.crypt(newUser.psw_shadow);
        else
            newUser.psw_shadow = oldUserObj.psw_shadow;

        let databaseResponse = await this._model.replaceUser(newUser, oldUserObj.username);
        if (databaseResponse)
            output['content'] = newUser;
        else {
            output['code'] = 500;
            output['req_error'] = -5;
            output['msg'] = 'Error updating into DB.';
        }

        return output;
    }

    /**
     * @param userObj {UserDto}
     * @param isEdit {boolean}
     * @returns number
     * Execute data control. Returns 1 on success. Returns negative numbers on errors.
     * Please control the code to understand the errors handled.
     */
    controlUser(userObj, isEdit = false) {
        let username = userObj.username.trim().toLowerCase();
        let password = userObj.psw_shadow.trim();
        let firstname = userObj.first_name.trim();
        let lastname = userObj.last_name.trim();
        let email = userObj.email.trim().toLowerCase();
        userObj.registration_timestamp = this.getCurrentTimestampSeconds();

        if (username.length === 0 || (password.length === 0 && isEdit === false) || firstname.length === 0 || lastname.length === 0 || email.length === 0)
            return -1;

        if (this.isEmail(email) === false)
            return -2;

        if(userObj.isUser !== true && userObj.isUser !== false)
            return -3;

        if(userObj.isSmm !== true && userObj.isSmm !== false)
            return -3;

        if(userObj.isAdmin !== true && userObj.isAdmin !== false)
            return -3;

        userObj.username = username;
        userObj.psw_shadow = password;
        userObj.first_name = firstname;
        userObj.last_name = lastname;
        userObj.email = email;

        return 0;
    }


    /**
     * @param {UserDto | {}} requestingUser
     * @param {number} offset
     * @param {number} limit
     * @param {string} search
     * @param {string} orderBy
     * @param {string} orderDir
     * @return Promise<>
     */
    async getUserList(requestingUser, offset, limit, search, orderBy, orderDir) {
        let output = this.getDefaultOutput();

        let isAdmin = false;
        if (this.isObjectVoid(requestingUser) === false)
            isAdmin = requestingUser.isAdmin;

        offset = parseInt(offset);
        limit = parseInt(limit);
        search = search.trim();
        orderBy = orderBy.trim();
        orderDir = orderDir.trim();

        offset = (isNaN(offset) ? 0 : offset);
        limit = (isNaN(limit) ? 10 : limit);
        if (limit > 100) limit = 100;

        orderDir = ((orderDir === 'ORDER_ASC') ? 'ORDER_ASC' : 'ORDER_DESC');

        output.content = {}
        output.content['users'] = await this._model.getUserList(offset, limit, search, orderBy, orderDir);
        output.content['totalCount'] = await this._model.getUserCount(search);

        for (let i = 0; i < output.content['users'].length; i++) {
            if (isAdmin === false)
                output.content['users'][i] = this.clearSensitiveInformation(output.content['users'][i]);
            output.content['users'][i] = output.content['users'][i].getDocument();
        }

        return output;
    }


    /**
     * @param {UserDto} user
     * @return {UserDto}
     */
    clearSensitiveInformation(user) {
        user.registration_timestamp = null;
        user.psw_shadow = null;
        user.isAdmin = null;
        user.isSmm = null;
        user.isUser = null;
        return user;
    }


}