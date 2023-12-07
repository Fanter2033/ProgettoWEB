module.exports = class ChannelDto {

    #channel_name;
    #type;
    #private;
    #locked;
    #description;

    constructor(documentFromMongoose = null) {
        if (documentFromMongoose === null) {
            this.#channel_name = null;
            this.#type = null;
            this.#private = null;
            this.#locked = null;
            this.#description = '';
        } else {
            this.#channel_name = documentFromMongoose.channel_name;
            this.#type = documentFromMongoose.type;
            this.#private = documentFromMongoose.private;
            this.#locked = documentFromMongoose.locked;
            if(typeof documentFromMongoose.description !== 'undefined')
                this.#description = documentFromMongoose.description;
            else
                this.#description = '';
        }
    }

    getDocument() {
        return {
            channel_name: this.#channel_name,
            type: this.#type,
            private: this.#private,
            locked: this.#locked,
            description: this.#description
        }
    }


    /**
     * @return {string}
     */
    get channel_name() {
        return this.#channel_name;
    }

    set channel_name(value) {
        this.#channel_name = value;
    }

    get type() {
        return this.#type;
    }

    set type(value) {
        this.#type = value;
    }

    get private() {
        return this.#private;
    }

    set private(value) {
        this.#private = value;
    }

    get locked() {
        return this.#locked;
    }

    set locked(value) {
        this.#locked = value;
    }

    /**
     * @return {string}
     */
    get description() {
        return this.#description;
    }

    set description(value) {
        this.#description = value;
    }

    /**
     * @param {ChannelRoleDto} channelRoleDto
     * @return void
     */
    createFromChannelRole(channelRoleDto){
        this.#channel_name = channelRoleDto.channel_name;
        this.#type = channelRoleDto.type;
        this.#private = null;
        this.#locked = null;
    }

}