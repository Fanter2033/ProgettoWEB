const Controller = require("./Controller");
const QuoteController = require ("./QuoteController");
const QuoteModel = require ("../models/QuoteModel");
const ChannelRolesController = require("./ChannelRolesController");
const ChannelRolesModel = require("../models/ChannelRolesModel");
const VipController = require("./VipController");
const VipModel = require("../models/VipModel");

module.exports = class UserController extends Controller {

    constructor(model) {
        super();
        this._model = model;
    }

    /**
     *
     * @param username {String}
     * @returns {Promise<{msg: string, code: number, sub_code: number,content: {}}>}
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
     * @param escapeControl {boolean}
     * @returns {Promise<{msg: string, code: number, content: {}}>}
     *
     * Delete a user if it exists, the operation can be made only by the deleting user or a squealer Admin.
     *
     */
    async deleteUser(username, authenticatedUser, escapeControl = false) {
        let output = this.getDefaultOutput();

        username = username.trim();
        if (username.length === 0) {
            output['code'] = 400;
            output['msg'] = 'No username sent.';
            return output;
        }


        let channelRoleController = new ChannelRolesController(new ChannelRolesModel());

        if(escapeControl === false){
            if (this.isObjectVoid(authenticatedUser) || (!authenticatedUser.isAdmin && authenticatedUser.username !== username)) {
                output['code'] = 403;
                output['msg'] = 'Forbidden.';
                return output;
            }
        }

        if (await this._model.userExists(username) === false) {
            //User not found!
            output['code'] = 404;
            output['msg'] = 'User not found.';
            return output;
        }

        //Before deleting quote information we should delete all channel relationship.
        let roleCtrlOut = await channelRoleController.deleteUserRole(username, authenticatedUser);

        if(roleCtrlOut['code'] !== 200){
            //Errors!
            output['code'] = 500;
            output['sub_code'] = 2;
            output['msg'] = 'Internal server error.';
        }

        let quoteController = new QuoteController(new QuoteModel())
        let deleteQuotaResult = await quoteController.deleteQuote(username);
        if(deleteQuotaResult['code'] !== 200){
            //Errors!
            output['code'] = 500;
            output['sub_code'] = 1;
            output['msg'] = 'Internal server error.';
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
        let quoteController = new QuoteController(new QuoteModel())

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
        userObj.vip = false;
        userObj.locked = false;

        let databaseResponse = await this._model.createUser(userObj);
        if (databaseResponse)
            output['content'] = userObj;
        else {
            output['code'] = 500;
            output['msg'] = 'Error inserting into DB.';
            return  output;
        }

        let quoteCtrl = await quoteController.createQuote(userObj.username);
        if(quoteCtrl.code !== 200){
            //if we are in this case we should revert all and throw an error
            output['code'] = 500;
            output['msg'] = 'Warning! Cannot create associate quota. Operation failed';
            await this.deleteUser(userObj.username, null, true);
        }

        return output;
    }

    /**
     *
     * @param newUser {UserDto}
     * @param oldUsername {string}
     * @param authenticatedUser {UserDto}
     * @returns {Promise<Object>}
     *
     * change a user from a given username
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

        //if the user doesn't exist then we are in a error situation
        if (await this._model.userExists(oldUsername) === false) {
            output['code'] = 400;
            output['req_error'] = -3;
            output['msg'] = 'Old user do not exists.';
            return output;
        }

        let oldUserObj = await this._model.getUser(oldUsername);

        //Checking if the new email is used. But if the email isn't changed we are safe. But if the email is changed, then we verify that the new one isn't used.
        if (newUser.email !== oldUserObj.email && await this._model.userExistsByEmail(newUser.email)) {
            output['code'] = 400;
            output['req_error'] = -1;
            output['msg'] = 'Email already used';
            return output;
        }

        //Same for users (see email comment)
        if (newUser.username !== oldUsername && await this._model.userExists(newUser.username)) {
            output['code'] = 400;
            output['req_error'] = -1;
            output['msg'] = 'Email already used';
            return output;
        }

        //Checking all authorizations
        if (!newUser.isUser && !newUser.isSmm && !newUser.isAdmin) {
            output['code'] = 400;
            output['req_error'] = -2;
            output['msg'] = 'User has no authorization.';
            return output;
        }


        newUser.registration_timestamp = oldUserObj.registration_timestamp;
        newUser.vip = oldUserObj.vip
        newUser.locked = oldUserObj.locked;

        if(newUser.psw_shadow !== '') //if password isn't set, save the old password
            newUser.psw_shadow = await this.crypt(newUser.psw_shadow);
        else //Password set, save new in the database.
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
     *
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

        if(userObj.isUser !== true && userObj.isUser !== false) return -3;
        if(userObj.isSmm !== true && userObj.isSmm !== false) return -3;
        if(userObj.isAdmin !== true && userObj.isAdmin !== false) return -3;

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


    /**
     * @param {string} username
     * @param {UserDto} authUser
     * @return {Promise<{msg: string, code: number, sub_code: number,content: {}}>}
     */
    async toggleLock(username, authUser){
        let output = this.getDefaultOutput();

        let userExists = await this._model.userExists(username);
        if (userExists !== true) {
            output['code'] = 404;
            output['msg'] = 'Not found.';
            return output;
        }

        let userDto = await this._model.getUser(username);

        if (this.isObjectVoid(authUser) === true) {
            output['code'] = 403;
            output['msg'] = 'User not authenticated';
            return output;
        }

        if (!authUser.isAdmin) {
            output['code'] = 401;
            output['msg'] = 'Not allowed for non-moderators.';
            return output;
        }

        let newLock = userDto.locked;
        newLock = !newLock;
        let result = await this._model.changeUserLock(userDto, newLock);
        if (result === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error.';
            return output;
        }
        return output;
    }

    /**
     *
     * @param username {String}
     * @param authenticatedUser {Promise<{}|UserDto>}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async toggleVip(username, authenticatedUser){
        let output = this.getDefaultOutput();

        if(!(await this._model.userExists(username))){
            output['code'] = 404;
            output['msg'] = 'User not found.';
            return output;
        }

        if (this.isObjectVoid(authenticatedUser) === true) {
            output['code'] = 403;
            output['msg'] = 'User not authenticated';
            return output;
        }

        let userObj = await this._model.getUser(username);
        let vipCtrl = new VipController(new VipModel())
        let newVIPStatus = !userObj.vip;
        //create the VIP entity
        if(newVIPStatus === true){
            let res = await vipCtrl.createVip(username);
            if(res['code'] !== 200)
                return res;
        } else {
            //delete the VIP entity
            let res = await vipCtrl.deleteVip(username);
            if(res['code'] !== 200)
                return res;
        }
        //switch the toggle
        let result = this._model.changeVipStatus(userObj, newVIPStatus);
        if(result === false){
            output['code'] = 500;
            output['msg'] = 'Internal server error.';
            return output;
        }
        //output['content'] =
        return output;
    }

    async toggleSmm(authenticatedUser){
        let output = this.getDefaultOutput();
        let username = authenticatedUser.username;

        if(!(await this._model.userExists(username))){
            output['code'] = 404;
            output['msg'] = 'User not found.';
            return output;
        }

        if (this.isObjectVoid(authenticatedUser) === true) {
            output['code'] = 403;
            output['msg'] = 'User not authenticated';
            return output;
        }

        let vipCtrl = new VipController(new VipModel());
        let isVip = await vipCtrl.getVip(username);
        if(isVip['code'] !== 200){
            output['code'] = 412
            output['msg'] = "Precondition Failed, user is not a VIP"
            return output;
        }

        let userObj = await this._model.getUser(username);
        let newSmmStatus = !userObj.isSmm;
        if(newSmmStatus){
            //user IS now a SMM, remove actual smm if there is one
            //TODO
        } else {
            //user is NO longer SMM, clear the linked users list
            let clearLinkedUsers = vipCtrl.disableSmm(isVip['content']);
            if(clearLinkedUsers['code'] === 500){
                return clearLinkedUsers;
            }
        }

        let res = this._model.changeSmmStatus(userObj,newSmmStatus);
        if(res === false){
            output['code'] = 500;
            output['msg'] = 'Internal server error.';
        }
        return output;
    }

    async pickSmm(SmmUsername, authenticatedUser) {
        let output = this.getDefaultOutput();

        if (this.isObjectVoid(authenticatedUser) === true) {
            output['code'] = 403;
            output['msg'] = 'User not authenticated';
            return output;
        }
    }

    async removeSmm(authenticatedUser){
        //TODO
    }
}