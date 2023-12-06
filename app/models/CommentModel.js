const Model = require("./Model");
const Comment = require("../entities/schemas/CommentSchema");
const CommentDto = require("../entities/dtos/CommentDto");

module.exports = class CommentModel extends Model {

    constructor(collectionName) {
        super(collectionName);
    }

    /**
     * @param {SquealDto} squealDto
     * @return {Promise<void>}
     */
    async getCommentFromSqueal(squealDto) {
        await this.checkMongoose("comments", Comment);

        let id = this.mongo_escape(squealDto.id);
        let filter = {
            squeal_id: id
        };

        let results = await this.entityMongooseModel.find(filter);
        for (const result of results) {
            let comment = new CommentDto();
            comment.squeal_id = squealDto.id;
            comment.username = result._doc.username;
            comment.comment = result._doc.comment;
            squealDto.insertComment(comment);
        }
    }


    /**
     * @param {CommentDto} commentDto
     * @return {Promise<boolean>}
     */
    async postComment(commentDto){
        await this.checkMongoose("comments", Comment);

        let document = this.mongo_escape(commentDto.getDocument());

        try {
            await this.entityMongooseModel.insertMany(document);
        } catch (ignored) {
            return false;
        }
        return true;
    }
}