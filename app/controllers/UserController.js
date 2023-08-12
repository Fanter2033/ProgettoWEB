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
        if(username.length === 0) {
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
        if(username.length === 0) {
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
            if(await this._model.deleteUser(username) === false){
                //Errors!
                output['code'] = 400;
                output['msg'] = 'Delete executed but no user were deleted.';
            }
        }

        return output;
    }

}