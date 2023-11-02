const Controller = require("./Controller");
const SquealDto = require("../entities/dtos/QuoteDto");
const QuoteController = require("./QuoteController");
const UserController = require("./UserController");

module.exports = class SquealController extends Controller {
    constructor(model) {
        super();
        this._model = model;
    }

    async getSqueal(identifier){
        let output = this.getDefaultOutput();

        let squeal = this._model.getSqueal(identifier);
        if(this.isObjectVoid(squeal)) {
            output['code'] = 404;
            output['msg'] = 'Channel not found.';
            return output;
        }
        output['content'] = squeal.getDocument();
        return output;
    }

    async postSqueal(squealDto, authenticatedUser){
        let output = this.getDefaultOutput();
        if(!this.checkSquealType(squealDto.message_type)){
            output['code'] = 400;
            output['msg'] = 'Invalid type of Squeal. Bad request'
            return output;
        }

        if(this.isObjectVoid(authenticatedUser)){
            output['code'] = 403;
            output['msg'] = 'Please Login, cugliun'
            return output;
        }

        if(squealDto.sender !== authenticatedUser.username){
            output['code'] = 401;
            output['msg'] = 'Unauthorized'
            return output;
        }

        if(true){
            //TODO: controllare che i destinatori
        }

        if(){

        }


    }

    checkSquealType(type){
        return  type === 'MESSAGE_TEXT' ||
                type === 'IMAGE_URL'    ||
                type === 'VIDEO_URL'    ||
                type === 'POSITION';
    }
}