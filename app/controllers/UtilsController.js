const Controller = require("./Controller");
const SquealToUserModel = require("../models/SquealToUserModel");
const SquealController = require("./SquealController");
const SquealModel = require("../models/SquealModel");
const ChannelRolesModel = require("../models/ChannelRolesModel");
const SquealToChannelModel = require("../models/SquealToChannelModel");
const ChannelRoleDto = require("../entities/dtos/ChannelRoleDto");


module.exports = class UtilsController extends Controller {
    constructor() {
        super();
    }

    /**
     * @param authUser {UserDto}
     * @param excludeFrom {number}
     * @param excludeTo {number}
     * @param sessionId {string}
     * @return {Promise<{msg: string, code: number, sub_code: number,content: {}}>}
     */
    async getSquealsToUser(authUser, excludeFrom, excludeTo, sessionId) {
        let output = this.getDefaultOutput();

        if (this.isAuthenticatedUser(authUser) === false) {
            output["code"] = 403;
            output["msg"] = "Forbidden";
            return output;
        }

        let squealToUserModel = new SquealToUserModel();
        let squealCtrl = new SquealController(new SquealModel());
        let result = await squealToUserModel.getSquealsToUser(authUser.username, excludeFrom, excludeTo, autoload.config._LIMIT_RETURN_POSTS);
        let promises = [];
        for (const id of result)
            promises.push(squealCtrl.getSqueal(id, authUser, sessionId));
        promises = await Promise.all(promises);
        let content = [];
        for (const promiseResult of promises)
            if (promiseResult.code === 200)
                content.push(promiseResult.content);
        output.content = content;
        return output;
    }

    /**
     * @param authUser {UserDto}
     * @param excludeFrom {number}
     * @param excludeTo {number}
     * @param sessionId {string}
     * @return {Promise<{msg: string, code: number, sub_code: number,content: {}}>}
     */
    async getSquealsToChannelsOfUser(authUser, excludeFrom, excludeTo, sessionId) {
        let output = this.getDefaultOutput();

        if (this.isAuthenticatedUser(authUser) === false) {
            output["code"] = 403;
            output["msg"] = "Forbidden";
            return output;
        }

        let channelRolesModel = new ChannelRolesModel();
        let squealCtrl = new SquealController(new SquealModel());

        let roles = await channelRolesModel.getAllRolesOfUser(authUser.username);
        let rolesRead = [];
        for (const role of roles)
            if (role.role >= autoload.config._CHANNEL_ROLE_READ)
                rolesRead.push(role.getChannelDto());
        let squealToChannels = new SquealToChannelModel();
        let squealsIds = await squealToChannels.getAllSquealsToChannels(rolesRead, excludeFrom, excludeTo, autoload.config._LIMIT_RETURN_POSTS);
        let promises = [];
        for (const id of squealsIds)
            promises.push(squealCtrl.getSqueal(id, authUser, sessionId));
        promises = await Promise.all(promises);
        let content = [];
        for (const promiseResult of promises)
            if (promiseResult.code === 200)
                content.push(promiseResult.content);
        output.content = content;
        return output;
    }

    /**
     * @param username
     * @return {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async getSentSquealsFromUser(username){
        const SquealController = require('../controllers/SquealController');
        const SquealModel = require('../models/SquealModel');
        let ctrl = new SquealController(new SquealModel());
        return await ctrl.getSentSquealsByUser(username);
    }

    /**
     * @param {UserDto} authUser
     * @param {ChannelDto} channelDto
     * @return {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async getSentSquealsToChannels(authUser, channelDto){
        let output = this.getDefaultOutput();

        let squealCtrl = new SquealController(new SquealModel());
        let squealToChannels = new SquealToChannelModel();

        if(channelDto.type === autoload.config._CHANNEL_TYPE_USER && channelDto.private === true){
            //Verifico che l'utente sia autenticato ed abbia tutti i privilegi necessari
            let channelRolesModel = new ChannelRolesModel();
            if(this.isAuthenticatedUser(authUser) === false) {
                output.code = 403;
                return output;
            }
            let roleDto = new ChannelRoleDto();
            roleDto.username = authUser.username;
            roleDto.channel_name = channelDto.channel_name;
            roleDto.type = channelDto.type;
            let role = await channelRolesModel.getUserRole(roleDto);
            if(role.role < autoload.config._CHANNEL_ROLE_READ && authUser.isAdmin === false) {
                output.code = 401;
                return output;
            }
        }

        let ids = await squealToChannels.getAllSquealsToChannels([channelDto], 0, 0, 25);
        let promises = [];
        for (const id of ids)
            promises.push(squealCtrl.getSqueal(id, authUser, ''));
        promises = await Promise.all(promises);
        let content = [];
        for (const promiseResult of promises)
            if (promiseResult.code === 200)
                content.push(promiseResult.content);
        output.content = content;
        return output;
    }

};
