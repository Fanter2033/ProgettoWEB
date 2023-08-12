const Controller = require("./Controller");
module.exports = class UserController extends Controller {

    constructor(model) {
        super();
        this._model = model;
    }

    getModel() {
        return this._model;
    }

    /**
     *
     * @param username
     * @returns {Promise<*|User|{}>}
     * Given a username, this functions returns the user, if found. Error 404 otherwise.
     */
    async getUser(username) {
        let output = this.getDefaultOutput();

        username = username.trim();
        if (username.length === 0) {
            output['code'] = 400;
            output['msg'] = 'No username sent.';
            return output;
        }

        let user = await this._model.getUser(username);
        if (this.isObjectVoid(user)) {
            //User not found!
            output['code'] = 404;
            output['msg'] = 'User not found.';
        } else
            //User found
            output['content'] = user;
        return output;
    }

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
        } else {
            //Let's delete the user!
            if (await this._model.deleteUser(username) === false) {
                //Errors!
                output['code'] = 400;
                output['msg'] = 'Delete executed but no user were deleted.';
            }
        }

        return output;
    }

    /**
     * @param userObj {User}
     * @returns {Promise<Object>}
     * Given the user object returns code 200 if the user is created, false otherwise.
     */
    async createUser(userObj) {
        let output = this.getDefaultOutput();
        let ctrl_response = this.controlUser(userObj);
        if(ctrl_response !== 0) {
            output['code'] = 400;
            output['msg'] = 'Email not valid or field is not populate.';
            return output;
        }

        //Check the username do not exists
        if(await this._model.userExists(userObj.getUsername())){
            output['code'] = 400;
            output['msg'] = 'Username already exists.';
            return output;
        }

        //Salt! - A lot of SALT!!!
        let hash = await this.crypt(userObj.getPassword())
        userObj.setPassword(hash);

        let databaseResponse = await this._model.createUser(userObj);
        if(databaseResponse)
            output['content'] = userObj;
        else {
            output['code'] = 500;
            output['msg'] = 'Error inserting into DB.';
        }

        return output;
    }

    /**
     * @param userObj {User}
     * @returns number
     * Execute data control. Returns 1 on success. Returns negative numbers on errors.
     * Please control the code to understand the errors handled.
     */
    controlUser(userObj) {
        let username = userObj.getUsername().trim().toLowerCase();
        let password = userObj.getPassword().trim();
        let firstname = userObj.getFirstname().trim();
        let lastname = userObj.getLastname().trim();
        let email = userObj.getEmail().trim();
        userObj.setRegistrationTimestamp(this.getCurrentTimestampSeconds());

        if (username.length === 0 || password.length === 0 || firstname.length === 0 || lastname.length === 0 || email.length === 0)
            return -1;

        if(this.isEmail(email) === false)
            return -2;

        userObj.setUsername(username);
        userObj.setPassword(password);
        userObj.setFirstname(firstname);
        userObj.setLastname(lastname);
        userObj.setEmail(email);

        return 0;
    }

}