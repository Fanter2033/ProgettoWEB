const Controller = require("./Controller");
const SquealDto = require("../entities/dtos/SquelDto");
const QuoteController = require("./QuoteController");
const QuoteModel = require("../models/QuoteModel");
const UserController = require("./UserController");
const QuoteDto = require("../entities/dtos/QuoteDto");


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
            output['msg'] = 'Please Login.'
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
        quoteRes = new QuoteDto(quoteRes.content);
        if(quoteRes >= squealDto.quote_cost){
            output['code'] = 412;
            output['msg'] = 'Quote not available'
            return output;
        }

        if(true){
            //TODO: controllo coerenza content
        }

        //Controls ended. Let's insert
        squealDto.id = await this._model.getNextId();
        let modelOutput = await this._model.postSqueal(squealDto);

        if(modelOutput === false){
            output['code'] = 500;
            output['msg'] = 'Internal server error';
            return output;
        }

        output['content'] = squealDto.getDocument();
        return output;
    }

    /*
    penso che in questa funzione bisognera' implementare anche
    un controllo per vedere se uno squeal diventa popolare o meno
    si puo' fare una funzione esterna "becomePopular" (e becomeUnpopular)
    che modifica la quota dell'utente e inserisce il post nella sezione opportuna
     */
    async reactSquel(identifier, authenticatedUser, reaction){
        let output = this.getDefaultOutput();

        //check the user
        if(this.isObjectVoid(authenticatedUser)){
            output['code'] = 403;
            output['msg'] = 'Please Login, cugliun'
            return output;
        }

        let squealPromise = this.getSqueal(identifier);
        //check the squeal
        if(squealPromise['code'] !== 200){
            output['code'] = 404;
            output['msg'] = 'Squeal not found';
            return output;
        }

        //check the reaction type
        if(!this.checkReactionType(reaction)){
            output['code'] = 400;
            output['msg'] = 'Invalid type of reaction. Bad request'
            return output;
        }

    }

    checkSquealType(type){
        return  type === 'MESSAGE_TEXT' ||
                type === 'IMAGE_URL'    ||
                type === 'VIDEO_URL'    ||
                type === 'POSITION';
    }

    checkReactionType(type){
        return type === 'LIKE_A_LOT'    ||
            type === 'LIKE'             ||
            type === 'DO_NOT_LIKE'      ||
            type === 'DISGUSTED';
    }
}