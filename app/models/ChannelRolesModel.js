const Model = require("./Model");
const ChannelRoleSchema = require("../entities/schemas/ChannelRoleSchema");
module.exports = class ChannelRolesModel extends Model {
    constructor(collectionName) {
        super(collectionName);
    }

    /**
     * @param channelRoleDto {ChannelRoleDto}
     * @return {Promise<boolean>}
     */
    async insertRole(channelRoleDto){
        await this.checkMongoose("ChannelRole", ChannelRoleSchema);
        channelRoleDto = this.mongo_escape(channelRoleDto.getDocument());
        let channelInserting = new this.entityMongooseModel(channelRoleDto);
        try {
            await channelInserting.save();
        } catch (ignored) {
            return false;
        }
        return true;
    }

}