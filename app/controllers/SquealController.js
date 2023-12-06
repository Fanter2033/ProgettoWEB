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
const ChannelRoleDto = require("../entities/dtos/ChannelRoleDto");

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
        let squeal_id = squeal.id;
        let isPublic = await this.isSquealPublic(identifier);
        let isDest;
        if (this.isAuthenticatedUser(authenticatedUser) === true)
            isDest = await this.#squealToUserModel.isUserDest(squeal_id, authenticatedUser.username);
        else
            isDest = false;

        if (isPublic === false && escapeAddImpression === false) {
            if (this.isAuthenticatedUser(authenticatedUser) === false) {
                output['code'] = 403;
                output['msg'] = 'Login to see this content.';
                return output;
            }

            if (isDest === false && authenticatedUser.username.trim() !== squeal.sender.trim() && authenticatedUser.isAdmin === false) {
                output['code'] = 401;
                output['msg'] = 'Not authorized to see this content.';
                return output;
            }
        }

        if(squeal.message_type === 'POSITION') {
            try {
                squeal.content = JSON.parse(squeal.content);
            } catch (ignored) {
                squeal.content = [0,0];
            }

        }

        if (escapeAddImpression) {
            output['content'] = squeal.getDocument();
            return output;
        }

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

        let channelDtos = await this.#squealToChannelModel.getDestinationsChannels(identifier);

        for (const channelDto of channelDtos) {
            squeal.insertDestination(channelDto);
        }

        if (isDest === true) {
            output['content'] = squeal.getDocument(true);
            return output;
        }

        if (isPublic === true && isDest === false) {
            let theresIsPublicChannel = await this.#channelController.thereIsPublicChannel(channelDtos);
            if (theresIsPublicChannel === false) {
                if (this.isAuthenticatedUser(authenticatedUser) === false) {
                    output['code'] = 401;
                    output['msg'] = 'Not authorized to see this content. (3)';
                    return output;
                }
                let found = false;
                for (const channelDto of channelDtos) {
                    let result = await this.#channelController.getChannelUserRole(channelDto, authenticatedUser.username);
                    if (this.isObjectVoid(result.content) === true) continue;
                    let role = new ChannelRoleDto(result.content)
                    if (role.role >= autoload.config._CHANNEL_ROLE_READ) {
                        found = true;
                        break;
                    }
                }
                if (found === false) {
                    output['code'] = 401;
                    output['msg'] = 'Not authorized to see this content. (2)';
                    return output;
                }
            }
        }

        //If the squeal is public we should recalculate the critical mass for every impression
        result = await this.updateCriticalMass(squeal);
        if (result === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error (1).';
            return output;
        }


        output['content'] = squeal.getDocument(true);
        return output;
    }

    /**
     * @param {SquealDto} squeal
     * @return {Promise<boolean>}
     */
    async updateCriticalMass(squeal) {
        let total_impression = await this.#squealImpressionReactions.countImpression(squeal.id);
        let cm = Math.floor(total_impression / (100 / autoload.config._CRITICAL_MASS_PERCENTAGE));
        return await this._model.updateCriticalMass(squeal.id, cm);
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
     * @param fromAdmin {boolean}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async postSqueal(squealDto, authenticatedUser, autoSqueal, fromAdmin = false) {
        let output = this.getDefaultOutput();
        squealDto.sender = authenticatedUser.username;

        if (this.isObjectVoid(authenticatedUser)) {
            output['code'] = 403;
            output['msg'] = 'Please Login.'
            return output;
        }

        if(fromAdmin && authenticatedUser.isAdmin === false){
            output['code'] = 401;
            output['msg'] = 'nah.'
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

        if (squealDto.content === null || squealDto.content === 'null') {
            output['code'] = 400;
            output['msg'] = 'Missing content';
            return output;
        }

        if (squealDto.message_type === 'MESSAGE_TEXT' ||
            squealDto.message_type === 'TEXT_AUTO') {
            squealDto.content = squealDto.content.trim();
            squealDto.quote_cost = squealDto.content.length;
        } else if (squealDto.message_type === 'IMAGE' ||
            squealDto.message_type === 'VIDEO_URL' ||
            squealDto.message_type === 'POSITION' ||
            squealDto.message_type === 'POSITION_AUTO') {
            squealDto.quote_cost = 125;
        } else {
            output['code'] = 500;
            output['msg'] = 'Internal server error.';
            return output;
        }

        //Let's check if the destinations exists all
        if (Array.isArray(squealDto.destinations) === false || squealDto.destinations.length === 0) {
            output['code'] = 400;
            output['msg'] = 'Invalid destinations';
            return output;
        }


        if (squealDto.message_type === 'IMAGE') {
            let base64 = squealDto.content;
            let split = base64.split(',');
            let str = '';
            for (let i = 0; i < split.length; i++) {
                if (i === 0)
                    continue;
                if (str !== '')
                    str = str + ',';
                str = str + split[i];
            }
            squealDto.content = str;
            if (this.isBase64(squealDto.content) === false) {
                output['code'] = 400;
                output['msg'] = 'Content is not base64';
                return output;
            }
        }

        if (squealDto.message_type === 'VIDEO_URL' && this.isYoutubeVideo(squealDto.content) === false) {
            output['code'] = 400;
            output['msg'] = 'Link is not YT url';
            return output;
        }

        let checkResult = await this.checkDestinations(squealDto.destinations);

        await this.createHashtagChannels(squealDto.destinations);

        if (!checkResult) {
            output['code'] = 404;
            output['msg'] = 'At least one destination do not exists.';
            return output;
        }

        if (authenticatedUser.isAdmin === false) {
            checkResult = await this.checkDestinationsAuthorizations(squealDto.destinations, authenticatedUser.username);
            if (!checkResult) {
                output['code'] = 401;
                output['msg'] = 'Do not have all authorization to write on all channels.';
                return output;
            }
        }

        if(fromAdmin === false) {
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
        }

        if (squealDto.message_type === 'TEXT_AUTO') {
            //Execute controls over scheduled things
            if (isNaN(autoSqueal.next_scheduled_operation) || autoSqueal.next_scheduled_operation < 1) {
                output['code'] = 400;
                output['msg'] = 'Invalid next scheduled operation';
                return output;
            }

            if (isNaN(autoSqueal.iteration_end) || autoSqueal.iteration_end < 1) {
                output['code'] = 400;
                output['msg'] = 'Invalid number of iterations';
                return output;
            }
        }

        //CONTROLLI OK DEVO SCALARE LA QUOTA ED EFFETTUARE LE RELAZIONI
        if(fromAdmin === false) {
            let ctrlOut = await quoteCtrl.chargeDebitQuota(squealDto.sender, squealDto.quote_cost);
            if (ctrlOut.code !== 200) {
                output['code'] = 500;
                output['msg'] = 'Internal server error.';
                return output;
            }
        }

        //Controls ended. Let's insert
        squealDto.id = await this._model.getNextId();
        squealDto.date = this.getCurrentTimestampSeconds();
        squealDto.critical_mass = 0;
        squealDto.negative_value = 0;
        squealDto.positive_value = 0;

        if (squealDto.message_type === 'POSITION') {
            let tmp = squealDto.content.join(',');
            tmp = `[${tmp}]`;
            squealDto.content = tmp;
            //TODO MAKE FOR UPDATE AUTO_SQUEAL
        }

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


        if (squealDto.message_type === 'TEXT_AUTO') {
            //create the scheduled operation
            let tmpModel = new SquealTextAutoModel();
            autoSqueal.id = squealDto.id;
            autoSqueal.quota_update_cost = this.countPlaceHolders(squealDto.content);
            autoSqueal.original_content = squealDto.content;
            let result = await tmpModel.createScheduledOperation(autoSqueal, this.getCurrentTimestampSeconds() + 3);
            if (result === false) {
                output['code'] = 500;
                output['msg'] = 'Internal server error (5)';
                return output;
            }
            autoSqueal.iteration = 0;
            let newContent = this.resolveContent(autoSqueal);
            await this._model.updateSquealContent(autoSqueal.id, newContent);
        }


        output['content'] = squealDto.getDocument();
        return output;
    }

    /**
     * @param destinations {String[]}
     * @return {Promise<void>}
     */
    async createHashtagChannels(destinations) {
        let promises = [];
        let channels = [];
        for (let dest of destinations) {
            dest = dest.trim();
            if (typeof dest !== "string" || dest.length < 2)
                return;
            let promise;
            let classChannelChar = dest.charAt(0);
            let searchValue = dest.substring(1);
            switch (classChannelChar) {
                case '#':
                    searchValue = searchValue.toLowerCase();
                    let cd = new ChannelDto();
                    cd.channel_name = searchValue;
                    cd.type = autoload.config._CHANNEL_TYPE_HASHTAG;
                    promise = this.#channelController.getChannel(cd, true);
                    promises.push(promise);
                    channels.push(cd);
                    break;
            }
        }
        let results = await Promise.all(promises);
        promises = [];
        for (let i = 0; i < results.length; i++) {
            promises.push(this.#channelController.createChannelHashtag(channels[i]));
        }
        await Promise.all(promises);
    }

    /**
     * @param text {string}
     * @return {number}
     */
    countPlaceHolders(text) {
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
    async updateAutoMessages() {
        let timestamp = this.getCurrentTimestampSeconds();
        let tmpModel = new SquealTextAutoModel();
        let promises = [];

        let result = await tmpModel.getCurrentExecutionList(timestamp);
        for (const squealTextAutoDto of result) {
            if (squealTextAutoDto.iteration === squealTextAutoDto.iteration_end)
                continue;

            let quoteCtrl = new QuoteController(new QuoteModel());
            let squeal = await this._model.getSqueal(squealTextAutoDto.id);
            let quoteChargeResult = await quoteCtrl.chargeDebitQuota(squeal.sender, squealTextAutoDto.quota_update_cost);
            if (quoteChargeResult.code !== 200)
                continue;

            squealTextAutoDto.iteration = squealTextAutoDto.iteration + 1;
            squealTextAutoDto.next_scheduled_operation = timestamp + squealTextAutoDto.delay_seconds;
            let newContent = this.resolveContent(squealTextAutoDto);
            promises.push(tmpModel.updateSchedule(squealTextAutoDto.id, squealTextAutoDto));
            promises.push(this._model.updateSquealContent(squealTextAutoDto.id, newContent));

        }
        await Promise.all(promises);
    }

    /**
     * @param dto {SquealTextAutoDto}
     * @return {string}
     */
    resolveContent(dto) {
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
     * THIS DO NOT EXECUTE CONTROLS. SHOULD BE CALLED VIA ANOTHER CONTROLLER OR WITH A VARIABLE
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
        if (result === false)
            return output;

        result = await this.handleReactions(squeal.sender);
        if (result === false) {
            output['code'] = 500;
            output['msg'] = 'Internal server error in SquealController::incrementPositiveValue - 2';
            return output;
        }

        return output;
    }

    /**
     * @param username {string}
     * @return {Promise<boolean>}
     */
    async handleReactions(username) {
        let quoteCtrl = new QuoteController(new QuoteModel());
        let userCtrl = new UserController(new UserModel());
        let userOut = await userCtrl.getUser(username);
        if (userOut.code !== 200) {
            return false;
        }
        let user = new UserDto(userOut.content);

        let countPopular = await this._model.countPopularSquealUser(user.username);
        let countUnpopular = await this._model.countUnpopularSquealUser(user.username);
        let countControversial = await this._model.countControversial(user.username);
        let realPopular = countPopular - countControversial;
        let realUnpopular = countUnpopular - countControversial;

        if (user.verbalized_popularity < realPopular &&
            realPopular % autoload.config._POPULAR_QUOTE_POSTS === 0) {
            await quoteCtrl.applyPercentageQuote({}, user.username, 101, true);
            let r = await userCtrl.updateVerbalizedPopularity(username, realPopular, -1);
            if (r === false) return false;
        }

        if (user.verbalized_unpopularity < realUnpopular &&
            realUnpopular % autoload.config._UNPOPULAR_QUOTE_POSTS === 0) {
            await quoteCtrl.applyPercentageQuote({}, user.username, 99, true);
            let r = await userCtrl.updateVerbalizedPopularity(username, -1, realUnpopular);
            if (r === false) return false;
        }


        return true;
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

    /**
     * @param {String[]} destinations
     * @param {String} username
     * @return {Promise<boolean>}
     * Auxiliary function, given an array of destinations returns true if we have all authorizzation, false otherwise.
     */
    async checkDestinationsAuthorizations(destinations, username) {
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
                    continue;
                case '#':
                    continue;
                case '§':
                    if (searchValue === searchValue.toUpperCase()) {
                        let cd = new ChannelDto();
                        cd.channel_name = searchValue;
                        cd.type = autoload.config._CHANNEL_TYPE_OFFICIAL;
                        promise = this.#channelController.getChannelUserRole(cd, username);
                        promises.push(promise);
                    } else if (searchValue === searchValue.toLowerCase()) {
                        let cd = new ChannelDto();
                        cd.channel_name = searchValue;
                        cd.type = autoload.config._CHANNEL_TYPE_USER;
                        promise = this.#channelController.getChannelUserRole(cd, username);
                        promises.push(promise);
                    } else return false;
                    break;
            }
        }

        let results = await Promise.all(promises);
        for (const result of results) {
            if (result.code !== 200) {
                return false;
            }
            let tmpRole = new ChannelRoleDto(result.content);
            if (tmpRole.role < autoload.config._CHANNEL_ROLE_WRITE) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param user {string}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async getSentSquealsByUser(user) {
        let output = this.getDefaultOutput();

        //No controls to do here
        let squeals = await this._model.getSquealsFromSender(user);
        output.content = [];
        for (const squeal of squeals)
            if (await this.isSquealPublic(squeal.id))
                output.content.push(squeal.getDocument());
        return output;
    }

    /**
     * si esatto questa funzione è esattamente la copia dell'altra solo che viene autenticato l'SMM,
     * ci interessa? no.
     * @param squealDto {SquealDto}
     * @param authenticatedSmm {UserDto}
     * @param autoSqueal
     * @param vipUsername {string}
     * @returns {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async postSquealFromSmm(squealDto, authenticatedSmm, autoSqueal, vipUsername) {
        let output = this.getDefaultOutput();
        squealDto.sender = vipUsername;

        if (false && this.isObjectVoid(authenticatedSmm)) {
            output['code'] = 403;
            output['msg'] = 'Please Login.'
            return output;
        }

        //TODO: controllo che quel vip sia effettivamente linkato al SMM

        if (!this.checkSquealType(squealDto.message_type)) {
            output['code'] = 400;
            output['msg'] = 'Invalid type of Squeal. Bad request'
            return output;
        }

        let quoteCtrl = new QuoteController(new QuoteModel());
        let quoteRes = await quoteCtrl.getQuote(vipUsername);
        quoteRes = new QuoteDto(quoteRes.content);

        squealDto.content = squealDto.content.trim();
        squealDto.quote_cost = squealDto.content.length;

        //Let's check if the destinations exists all
        if (Array.isArray(squealDto.destinations) === false || squealDto.destinations.length === 0) {
            output['code'] = 400;
            output['msg'] = 'Invalid destinations';
            return output;
        }

        if (squealDto.message_type === 'IMAGE' ||
            squealDto.message_type === 'VIDEO_URL' ||
            squealDto.message_type === 'POSITION' ||
            squealDto.message_type === 'POSITION_AUTO') {
            squealDto.quote_cost = 125;
        }

        if (squealDto.message_type === 'IMAGE' && this.isBase64(squealDto.content) === false) {
            output['code'] = 400;
            output['msg'] = 'Content is not base64';
            return output;
        }

        if (squealDto.message_type === 'VIDEO_URL' && this.isYoutubeVideo(squealDto.content) === false) {
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

        if (squealDto.message_type === 'TEXT_AUTO') {
            //Execute controls over scheduled things
            if (isNaN(autoSqueal.next_scheduled_operation) || autoSqueal.next_scheduled_operation < 1) {
                output['code'] = 400;
                output['msg'] = 'Invalid next scheduled operation';
                return output;
            }

            if (isNaN(autoSqueal.iteration_end) || autoSqueal.iteration_end < 1) {
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


        if (squealDto.message_type === 'TEXT_AUTO') {
            //create the scheduled operation
            let tmpModel = new SquealTextAutoModel();
            autoSqueal.id = squealDto.id;
            autoSqueal.quota_update_cost = this.countPlaceHolders(squealDto.content);
            autoSqueal.original_content = squealDto.content;
            //TODO MOSTRARE DIRETTAMENTE UNO SQUEAL AGGIORNATO
            let result = await tmpModel.createScheduledOperation(autoSqueal, this.getCurrentTimestampSeconds() + 3);
            if (result === false) {
                output['code'] = 500;
                output['msg'] = 'Internal server error (5)';
                return output;
            }
        }


        output['content'] = squealDto.getDocument();
        return output;
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