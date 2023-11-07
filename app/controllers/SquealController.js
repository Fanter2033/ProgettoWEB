const Controller = require("./Controller");
const QuoteController = require("./QuoteController");
const QuoteModel = require("../models/QuoteModel");
const QuoteDto = require("../entities/dtos/QuoteDto");
const SquealDto = require("../entities/dtos/SquelDto");
const UserController = require("./UserController");
const UserModel = require("../models/UserModel");
const ChannelController = require("./ChannelController");
const ChannelModel = require("../models/ChannelModel");
const ChannelDto = require("../entities/dtos/ChannelDto");

module.exports = class SquealController extends Controller {


    #userController = new UserController(new UserModel());
    #channelController = new ChannelController(new ChannelModel());

    constructor(model) {
        super();
        this._model = model;
    }

    /**
     *
     * @param identifier {Number}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async getSqueal(identifier) {
        let output = this.getDefaultOutput();

        let squeal = await this._model.getSqueal(identifier);
        if (!(squeal instanceof SquealDto)) {
            output['code'] = 404;
            output['msg'] = 'Squeal not found.';
            return output;
        }

        //TODO VERIFICARE CHE IL POST ABBIA DESTINATARI CHE SONO CANALI ALTRIMENTI E' PRIVATO E DOBBIAMO VERIFICARE CHE IL RICHIEDENTE SIA AUTENTICATO E SIA UN DESTINATARIO, O IL MITTENTE

        output['content'] = squeal.getDocument();
        return output;
    }

    /**
     * @param squealDto {SquealDto}
     * @param authenticatedUser {UserDto}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async postSqueal(squealDto, authenticatedUser) {
        let output = this.getDefaultOutput();
        squealDto.sender = authenticatedUser.username;

        if (this.isObjectVoid(authenticatedUser)) {
            output['code'] = 403;
            output['msg'] = 'Please Login.'
            return output;
        }

        if (!this.checkSquealType(squealDto.message_type)) {
            output['code'] = 400;
            output['msg'] = 'Invalid type of Squeal. Bad request'
            return output;
        }

        if (true) {
            //TODO: controllare che i destinatari
        }


        let quoteCtrl = new QuoteController(new QuoteModel());
        let quoteRes = await quoteCtrl.getQuote(authenticatedUser.username)
        quoteRes = new QuoteDto(quoteRes.content);

        squealDto.content = squealDto.content.trim();
        squealDto.quote_cost = squealDto.content.length;

        //Let's check if the destinations exists all
        if (Array.isArray(squealDto.destinations) === false || squealDto.destinations.length === 0) {
            output['code'] = 400;
            output['msg'] = 'Invalid destinations';
            return output;
        }
        let checkResult = await this.checkDestinations(squealDto.destinations);

        if (!checkResult){
            output['code'] = 404;
            output['msg'] = 'At least one destination do not exists.';
            return output;
        }


        if (quoteRes.remaining_daily < squealDto.quote_cost) {
            output['code'] = 412;
            output['msg'] = 'Daily quote not available';
            return output;
        }

        if (quoteRes.remaining_weekly < squealDto.quote_cost) {
            output['code'] = 412;
            output['msg'] = 'Weekly quote not available';
            return output;
        }

        if (quoteRes.remaining_monthly < squealDto.quote_cost) {
            output['code'] = 412;
            output['msg'] = 'Monthly quote not available';
            return output;
        }

        let ctrlOut = await quoteCtrl.chargeLimitQuota(squealDto.sender, squealDto.quote_cost);
        if (ctrlOut.code !== 200) {
            output['code'] = 500;
            output['msg'] = 'Internal server error.';
            return output;
        }

        if (true) {
            //TODO: controllo coerenza content
        }

        //Controls ended. Let's insert
        squealDto.id = await this._model.getNextId();
        squealDto.date = this.getCurrentTimestampSeconds();
        squealDto.critical_mass = 0;
        squealDto.negative_value = 0;
        squealDto.positive_value = 0;
        squealDto.reactions = [];

        let modelOutput = await this._model.postSqueal(squealDto);

        if (modelOutput === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error';
            return output;
        }

        output['content'] = squealDto.getDocument();
        return output;
    }


    /**
     * @param {String[]} destinations
     * @return {Promise<boolean>}
     * Auxiliary function, given an array of destinations returns true if all exists, false otherwise.
     */
    async checkDestinations(destinations) {
        let promises = [];
        for (let dest of destinations) {
            dest = dest.trim();
            if (typeof dest !== "string" || dest.length < 2)
                return false;
            let promise;
            let classChannelChar = dest.charAt(0);
            let searchValue = dest.substring(1);
            switch (classChannelChar) {
                case '@':
                    promise = this.#userController.userExists(searchValue);
                    break;
                case '§':
                    if (searchValue === searchValue.toUpperCase()) {
                        let cd = new ChannelDto();
                        cd.channel_name = searchValue;
                        cd.type = autoload.config._CHANNEL_TYPE_OFFICIAL;
                        promise = this.#channelController.channelExists(cd);
                    } else if (searchValue === searchValue.toLowerCase()) {
                        let cd = new ChannelDto();
                        cd.channel_name = searchValue;
                        cd.type = autoload.config._CHANNEL_TYPE_USER;
                        promise = this.#channelController.channelExists(cd);
                    } else return false;
                    break;
                case '#':
                    searchValue = searchValue.toLowerCase();
                    let cd = new ChannelDto();
                    cd.channel_name = searchValue;
                    cd.type = autoload.config._CHANNEL_TYPE_HASHTAG;
                    promise = this.#channelController.channelExists(cd);
                    break;
            }
            promises.push(promise);
        }

        let results = await Promise.all(promises);
        for (const result of results)
            if (result !== true)
                return false;

        return true;
    }

    /*
    penso che in questa funzione bisognera' implementare anche
    un controllo per vedere se uno squeal diventa popolare o meno
    si puo' fare una funzione esterna "becomePopular" (e becomeUnpopular)
    che modifica la quota dell'utente e inserisce il post nella sezione opportuna
     */
    async reactSquel(identifier, authenticatedUser, reaction) {
        let output = this.getDefaultOutput();

        //check the user
        if (this.isObjectVoid(authenticatedUser)) {
            output['code'] = 403;
            output['msg'] = 'Please Login, cugliun'
            return output;
        }

        let squealPromise = this.getSqueal(identifier);
        //check the squeal
        if (squealPromise['code'] !== 200) {
            output['code'] = 404;
            output['msg'] = 'Squeal not found';
            return output;
        }

        //check the reaction type
        if (!this.checkReactionType(reaction)) {
            output['code'] = 400;
            output['msg'] = 'Invalid type of reaction. Bad request'
            return output;
        }

    }

    checkSquealType(type) {
        return type === 'MESSAGE_TEXT' ||
            type === 'IMAGE_URL' ||
            type === 'VIDEO_URL' ||
            type === 'POSITION';
    }

    checkReactionType(type) {
        return type === 'LIKE_A_LOT' ||
            type === 'LIKE' ||
            type === 'DO_NOT_LIKE' ||
            type === 'DISGUSTED';
    }
}