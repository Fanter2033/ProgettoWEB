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
     * @param username
     * @returns {Promise<{msg: string, code: number, content: {}}>}
     *
     * Delete a user if it exist
     *
     * TODO: a normal user can only delete his account, the admin can delete all the non-admin-accounts.
     * - return 403 -> if a user has no privilege to delete accounts
     */
    async deleteUser(username) {
        let output = this.getDefaultOutput();

        username = username.trim();
        if (username.length === 0) {
            output['code'] = 400;
            output['msg'] = 'No username sent.';
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
     * @returns {Promise<Object>}
     *
     * Given the user object returns code 200 if the user is created, false otherwise.
     */
    async createUser(userObj) {
        let output = this.getDefaultOutput();
        let ctrl_response = this.controlUser(userObj);
        if (ctrl_response !== 0) {
            output['code'] = 400;
            output['req_error'] = -100 + ctrl_response;
            output['msg'] = 'Email not valid or field is not populate.';
            return output;
        }

        //Check the username do not exists
        if (await this._model.userExists(userObj.username)) {
            output['code'] = 400;
            output['req_error'] = -1;
            output['msg'] = 'Username already exists.';
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
     * @returns {Promise<Object>}
     */
    async updateUser(newUser, oldUsername) {
        let output = this.getDefaultOutput();
        let ctrl_response = this.controlUser(newUser);
        if (ctrl_response !== 0) {
            output['code'] = 400;
            output['msg'] = 'Email not valid or field is not populate.';
            return output;
        }

        if (await this._model.userExists(oldUsername) === false) {
            output['code'] = 400;
            output['msg'] = 'Old user do not exists.';
            return output;
        }

        if (await this._model.userExists(newUser.username) && newUser.username !== oldUsername) {
            output['code'] = 400;
            output['msg'] = 'Username already used';
            return output;
        }

        let oldUserObj = await this._model.getUser(oldUsername);
        newUser.registration_timestamp = oldUserObj.registration_timestamp;
        newUser.psw_shadow = await this.crypt(newUser.psw_shadow);

        let databaseResponse = await this._model.replaceUser(newUser, oldUserObj.username);
        if (databaseResponse)
            output['content'] = newUser;
        else {
            output['code'] = 500;
            output['msg'] = 'Error updating into DB.';
        }

        return output;
    }

    /**
     * @param userObj {UserDto}
     * @returns number
     * Execute data control. Returns 1 on success. Returns negative numbers on errors.
     * Please control the code to understand the errors handled.
     */
    controlUser(userObj) {
        let username = userObj.username.trim().toLowerCase();
        let password = userObj.psw_shadow.trim();
        let firstname = userObj.first_name.trim();
        let lastname = userObj.last_name.trim();
        let email = userObj.email.trim().toLowerCase();
        userObj.registration_timestamp = this.getCurrentTimestampSeconds();

        if (username.length === 0 || password.length === 0 || firstname.length === 0 || lastname.length === 0 || email.length === 0)
            return -1;

        if (this.isEmail(email) === false)
            return -2;

        userObj.username = username;
        userObj.psw_shadow = password;
        userObj.first_name = firstname;
        userObj.last_name = lastname;
        userObj.email = email;
        userObj.isUser = true;
        userObj.isSmm = false;
        userObj.isAdmin = false;

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
        output.content['totalCount'] = await this._model.getUserCount();

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