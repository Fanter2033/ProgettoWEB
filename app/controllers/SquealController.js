const Controller = require("./Controller");
const SquealDto = require("../entities/dtos/QuoteDto");
const QuoteController = require("./QuoteController");
const QuoteModel = require("../models/QuoteModel");
const UserController = require("./UserController");
const {model} = require("mongoose");


module.exports = class SquealController extends Controller {
    constructor(model) {
        super();
        this._model = model;
    }

    /**
     *
     * @param identifier {Number}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
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

    /**
     * @param squealDto {SquealDto}
     * @param authenticatedUser {UserDto}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async postSqueal(squealDto, authenticatedUser){
        let output = this.getDefaultOutput();
        if(this.isObjectVoid(authenticatedUser)){
            output['code'] = 403;
            output['msg'] = 'Please Login, cugliun'
            return output;
        }

        if(!this.checkSquealType(squealDto.message_type)){
            output['code'] = 400;
            output['msg'] = 'Invalid type of Squeal. Bad request'
            return output;
        }

        if(squealDto.sender !== authenticatedUser.username){
            output['code'] = 401;
            output['msg'] = 'Unauthorized'
            return output;
        }

        if(true){
            //TODO: controllare che i destinatari
        }

        let quoteCtrl = new QuoteController(new QuoteModel());
        let quoteRes = await quoteCtrl.getQuote(authenticatedUser.username)
        if(quoteRes >= squealDto.quote_cost){
            output['code'] = 412;
            output['msg'] = 'quote not available'
            return output;
        }

        let modelOutput = await this._model.postSqueal(squealDto);

        if(modelOutput === false){
            output['code'] = 500;
            output['msg'] = 'Internal server error';
            return output;
        }

        output['content'] = squealDto.getDocument();

    }

    checkSquealType(type){
        return  type === 'MESSAGE_TEXT' ||
                type === 'IMAGE_URL'    ||
                type === 'VIDEO_URL'    ||
                type === 'POSITION';
    }
}