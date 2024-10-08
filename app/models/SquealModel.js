const Model = require("./Model");
const Squeal = require("../entities/schemas/SquealSchema");
const SquealDto = require("../entities/dtos/SquealDto");
const SquealStat = require('../entities/SquealStat');
const ExtendedChannelDto = require("../entities/dtos/ExtendedChannelDto");

module.exports = class SquealModel extends Model {
    constructor(CollectionName) {
        super(CollectionName);
    }

    /**
     *
     * @param identifier {Number}
     * @returns {Promise<SquealDto|{}>}
     */
    async getSqueal(identifier) {
        await this.checkMongoose("Squeal", Squeal);
        let filter = {_id: `${identifier}`};
        filter = this.mongo_escape(filter);
        let result = await this.entityMongooseModel.find(filter);
        if (result.length === 1)
            return new SquealDto(result[0]._doc);
        return {};
    }


    /**
     * @param identifier {Number}
     * @param newContent {string}
     * @return {Promise<void>}
     */
    async updateSquealContent(identifier, newContent) {
        await this.checkMongoose("Squeal", Squeal);
        let filter = {_id: `${identifier}`};
        filter = this.mongo_escape(filter);
        let update = {
            content: `${newContent}`
        }
        update = this.mongo_escape(update);
        try {
            await this.entityMongooseModel.findOneAndUpdate(filter, update);
            return true;
        } catch (ignored) {
            return false;
        }
    }

    /**
     * @param squealDto {SquealDto}
     * @returns {Promise<boolean>}
     */
    async postSqueal(squealDto) {
        await this.checkMongoose("Squeal", Squeal);
        squealDto = this.mongo_escape(squealDto.getDocument());
        delete squealDto.comments;
        delete squealDto.reaction;
        let newSqueal = new this.entityMongooseModel(squealDto);
        try {
            await newSqueal.save();
        } catch (ignored) {
            return false;
        }
        return true;
    }

    /**
     * @param squealDto {SquealDto}
     * @param squeal_id {number}
     * @returns {Promise<boolean>}
     */
    async replaceSqueal(squealDto, squeal_id) {
        await this.checkMongoose("Squeal", Squeal);
        let content = squealDto.content;
        let f = false;
        if(Array.isArray(content)){
            f = true;
            content = `[${content[0]},${content[1]}]`;
        }
        let squealDoc = this.mongo_escape(squealDto.getDocument());
        if(f){
            squealDoc.content = content;
        }
        delete squealDoc.comments;
        delete squealDoc.reaction;
        squeal_id = parseInt(squeal_id);
        if (isNaN(squeal_id))
            return false;

        try {
            await this.entityMongooseModel.findByIdAndUpdate(squealDto.id, squealDoc);
            return true;
        } catch (ignored) {
            return false;
        }
    }

    /**
     * @return {Promise<number>}
     * Returns the next id of the squeal
     */
    async getNextId() {
        await this.checkMongoose("Squeal", Squeal);
        let result = await this.entityMongooseModel.find({}).sort({'_id': 'desc'}).limit(1);
        if (result.length === 1)
            return parseInt(result[0]._doc._id) + 1;
        return 1;
    }

    /**
     * @param oldUsername {string}
     * @param newUsername {string}
     * @return {Promise<boolean>}
     */
    async replaceUser(oldUsername, newUsername) {
        await this.checkMongoose("Squeal", Squeal);
        let filter = {sender: `${oldUsername}`};
        filter = this.mongo_escape(filter);
        let update = {sender: `${newUsername}`}
        try {
            await this.entityMongooseModel.updateMany(filter, update);
            return true;
        } catch (ignored) {
            return false;
        }
    }

    /**
     * @param username {string}
     * @return {Promise<boolean>}
     */
    async deleteUser(username) {
        await this.checkMongoose("Squeal", Squeal);
        let filter = {sender: `${username}`};
        filter = this.mongo_escape(filter);
        let update = {sender: `${username}`}
        try {
            await this.entityMongooseModel.deleteMany(filter, update);
            return true;
        } catch (ignored) {
            return false;
        }
    }

    /**
     * @param {number} squeal_id
     * @param {number} critical_mass
     * @return {Promise<boolean>}
     */
    async updateCriticalMass(squeal_id, critical_mass) {
        await this.checkMongoose("Squeal", Squeal);
        if (isNaN(squeal_id) || isNaN(critical_mass))
            return false;

        let filter = {_id: squeal_id};
        filter = this.mongo_escape(filter);
        let update = {critical_mass: critical_mass};
        update = this.mongo_escape(update);
        try {
            await this.entityMongooseModel.updateOne(filter, update);
            return true;
        } catch (ignored) {
            return false;
        }
    }

    /**
     * @param {string} username
     * @return {Promise<number>}
     * Count every popular squeal, controversial squeals are included.
     */
    async countPopularSquealUser(username) {
        await this.checkMongoose("Squeal", Squeal);
        username = this.mongo_escape(username);
        let filter = {$expr: {$gt: ["$positive_value", "$critical_mass"]}, "sender": `${username}`};
        return await this.entityMongooseModel.find(filter).count();
    }

    /**
     * @param {string} username
     * @return {Promise<number>}
     * Count every popular squeal, controversial squeals are included.
     */
    async countUnpopularSquealUser(username) {
        await this.checkMongoose("Squeal", Squeal);
        username = this.mongo_escape(username);
        let filter = {$expr: {$gt: ["$negative_value", "$critical_mass"]}, "sender": `${username}`};
        return await this.entityMongooseModel.find(filter).count();
    }

    /**
     * @param username
     * @return {Promise<number>}
     */
    async countControversial(username) {
        await this.checkMongoose("Squeal", Squeal);
        username = this.mongo_escape(username);
        let filter = {
            $and: [
                {$expr: {$gt: ["$positive_value", "$critical_mass"]}},
                {$expr: {$gt: ["$negative_value", "$critical_mass"]}},
            ],
            "sender": `${username}`
        };
        return await this.entityMongooseModel.find(filter).count();
    }

    /**
     * @param username {string}
     * @param from {number}
     * @param to {number}
     * @return {Promise<SquealStat[]>}
     */
    async getPopularityStats(username, from, to) {
        await this.checkMongoose("Squeal", Squeal);
        username = this.mongo_escape(username);
        from = this.mongo_escape(from);
        to = this.mongo_escape(to);

        let filter = {
            $and: [
                {$expr: {$gt: ["$date", `${from}`]}},
                {$expr: {$lt: ["$date", `${to}`]}}
            ],
            "sender": `${username}`
        };
        let results = await this.entityMongooseModel.find(filter).sort({date: 'asc'});
        let out = [];
        for (const result of results) {
            out.push(new SquealStat(result._doc._id, result._doc.sender, result._doc.date, result._doc.positive_value, result._doc.negative_value));
        }
        return out;
    }

    /**
     * @param {string} sender
     * @return {Promise<SquealDto[]>}
     */
    async getSquealsFromSender(sender) {
        await this.checkMongoose("Squeal", Squeal);
        sender = this.mongo_escape(sender);
        let filter = {
            sender: sender
        };
        let out = [];
        let result = await this.entityMongooseModel.find(filter).sort({_id: -1});
        for (const resultElement of result)
            out.push(new SquealDto(resultElement._doc));
        return out;
    }


    /**
     * @param {number} offset
     * @param {number} limit
     * @param {string} search_sender
     * @param {number[]} includes_ids
     * @param {string} orderBy
     * @param {string} orderDir
     * @param {string} dest_search
     * @return {Promise<numbers[] | []>}
     * Returns only ids. Not content
     */
    async getSquealList(offset, limit, search_sender, includes_ids, orderBy, orderDir, dest_search) {
        await this.checkMongoose("Squeal", Squeal);
        orderDir = (orderDir === 'ORDER_ASC' ? 'asc' : 'desc');
        let results;
        let sorting = {};
        sorting[orderBy] = orderDir;
        sorting = this.mongo_escape(sorting);
        if (orderBy === '')
            sorting = {_id: "desc"};

        let search_int = parseInt(search_sender);
        if (isNaN(search_int)) search_int = -1;

        let filter = {
            $or: [
                {positive_value: search_int},
                {negative_value: search_int},
                {critical_mass: search_int},
                {quote_cost: search_int},
                {message_type: 'MESSAGE_TEXT', content: search_sender},
                {message_type: 'TEXT_AUTO', content: search_sender},
                {sender: search_sender},
                {_id: search_int},
                {_id: {$in: includes_ids}},
            ]
        }

        if(search_sender === '' && dest_search === '')
            filter = {};

        if (Object.keys(sorting).length !== 0) {
            results = await this.entityMongooseModel
                .find(filter)
                .sort(sorting)
                .skip(offset)
                .limit(limit);
        } else {
            results = await this.entityMongooseModel
                .find(filter)
                .skip(offset)
                .limit(limit);
        }


        let output = [];
        for (const result of results) {
            output.push(result._doc['_id']);
        }
        return output;
    }


    /**
     * @param {string} search_sender
     * @param {number[]} includes_ids
     * @param {string} dest_search
     * @return {Promise<number>}
     * Returns only ids. Not content
     */
    async getSquealListCount(search_sender, includes_ids, dest_search) {
        await this.checkMongoose("Squeal", Squeal);
        let results;

        let search_int = parseInt(search_sender);
        if (isNaN(search_int)) search_int = -1;

        let filter = {
            $or: [
                {positive_value: search_int},
                {negative_value: search_int},
                {quote_cost: search_int},
                {message_type: 'MESSAGE_TEXT', content: search_sender},
                {message_type: 'TEXT_AUTO', content: search_sender},
                {sender: search_sender},
                {_id: search_int},
                {_id: {$in: includes_ids}},
            ]
        }

        if(search_sender === '' && dest_search === '')
            filter = {};

        results = await this.entityMongooseModel
            .find(filter).count();

        return results;
    }

    /**
     * @param {number} squeal_id
     * @param {string} field
     * @param {*} newValue
     * @param {boolean} escapeControl
     * @return {Promise<boolean>}
     */
    async changeFieldMongoDB(squeal_id, field, newValue, escapeControl = false){
        await this.checkMongoose("Squeal", Squeal);

        squeal_id = this.mongo_escape(squeal_id);
        field = this.mongo_escape(field);
        if(escapeControl === false)
            newValue = this.mongo_escape(newValue);

        let filter = {_id: squeal_id}
        let update = {};
        update[field] = newValue;
        try {
            await this.entityMongooseModel.updateOne(filter, update)
            return true;
        } catch (ignored) {
            return false;
        }
    }


}