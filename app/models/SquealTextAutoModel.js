const Model = require("./Model");
const SquealTextAutoSchema = require("../entities/schemas/SquealTextAutoSchema");
const SquealTextAutoDto = require("../entities/dtos/SquealTextAutoDto");

module.exports = class SquealTextAutoModel extends Model {
    constructor(CollectionName) {
        super(CollectionName);
    }


    /**
     *
     * @param autoSqueal {SquealTextAutoDto}
     * @param currentTimestamp {number}
     * @return {Promise<boolean>}
     */
    async createScheduledOperation(autoSqueal, currentTimestamp){
        await this.checkMongoose("squeal_auto_text", SquealTextAutoSchema);
        let next_it = currentTimestamp + autoSqueal.next_scheduled_operation;
        autoSqueal.delay_seconds = autoSqueal.next_scheduled_operation;
        autoSqueal.next_scheduled_operation = next_it;
        autoSqueal.iteration = 0;

        autoSqueal = this.mongo_escape(autoSqueal.getDocument());
        let newAutoSqueal = new this.entityMongooseModel(autoSqueal);
        try {
            await newAutoSqueal.save();
        } catch (ignored){
            return false;
        }
        return true;
    }

    /**
     * @param {number} currentTimestamp
     * @return {Promise<SquealTextAutoDto[]>}
     */
    async getCurrentExecutionList(currentTimestamp){
        await this.checkMongoose("squeal_auto_text", SquealTextAutoSchema);
        let out = [];

        if(isNaN(currentTimestamp))
            return out;

        let filter = {next_scheduled_operation: `${currentTimestamp}`};
        filter = this.mongo_escape(filter);
        let result = await this.entityMongooseModel.find(filter);
        for(let i = 0; i < result.length; i++)
            out.push(new SquealTextAutoDto(result[i]._doc));
        return out;
    }

    /**
     * @param id {number}
     * @param autoSqueal {SquealTextAutoDto}
     * @return {Promise<boolean>}
     */
    async updateSchedule(id, autoSqueal){
        await this.checkMongoose("squeal_auto_text", SquealTextAutoSchema);
        if(isNaN(id))
            return false;
        let filter = {_id: `${id}`};
        filter = this.mongo_escape(filter);
        let update = autoSqueal.getDocument();
        update = this.mongo_escape(update);
        try {
            await this.entityMongooseModel.findOneAndUpdate(filter, update);
            return true;
        } catch (ignored){
            return false;
        }
    }



}