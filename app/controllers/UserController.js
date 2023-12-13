const Controller = require("./Controller");
const QuoteController = require("./QuoteController");
const QuoteModel = require("../models/QuoteModel");
const ChannelRolesController = require("./ChannelRolesController");
const ChannelRolesModel = require("../models/ChannelRolesModel");
const SquealToUserModel = require("../models/SquealToUserModel");
const SquealIrModel = require("../models/SquealIrModel");
const SquealModel = require("../models/SquealModel");
const VipController = require("./VipController");
const VipModel = require("../models/VipModel");
const VipDto = require("../entities/dtos/VipDto");
const CommentModel = require("../models/CommentModel");
const UserDto = require("../entities/dtos/UserDto");

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

        if (escapeControl === false) {
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

        let vipCtrl = new VipController(new VipModel());
        let vipCtrlOut = await vipCtrl.getVip(username);
        if (vipCtrlOut['code'] !== 200) {
            //To delete it should be 404
            output['code'] = 412;
            output['msg'] = 'Downgrade from VIP.';
            output['sub_code'] = 3;
        }

        //Before deleting quote information we should delete all channel relationship.
        let roleCtrlOut = await channelRoleController.deleteUserRole(username, authenticatedUser);

        if (roleCtrlOut['code'] !== 200) {
            //Errors!
            output['code'] = 500;
            output['sub_code'] = 2;
            output['msg'] = 'Internal server error.';
        }

        let quoteController = new QuoteController(new QuoteModel())
        let deleteQuotaResult = await quoteController.deleteQuote(username);
        if (deleteQuotaResult['code'] !== 200) {
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

        let squealModel = new SquealModel();
        let squealImpressionReactions = new SquealIrModel();
        let squealToUserModel = new SquealToUserModel();
        let commentModel = new CommentModel();

        //Now squeals
        let result = await squealModel.deleteUser(username);
        if (result === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error UserController::deleteUser - 1';
            return output;
        }

        //Now impression and reactions
        result = await squealImpressionReactions.deleteUser(username);
        if (result === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error UserController::deleteUser - 2';
            return output;
        }

        //Now squeals to user
        result = await squealToUserModel.deleteUser(username);
        if (result === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error UserController::deleteUser - 3';
            return output;
        }

        result = await commentModel.deleteUsers(username);
        if (result === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error UserController::deleteUser - 4';
            return output;
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

        if (userObj.isAdmin && this.isObjectVoid(authenticatedUser) && !authenticatedUser.isAdmin) {
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
        userObj.pfp = autoload.defaultImageBase64;

        let databaseResponse = await this._model.createUser(userObj);
        if (databaseResponse)
            output['content'] = userObj;
        else {
            output['code'] = 500;
            output['msg'] = 'Error inserting into DB.';
            return output;
        }

        let quoteCtrl = await quoteController.createQuote(userObj.username);
        if (quoteCtrl.code !== 200) {
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
        newUser.reset = oldUserObj.reset;

        if (authenticatedUser.isAdmin === false) {
            newUser.isAdmin = oldUserObj.isAdmin;
            newUser.isSmm = oldUserObj.isSmm;
        }

        if (newUser.pfp === null)
            newUser.pfp = oldUserObj.pfp;
        else {
            let base64 = newUser.pfp;
            let split = base64.split(',');
            let str = '';
            for (let i = 0; i < split.length; i++) {
                if (i === 0)
                    continue;
                if (str !== '')
                    str = str + ',';
                str = str + split[i];
            }
            newUser.pfp = str;
            if (this.isBase64(newUser.pfp) === false) {
                output['code'] = 400;
                output['msg'] = 'Content is not base64';
                return output;
            }
        }

        if (newUser.psw_shadow !== '') //if password isn't set, save the old password
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

        if (newUser.username !== oldUsername) {

            let isSmm = await this.getSmm(oldUsername);
            if (isSmm.code === 200) {
                output['code'] = 409;
                output['req_error'] = -6;
                output['msg'] = 'Vip cannot change their name.';
                return output;
            }

            //Updating references entities. Let's start by quote
            let quoteController = new QuoteController(new QuoteModel())
            let result = await quoteController.changeUsernameQuota(oldUsername, newUser.username);
            if (result['code'] !== 200) {
                output['code'] = 500;
                output['msg'] = 'Internal server error UserController::updateUser - 1';
                return output;
            }

            //Now channel
            let channelRoleController = new ChannelRolesController(new ChannelRolesModel());
            result = await channelRoleController.substituteUser(oldUsername, newUser.username);
            if (result['code'] !== 200) {
                output['code'] = 500;
                output['msg'] = 'Internal server error UserController::updateUser - 2';
                return output;
            }

            let squealModel = new SquealModel();
            let squealImpressionReactions = new SquealIrModel();
            let squealToUserModel = new SquealToUserModel();

            //Now squeals
            result = await squealModel.replaceUser(oldUsername, newUser.username);
            if (result === false) {
                output['code'] = 500;
                output['msg'] = 'Internal server error UserController::updateUser - 3';
                return output;
            }

            //Now impression and reactions
            result = await squealImpressionReactions.replaceUser(oldUsername, newUser.username);
            if (result === false) {
                output['code'] = 500;
                output['msg'] = 'Internal server error UserController::updateUser - 4';
                return output;
            }

            //Now squeals to user
            result = await squealToUserModel.replaceUser(oldUsername, newUser.username);
            if (result === false) {
                output['code'] = 500;
                output['msg'] = 'Internal server error UserController::updateUser - 5';
                return output;
            }

            //Now comments
            let commentModel = new CommentModel();
            result = await commentModel.substituteUsers(oldUsername, newUser.username);
            if (result === false) {
                output['code'] = 500;
                output['msg'] = 'Internal server error UserController::updateUser - 5';
                return output;
            }

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

        if (userObj.isUser !== true && userObj.isUser !== false) return -3;
        if (userObj.isSmm !== true && userObj.isSmm !== false) return -3;
        if (userObj.isAdmin !== true && userObj.isAdmin !== false) return -3;

        if (this.containsWhiteSpace(username)) return -4;
        if (this.containsOneLetter(username) === false) return -5;

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
     * @param {string} filter
     * @return Promise<>
     */
    async getUserList(requestingUser, offset, limit, search, orderBy, orderDir, filter = 'NONE') {
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
        output.content['users'] = await this._model.getUserList(offset, limit, search, orderBy, orderDir, filter);
        output.content['totalCount'] = await this._model.getUserCount(search, filter);

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
     * @return {Promise<boolean>}
     * Return true if the user exists, false otherwise.
     */
    async userExists(username) {
        return await this._model.userExists(username);
    }


    /**
     * @param {string} username
     * @param {UserDto} authUser
     * @return {Promise<{msg: string, code: number, sub_code: number,content: {}}>}
     */
    async toggleLock(username, authUser) {
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
     * @param username {string}
     * @param fromTimestamp {number}
     * @param toTimestamp {number}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     * Siam sicuri di mantenere questa funzione qui? Si dai
     */
    async getPopularityStats(username, fromTimestamp, toTimestamp) {
        let output = this.getDefaultOutput();
        let squealModel = new SquealModel();

        if (isNaN(fromTimestamp)) fromTimestamp = 0;
        if (isNaN(toTimestamp)) toTimestamp = 0;

        let exists = await this.userExists(username);
        if (exists === false) {
            output['code'] = 404;
            output['msg'] = 'User not found.';
            return output;
        }
        let result = await squealModel.getPopularityStats(username, fromTimestamp, toTimestamp);
        for (const resultKey in result) {
            result[resultKey] = result[resultKey].getDocument();
        }
        output.content = result;
        return output;
    }

    /**
     * @param username {string}
     * @return {Promise<{msg: string, code: number, sub_code: number,content: {}}>}
     */
    async getUserRoles(username) {
        let output = this.getDefaultOutput();

        let exists = await this.userExists(username);
        if (exists === false) {
            output['code'] = 404;
            output['msg'] = 'User not found.';
            return output;
        }

        let channelRoleController = new ChannelRolesController(new ChannelRolesModel());
        return await channelRoleController.getAllRolesOfUser(username);
    }


    /**
     * @param {string} username
     * @param {string} reset
     * @param {string} password
     * @return {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async resetPasswd(username, reset, password) {
        let output = this.getDefaultOutput();

        let user = await this._model.getUser(username);
        if (!this.isInstanceOfClass(user, 'UserDto')) {
            //User not found!
            output['code'] = 404;
            output['msg'] = 'User not found.';
            return output;
        }

        if (reset === '') {
            output['code'] = 403;
            output['msg'] = 'Reset string does not match. - 1';
            return output;
        }

        if (password === '' || user.reset === null || user.reset === '') {
            output['code'] = 400;
            output['msg'] = 'Missing password.';
            return output;
        }

        if (user.reset !== reset) {
            output['code'] = 403;
            output['msg'] = 'Reset string does not match. - 2';
            return output;
        }

        //Ok update the user.
        let psw_shadow = await this.crypt(password);
        let result = this._model.updatePassword(username, psw_shadow);

        if (result === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error';
            return output;
        }


        return output;
    }


    /**
     * Given an username enable or disable his/her vip status
     * @param username {String}
     * @param authenticatedUser {{}|UserDto}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async toggleVip(username, authenticatedUser) {
        let output = this.getDefaultOutput();

        if (!(await this._model.userExists(username))) {
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
        if (newVIPStatus === true) {
            //create the VIP entity
            let res = await vipCtrl.createVip(username);
            if (res['code'] !== 200)
                return res;
        } else {
            //delete the VIP entity if was not a smm
            if (userObj.isSmm === true) {
                output['code'] = 403
                output['msg'] = 'Forbidden, you have some linked accounts, disable smm first'
                return output;
            }
            let res = await vipCtrl.deleteVip(username);
            if (res['code'] !== 200)
                return res;
        }

        //switch the toggle (true->false or false->true)
        let result = this._model.changeVipStatus(userObj, newVIPStatus);
        if (result === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error.';
            return output;
        }
        //output['content'] =
        return output;
    }

    /**
     * Enable/Disable the smm status
     * @param authenticatedUser {{}|UserDto}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async toggleSmm(authenticatedUser) {
        let output = this.getDefaultOutput();
        let username = authenticatedUser.username;

        if (!(await this._model.userExists(username))) {
            output['code'] = 404;
            output['msg'] = 'User not found.';
            return output;
        }
        if (this.isObjectVoid(authenticatedUser) === true) {
            output['code'] = 403;
            output['msg'] = 'User not authenticated';
            return output;
        }

        //check if the user is Vip
        let isVip = authenticatedUser.vip;
        if (isVip === false) {
            output['code'] = 412
            output['msg'] = "Precondition Failed, user is not a VIP"
            return output;
        }

        let userObj = await this._model.getUser(username);
        let newSmmStatus = !userObj.isSmm;
        let vipCtrl = new VipController(new VipModel());
        if (newSmmStatus === false) {
            //user is NO longer SMM, clear the linked users list,

            //for each account remove the linkedSmm from it
            let userList = await this.getLinkedUsers(username);
            userList = userList.content;
            for (let i = 0; i < userList.length; i++) {
                let remSmmFromVip = await vipCtrl.removeSmm(userList[i]);
                if (remSmmFromVip['code'] !== 200) {
                    return remSmmFromVip;
                }
            }
            let clearLinkedUsers = vipCtrl.disableSmm(username);
            if (clearLinkedUsers['code'] === 500) {
                return clearLinkedUsers;
            }
        } else if (newSmmStatus === true) {
            //user is becoming a smm, check if she/he has smm already
            let vipObj = await vipCtrl.getVip(authenticatedUser.username);
            if (vipObj['content'].linkedSmm !== "") {
                output['code'] = 403;
                output['msg'] = 'Forbidden, warning: you have a linked smm'
                return output;
            }
        }

        //toggle isSmm
        let res = this._model.changeSmmStatus(userObj, newSmmStatus);
        if (res === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error.';
        }
        return output;
    }

    /**
     * if the user is vip, he/she can choose an existing smm to link in his/her vip collection
     * @param SmmUsername {String}
     * @param authenticatedUser {{}|UserDto}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async pickSmm(SmmUsername, authenticatedUser) {
        let output = this.getDefaultOutput();

        //check authentication
        if (this.isObjectVoid(authenticatedUser) === true) {
            output['code'] = 403;
            output['msg'] = 'User not authenticated';
            return output;
        }

        //check if vip exists
        let username = authenticatedUser['username'];
        let vipCtrl = new VipController(new VipModel());
        let vipObj = await vipCtrl.getVip(username);
        if (vipObj['code'] !== 200) {
            output['code'] = 412
            output['msg'] = "Precondition Failed, user is not a VIP"
            return output;
        }

        //check if vip has already a smm
        if (vipObj.content['linkedSmm'] !== "") {
            output['code'] = 412
            output['msg'] = "Precondition Failed, user has already a smm"
            return output;
        }

        //check the user is not a smm
        if (vipObj['content'].isSmm === true) {
            output['code'] = 412
            output['msg'] = "Precondition Failed, user is a Smm"
            return output;
        }

        //check the Smm is a Vip an a smm
        let SmmObj = await vipCtrl.getVip(SmmUsername);
        if (SmmObj['code'] !== 200) {
            output['code'] = 412
            output['msg'] = "Precondition Failed, Smm is not a VIP"
            return output;
        }
        let smmObj = await this.getUser(SmmUsername);
        smmObj = smmObj['content'];
        if (smmObj.isSmm === false) {
            output['code'] = 412
            output['msg'] = "Precondition Failed, the user you select is not a Smm"
            return output;
        }

        //check if the Smm has more than five linked users, not yet tested
        let otherVips = await this.getLinkedUsers(SmmUsername);
        if (otherVips['content'].length >= 5) {
            output['code'] = 412
            output['msg'] = "Precondition Failed, Smm has reach linkedUsers limit"
            return output;
        }

        let vipDto = new VipDto(vipObj.content);
        let smmDto = new VipDto(SmmObj.content);

        let res = vipCtrl.pickSmm(vipDto, smmDto);
        if (res['code'] !== 200) {
            return res;
        }
        return output;
    }

    /**
     * if the user is vip, he/she can remove his/her actual smm
     * @param authenticatedUser {{}|UserDto}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async removeSmm(authenticatedUser) {
        let output = this.getDefaultOutput();

        //check authentication
        if (this.isObjectVoid(authenticatedUser) === true) {
            output['code'] = 403;
            output['msg'] = 'User not authenticated';
            return output;
        }

        //check if vip exists
        let username = authenticatedUser['username'];
        let vipCtrl = new VipController(new VipModel());
        let vipObj = await vipCtrl.getVip(username);
        if (vipObj['code'] !== 200) {
            output['code'] = 412
            output['msg'] = "Precondition Failed, user is not a VIP"
            return output;
        }

        let vipResRemoved = await vipCtrl.removeSmm(username);
        if (vipResRemoved['code'] !== 200) {
            return vipResRemoved;
        }
        return output;
    }

    /**
     * get the smm of a vip
     * @param username {String}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async getSmm(username) {
        username = username.trim().toLowerCase();
        let vipCtrl = new VipController(new VipModel());
        let vipExists = await vipCtrl.getVip(username);

        if (vipExists['code'] !== 200)
            return vipExists;

        let output = this.getDefaultOutput();
        output['content'] = {smm: vipExists['content'].linkedSmm};
        return output;
    }


    /**
     * @param {string} username Existing username
     * @param {number} newPop new Popularity Verbalized
     * @param {number} newUnPop new Unpopularity Verbalized
     * @return {Promise<boolean>}
     * If newPop = -1 or newUnPop = -1 then the respective fields are not update.
     */
    async updateVerbalizedPopularity(username, newPop = -1, newUnPop = -1) {
        if (newPop !== -1) {
            let result = await this._model.updateUserField(username, 'verbalized_popularity', newPop);
            if (result === false)
                return false;
        }
        if (newUnPop !== -1) {
            let result = await this._model.updateUserField(username, 'verbalized_unpopularity', newUnPop);
            if (result === false)
                return false;
        }
        return true;
    }


    /**
     * get users list linked to a smm
     * @param username {String}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async getLinkedUsers(username) {
        username = username.trim().toLowerCase();
        let vipCtrl = new VipController(new VipModel());
        let smmExists = await vipCtrl.getVip(username);

        if (smmExists['code'] !== 200)
            return smmExists;

        let output = this.getDefaultOutput();
        let isSmm = await this.getUser(username);
        if (isSmm['content'].isSmm === false) {
            output['code'] = 412
            output['msg'] = 'User is not a Smm'
            return output
        }
        output['content'] = smmExists['content'].linkedUsers;
        return output;
    }

    async createSquealerD() {
        let res = await this.userExists('squealerd');
        if (res === true)
            return;

        let quoteController = new QuoteController(new QuoteModel())
        let userObj = new UserDto();
        userObj.username = 'squealerd';
        userObj.email = 'squealerd@squealer.it';
        userObj.first_name = 'Squealer';
        userObj.last_name = 'Daemon';
        userObj.registration_timestamp = this.getCurrentTimestampSeconds();
        userObj.psw_shadow = await this.crypt('ciaociao');
        userObj.isAdmin = true;
        userObj.isUser = false;
        userObj.vip = false;
        userObj.isSmm = false;
        userObj.locked = false;
        userObj.verbalized_popularity = 0;
        userObj.verbalized_unpopularity = 0;
        userObj.pfp = '';

        await this._model.createUser(userObj);
        await quoteController.createQuote(userObj.username);
    }

}


/*
* Problemini:
* quando un utente viene eliminato bisogna controllare che sia Vip e nel caso
* rimuovere tutte le relazioni che aveva coe Smm-Vip
*
*
* stessa cosa per quando un utente non diventa piu' vip
*
*
* -----> un utente non puo' eliminare il proprio profilo se e' vip, deve fare il toggle
* e poi in seguito pue' eliminare il profilo
*
* le relazioni sono associazioni di nomi e non di entita'
*
* chiunque puo' vedere chi sono gli smm e chi sono i linkati ma per ora chissenefotte
*
*
* */
