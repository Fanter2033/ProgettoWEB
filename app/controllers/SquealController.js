const Controller = require("./Controller");
const QuoteController = require("./QuoteController");
const QuoteModel = require("../models/QuoteModel");
const QuoteDto = require("../entities/dtos/QuoteDto");
const SquealDto = require("../entities/dtos/SquealDto");
const UserController = require("./UserController");
const UserModel = require("../models/UserModel");
const ChannelController = require("./ChannelController");
const ChannelModel = require("../models/ChannelModel");
const ChannelDto = require("../entities/dtos/ChannelDto");
const SquealToUserModel = require("../models/SquealToUserModel");
const SquealToChannelModel = require("../models/SquealToChannelModel");
const SquealIrModel = require("../models/SquealIrModel");
const Squeal2UserDto = require("../entities/dtos/Squeal2UserDto");
const Squeal2ChannelDto = require("../entities/dtos/Squeal2ChannelDto");
const SquealIrDto = require("../entities/dtos/SquealIrDto");
const UserDto = require("../entities/dtos/UserDto");
const SquealTextAutoModel = require('../models/SquealTextAutoModel');

module.exports = class SquealController extends Controller {


    #userController = new UserController(new UserModel());
    #channelController = new ChannelController(new ChannelModel());
    #squealToUserModel = new SquealToUserModel();
    #squealToChannelModel = new SquealToChannelModel();
    #squealImpressionReactions = new SquealIrModel();

    constructor(model) {
        super();
        this._model = model;
    }

    /**
     *
     * @param identifier {Number}
     * @param authenticatedUser {UserDto}
     * @param session_id {string}
     * @param escapeAddImpression {boolean}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async getSqueal(identifier, authenticatedUser, session_id, escapeAddImpression = false) {
        let output = this.getDefaultOutput();

        let squeal = await this._model.getSqueal(identifier);
        if (!(squeal instanceof SquealDto)) {
            output['code'] = 404;
            output['msg'] = 'Squeal not found.';
            return output;
        }

        let isPublic = await this.isSquealPublic(identifier);
        if (isPublic === false && escapeAddImpression === false) {
            if (this.isAuthenticatedUser(authenticatedUser) === false) {
                output['code'] = 403;
                output['msg'] = 'Login to see this content.';
                return output;
            }

            let isDest = await this.#squealToUserModel.isUserDest(squeal_id, user.username);
            if (isDest === false && authenticatedUser.username.trim() !== squeal.sender.trim() && authenticatedUser.isAdmin === false) {
                output['code'] = 401;
                output['msg'] = 'Not authorized to see this content.';
                return output;
            }
        }

        if (escapeAddImpression) {
            output['content'] = squeal.getDocument();
            return output;
        }

        //We should calculate if the squeal is popular and unpopular, because if the CM > Good reactions is still popular.
        //Same thing for unpopular case
        let isPopular = (squeal.critical_mass <= squeal.positive_value);
        let isUnpopular = (squeal.critical_mass <= squeal.negative_value);
        let isControversial = (isPopular && isUnpopular);

        let irDto = new SquealIrDto();
        irDto.squeal_id = identifier;
        if (this.isAuthenticatedUser(authenticatedUser) === false) {
            irDto.is_session_id = true;
            irDto.value = session_id;
        } else {
            irDto.is_session_id = false;
            irDto.value = authenticatedUser.username;
        }

        let result = await this.#squealImpressionReactions.assocExists(irDto);
        if (result === false) {
            result = await this.#squealImpressionReactions.createAssocSquealUser(irDto);
            if (result === false) {
                output['code'] = 500;
                output['msg'] = 'Internal server error (1).';
                return output;
            }
        }

        if (isPublic === false) {
            output['content'] = squeal.getDocument();
            return output;
        }

        //If the squeal is public we should recalculate the critical mass for every impression
        let total_impression = await this.#squealImpressionReactions.countImpression(squeal.id);
        let cm = Math.floor(total_impression / (100 / autoload.config._CRITICAL_MASS_PERCENTAGE));

        if (squeal.critical_mass !== cm) {
            //Critical mass increased
            result = await this._model.updateCriticalMass(squeal.id, cm);
            if (result === false) {
                output['code'] = 500;
                output['msg'] = 'Internal server error (2).';
                return output;
            }

            let quoteCtrl = new QuoteController(new QuoteModel());
            //Is the squeal still popular?
            if (isPopular && cm > squeal.positive_value && isControversial === false) {
                //now is not popular cause cm increased
                result = await quoteCtrl.applyPercentageQuote(authenticatedUser, squeal.sender, 100 - autoload.config._POPULAR_QUOTE_LOSS_CM_INCREASE, true);
                if (result.code !== 200) {
                    output['code'] = 500;
                    output['msg'] = 'Internal server error (3).';
                    return output;
                }
            } else if (isPopular && cm > squeal.positive_value && isControversial === true && cm <= squeal.negative_value) {
                //Was popular, was controversial and now is only unpopular
                result = await quoteCtrl.applyPercentageQuote(authenticatedUser, squeal.sender, 100 - autoload.config._UNPOPULAR_QUOTE_LOSS_PERCENTAGE, true);
                if (result.code !== 200) {
                    output['code'] = 500;
                    output['msg'] = 'Internal server error (3).';
                    return output;
                }
            }
            //Is squeal still unpopular?
            if (isUnpopular && cm > squeal.negative_value && isControversial === false) {
                result = await quoteCtrl.applyPercentageQuote(authenticatedUser, squeal.sender, 100 + autoload.config._UNPOPULAR_QUOTE_GAIN_CM_INCREASE, true);
                if (result.code !== 200) {
                    output['code'] = 500;
                    output['msg'] = 'Internal server error (4).';
                    return output;
                }
            } else if (isUnpopular && cm > squeal.negative_value && isControversial === true && cm <= squeal.positive_value) {
                //Was unpopular, was controversial, now is only popular
                result = await quoteCtrl.applyPercentageQuote(authenticatedUser, squeal.sender, 100 + autoload.config._POPULAR_QUOTE_GAIN_PERCENTAGE, true);
                if (result.code !== 200) {
                    output['code'] = 500;
                    output['msg'] = 'Internal server error (3).';
                    return output;
                }
            }
        }

        output['content'] = squeal.getDocument();
        return output;
    }

    /**
     *
     * @param {number} squeal_id
     * @return {Promise<boolean>}
     */
    async isSquealPublic(squeal_id) {
        let channelLinked = await this.#squealToChannelModel.countChannelLinked(squeal_id);
        return channelLinked > 0;

    }

    /**
     * @param squealDto {SquealDto}
     * @param authenticatedUser {UserDto}
     * @param autoSqueal {SquealTextAutoDto}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async postSqueal(squealDto, authenticatedUser, autoSqueal) {
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

        if(squealDto.message_type === 'IMAGE' ||
            squealDto.message_type === 'VIDEO_URL' ||
            squealDto.message_type === 'POSITION' ||
            squealDto.message_type === 'POSITION_AUTO'){
            squealDto.quote_cost = 125;
        }


        if(squealDto.message_type === 'IMAGE' && this.isBase64(squealDto.content) === false){
            output['code'] = 400;
            output['msg'] = 'Content is not base64';
            return output;
        }

        if(squealDto.message_type === 'VIDEO_URL' && this.isYoutubeVideo(squealDto.content) === false){
            output['code'] = 400;
            output['msg'] = 'Link is not YT url';
            return output;
        }

        //TODO FARE CONTROLLI SU POSIZIONE ETC ETC

        let checkResult = await this.checkDestinations(squealDto.destinations);

        if (!checkResult) {
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

        if(squealDto.message_type === 'TEXT_AUTO'){
            //Execute controls over scheduled things
            if(isNaN(autoSqueal.next_scheduled_operation) || autoSqueal.next_scheduled_operation < 1){
                output['code'] = 400;
                output['msg'] = 'Invalid next scheduled operation';
                return output;
            }

            if(isNaN(autoSqueal.iteration_end) || autoSqueal.iteration_end < 1){
                output['code'] = 400;
                output['msg'] = 'Invalid number of iterations';
                return output;
            }
        }

        //CONTROLLI OK DEVO SCALARE LA QUOTA ED EFFETTUARE LE RELAZIONI
        let ctrlOut = await quoteCtrl.chargeLimitQuota(squealDto.sender, squealDto.quote_cost);
        if (ctrlOut.code !== 200) {
            output['code'] = 500;
            output['msg'] = 'Internal server error.';
            return output;
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

        //Adesso che ho gli id posso inserire l'associazione della quota per ogni utente.
        for (const dest of squealDto.destinations)
            if (this.isDestUserFormat(dest)) {
                let dto = new Squeal2UserDto();
                let searchValue = dest.substring(1);
                dto.squeal_id = squealDto.id;
                dto.destination_username = searchValue;
                let result = await this.#squealToUserModel.createAssocSquealUser(dto);
                if (result === false) {
                    output['code'] = 500;
                    output['msg'] = 'Internal server error (2)';
                    return output;
                }
            } else if (this.isDestChannelFormat(dest)) {
                let dto = new Squeal2ChannelDto();
                let searchValue = dest.substring(1);
                dto.squeal_id = squealDto.id;
                dto.channel_name = searchValue;
                if (dest.charAt(0) === '#')
                    dto.channel_type = autoload.config._CHANNEL_TYPE_HASHTAG;
                else if (dest.charAt(0) === '§' && searchValue === searchValue.toUpperCase())
                    dto.channel_type = autoload.config._CHANNEL_TYPE_OFFICIAL;
                else
                    dto.channel_type = autoload.config._CHANNEL_TYPE_USER;
                let result = await this.#squealToChannelModel.createAssocSquealChannel(dto);
                if (result === false) {
                    output['code'] = 500;
                    output['msg'] = 'Internal server error (4)';
                    return output;
                }
            } else {
                output['code'] = 500;
                output['msg'] = 'Internal server error (3)';
                return output;
            }


        if(squealDto.message_type === 'TEXT_AUTO'){
            //create the scheduled operation
            let tmpModel = new SquealTextAutoModel();
            autoSqueal.id = squealDto.id;
            autoSqueal.quota_update_cost = this.countPlaceHolders(squealDto.content);
            autoSqueal.original_content = squealDto.content;
            //TODO MOSTRARE DIRETTAMENTE UNO SQUEAL AGGIORNATO
            let result = await tmpModel.createScheduledOperation(autoSqueal, this.getCurrentTimestampSeconds() + 3);
            if(result === false){
                output['code'] = 500;
                output['msg'] = 'Internal server error (5)';
                return output;
            }
        }


        output['content'] = squealDto.getDocument();
        return output;
    }

    /**
     * @param text {string}
     * @return {number}
     */
    countPlaceHolders(text){
        let out = 1;
        if (text.includes('{DATA}')) out++;
        if (text.includes('{ORA}')) out++;
        if (text.includes('{MINUTO}')) out++;
        if (text.includes('{SECONDO}')) out++;
        if (text.includes('{NUMERO}')) out++;
        return out;
    }

    /**
     * @return {Promise<void>}
     */
    async updateAutoMessages(){
        let timestamp = this.getCurrentTimestampSeconds();
        let tmpModel = new SquealTextAutoModel();
        let promises = [];

        let result = await tmpModel.getCurrentExecutionList(timestamp);
        for (const squealTextAutoDto of result) {
            squealTextAutoDto.iteration = squealTextAutoDto.iteration + 1;
            squealTextAutoDto.next_scheduled_operation = timestamp + squealTextAutoDto.delay_seconds;
            let newContent = this.resolveContent(squealTextAutoDto);
            promises.push(tmpModel.updateSchedule(squealTextAutoDto.id, squealTextAutoDto));
            promises.push(this._model.updateSquealContent(squealTextAutoDto.id, newContent));
            //TODO ADDEBITARE LA QUOTA ALL'AGGIORNAMENTO
        }
        await Promise.all(promises);
    }

    /**
     * @param dto {SquealTextAutoDto}
     * @return {string}
     */
    resolveContent(dto){
        let date = this.getCurrentDate();
        let hour = this.getCurrentHour();
        let minute = this.getCurrentMinute();
        let second = this.getCurrentSecond();
        let number = dto.iteration;
        let content = dto.original_content;
        content = content.replace('{DATA}', date);
        content = content.replace('{ORA}', hour);
        content = content.replace('{MINUTO}', minute);
        content = content.replace('{SECONDO}', second);
        content = content.replace('{NUMERO}', number);
        return content;
    }

    /**
     * @return {string}
     */
    getCurrentDate(){
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        return yyyy + '/' + mm + '/' + dd;
    }

    /**
     * @return {string|number}
     */
    getCurrentHour(){
        const today = new Date();
        let hr = today.getHours();
        if(hr < 10)
            hr = '0' + hr;
        return hr;
    }

    /**
     * @return {string|number}
     */
    getCurrentMinute() {
        const today = new Date();
        let min = today.getMinutes();
        if(min < 10)
            min = '0' + min;
        return min;
    }

    /**
     * @return {string|number}
     */
    getCurrentSecond() {
        const today = new Date();
        let sec = today.getSeconds();
        if(sec < 10)
            sec = '0' + sec;
        return sec;
    }

    /**
     * @param {string} string
     * @return {boolean}
     */
    isBase64(string){
        if(string.trim().length === 0) return false;
        return Buffer.from(string, 'base64').toString('base64') === string;
    }

    /**
     * @param {string} string
     * @return {boolean}
     */
    isYoutubeVideo(string){
        return string.startsWith("https://www.youtube.com/watch");
    }

    /**
     * @param squeal_id {number}
     * @param sessionId {string}
     * @param authenticatedUser {UserDto}
     * @param reaction {string}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async addSquealerReaction(squeal_id, sessionId, authenticatedUser, reaction) {
        let output = this.getDefaultOutput();
        let getCtrlOut = await this.getSqueal(squeal_id, authenticatedUser, sessionId);

        if (getCtrlOut.code !== 200) {
            return getCtrlOut;
        }

        if (this.checkReactionType(reaction) === false) {
            output['code'] = 400;
            output['msg'] = 'Invalid reaction';
            return output;
        }

        let irDto = new SquealIrDto();
        irDto.squeal_id = squeal_id;
        if (this.isAuthenticatedUser(authenticatedUser) === false) {
            irDto.is_session_id = true;
            irDto.value = sessionId;
        } else {
            irDto.is_session_id = false;
            irDto.value = authenticatedUser.username;
        }
        irDto.reactions = reaction;

        let currentReaction = await this.#squealImpressionReactions.getCurrentAssoc(irDto);
        if (currentReaction instanceof SquealIrDto) {
            if (currentReaction.reactions === autoload.config._REACTION_LIKE || currentReaction.reactions === autoload.config._REACTION_LIKE_A_LOT) {
                //Decrement positive value
                let res = await this.incrementValue(squeal_id, -1);
                if (res.code !== 200) {
                    output['code'] = 500;
                    output['msg'] = 'Internal server error';
                    return output;
                }
            } else if (currentReaction.reactions === autoload.config._REACTION_DO_NOT_LIKE || currentReaction.reactions === autoload.config._REACTION_DISGUSTED) {
                //Decrement negative value
                let res = await this.incrementValue(squeal_id, -1, false);
                if (res.code !== 200) {
                    output['code'] = 500;
                    output['msg'] = 'Internal server error';
                    return output;
                }
            }
        }

        let modelResult = await this.#squealImpressionReactions.insertReactionIntoAssoc(irDto);
        if (modelResult === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error';
            return output;
        }

        let finalOut;
        if (reaction === autoload.config._REACTION_LIKE || reaction === autoload.config._REACTION_LIKE_A_LOT) {
            finalOut = await this.incrementValue(squeal_id, 1);
        } else {
            finalOut = await this.incrementValue(squeal_id, 1, false);
        }

        if (finalOut['code'] !== 200) {
            output['code'] = 500;
            output['msg'] = 'Internal server error (2)';
            return output;
        }


        return output;
    }

    /**
     * @param squeal_id {number}
     * @param amount {number}
     * @param positiveValue {boolean}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     * THIS DO NOT EXECUTE CONTROLS. SHOULD BE IMPLEMENTED VIA ANTOHER CONTROLLER OR WITH A VARIABLE
     */
    async incrementValue(squeal_id, amount, positiveValue = true) {
        let output = this.getDefaultOutput();

        let squeal = await this.getSqueal(squeal_id, new UserDto(), "", true);
        if (squeal.code !== 200) {
            output['code'] = 404;
            output['msg'] = 'Not found';
            return output;
        }
        squeal = new SquealDto(squeal.content);

        let isPopular = (squeal.critical_mass <= squeal.positive_value && squeal.critical_mass !== 0);
        let isUnpopular = (squeal.critical_mass <= squeal.negative_value && squeal.critical_mass !== 0);
        let isControversial = (isPopular && isUnpopular);

        if (positiveValue)
            squeal.positive_value = squeal.positive_value + amount;
        else
            squeal.negative_value = squeal.negative_value + amount;

        let result = await this._model.replaceSqueal(squeal, squeal_id);
        if (result === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error in SquealController::incrementPositiveValue';
            return output;
        }

        result = await this.isSquealPublic(squeal_id);
        if (result === false) return output;

        let isNowPopular = (squeal.critical_mass <= squeal.positive_value && squeal.critical_mass !== 0);
        let isNowUnpopular = (squeal.critical_mass <= squeal.negative_value && squeal.critical_mass !== 0);
        let isNowControversial = (isNowPopular && isNowUnpopular);

        //noting changed.
        if (isControversial && isNowControversial)
            return output;

        let quoteCtrl = new QuoteController(new QuoteModel());

        //Now is not controversial, restore the quota change
        if (isControversial && isNowControversial === false) {
            if (isNowPopular) {
                result = await quoteCtrl.applyPercentageQuote({}, squeal.sender, 100 + autoload.config._POPULAR_QUOTE_GAIN_PERCENTAGE, true);
                if (result.code !== 200) {
                    output['code'] = 500;
                    output['msg'] = 'Internal server error in SquealController::incrementPositiveValue - 3';
                }
                return output;
            } else if (isNowUnpopular) {
                result = await quoteCtrl.applyPercentageQuote({}, squeal.sender, 100 - autoload.config._UNPOPULAR_QUOTE_LOSS_PERCENTAGE, true);
                if (result.code !== 200) {
                    output['code'] = 500;
                    output['msg'] = 'Internal server error in SquealController::incrementPositiveValue - 4';
                }
                return output;
            }
            //Else case does not exists in case the squeal is not popular and not unpopular
        }

        if (isControversial === false && isNowControversial === true) {
            if (isPopular) {
                result = await quoteCtrl.applyPercentageQuote({}, squeal.sender, 100 - autoload.config._POPULAR_QUOTE_LOSS_CM_INCREASE, true);
                if (result.code !== 200) {
                    output['code'] = 500;
                    output['msg'] = 'Internal server error in SquealController::incrementPositiveValue - 5';
                    return output;
                }
                return output;
            } else {
                //isUnpopular = true
                result = await quoteCtrl.applyPercentageQuote({}, squeal.sender, 100 + autoload.config._UNPOPULAR_QUOTE_GAIN_CM_INCREASE, true);
                if (result.code !== 200) {
                    output['code'] = 500;
                    output['msg'] = 'Internal server error in SquealController::incrementPositiveValue - 6';
                    return output;
                }
                return output;
            }
        }

        if (isPopular === false && isNowPopular === true) {
            result = await quoteCtrl.applyPercentageQuote({}, squeal.sender, 100 + autoload.config._POPULAR_QUOTE_GAIN_PERCENTAGE, true);
        } else if (isUnpopular === false && isNowUnpopular === true) {
            result = await quoteCtrl.applyPercentageQuote({}, squeal.sender, 100 - autoload.config._UNPOPULAR_QUOTE_LOSS_PERCENTAGE, true);
        }

        if(result === true)
            return output;

        if ((
                isPopular === false && isNowPopular === true ||
                isUnpopular === false && isNowUnpopular === true
            ) &&
            result.code !== 200) {
            output['code'] = 500;
            output['msg'] = 'Internal server error in SquealController::incrementPositiveValue - 2';
            return output;
        }

        return output;
    }

    /**
     * @param {string} dest
     * @return {boolean}
     */
    isDestUserFormat(dest) {
        let classChannelChar = dest.charAt(0);
        return classChannelChar === '@';

    }

    /**
     * @param {string} dest
     * @return {boolean}
     */
    isDestChannelFormat(dest) {
        let classChannelChar = dest.charAt(0);
        return classChannelChar === '§' || classChannelChar === '#';

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

    checkSquealType(type) {
        return type === 'MESSAGE_TEXT' ||
            type === 'IMAGE' ||
            type === 'VIDEO_URL' ||
            type === 'POSITION' ||
            type === 'TEXT_AUTO' ||
            type === 'POSITION_AUTO';
    }

    checkReactionType(type) {
        return type === autoload.config._REACTION_LIKE_A_LOT ||
            type === autoload.config._REACTION_LIKE ||
            type === autoload.config._REACTION_DO_NOT_LIKE ||
            type === autoload.config._REACTION_DISGUSTED;
    }
}