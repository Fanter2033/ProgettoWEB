const Model = require("./Model");
const SquealChannel = require("../entities/schemas/SquealChannel");
const Squeal2ChannelDto = require("../entities/dtos/Squeal2ChannelDto");

module.exports = class SquealToChannelModel extends Model {
    constructor() {
        super();
    }

    /**
     * @param {Squeal2ChannelDto} dto
     * @return {Promise<boolean>}
     */
    async createAssocSquealChannel(dto){
        await  this.checkMongoose("squeal_to_channels", SquealChannel);
        let doc = this.mongo_escape(dto.getDocument());
        let newAssoc = new this.entityMongooseModel(doc);
        try {
            await newAssoc.save();
        } catch (ignored){
            return false;
        }
        return true;
    }



}