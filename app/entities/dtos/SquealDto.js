module.exports = class SquealDto {

    #id;
    #destinations;
    #destinationsUsers;
    #comments;
    #date;
    #sender;
    #message_type;
    #positive_value;
    #negative_value;
    #critical_mass;
    #quote_cost;
    #content;

    #reaction;

    constructor(documentFromMongoose = null) {
        if (documentFromMongoose === null) {
            this.#id = null;
            this.#date = null;
            this.#sender = null;
            this.#message_type = null;
            this.#positive_value = null;
            this.#negative_value = null;
            this.#critical_mass = null;
            this.#quote_cost = null;
            this.#content = null;
            this.#destinations = [];
            this.#destinationsUsers = [];
            this.#comments = [];
            this.#reaction = 'NONE';
        } else {
            this.#id = documentFromMongoose._id;
            this.#date = documentFromMongoose.date;
            this.#sender = documentFromMongoose.sender;
            this.#message_type = documentFromMongoose.message_type;
            this.#positive_value = documentFromMongoose.positive_value;
            this.#negative_value = documentFromMongoose.negative_value;
            this.#critical_mass = documentFromMongoose.critical_mass;
            this.#quote_cost = documentFromMongoose.quote_cost;
            this.#content = documentFromMongoose.content;
            this.#destinations = [];
            this.#destinationsUsers = [];
            this.#comments = [];
            this.#reaction = 'NONE';
        }
    }

    getComments() {
        let out = [];
        for (const comment of this.#comments)
            out.push(comment.getDocumentAttachSqueal());


        return out;
    }

    getDocument(getDestination = false, getReaction = true) {
        let out = {
            _id: this.#id,
            date: this.#date,
            sender: this.#sender,
            message_type: this.#message_type,
            positive_value: this.#positive_value,
            negative_value: this.#negative_value,
            critical_mass: this.#critical_mass,
            quote_cost: this.#quote_cost,
            content: this.#content,
        };

        if (getDestination) {
            out['destinations'] = [];
            for (const destination of this.#destinations) {
                let name = '';
                if (destination.type === autoload.config._CHANNEL_TYPE_HASHTAG) name = name + '#';
                else name = name + '§';
                if (destination.type === autoload.config._CHANNEL_TYPE_OFFICIAL) {
                    name = name + destination.channel_name;
                    name = name.toUpperCase();
                } else {
                    name = name + destination.channel_name;
                    name = name.toLowerCase();
                }
                out.destinations.push(name);
            }
            for (const dst of this.#destinationsUsers)
                out.destinations.push(dst);
        }

        if (getReaction) {
            out['reaction'] = this.#reaction
        }

        out['comments'] = [];
        for (const comment of this.#comments)
            out.comments.push(comment.getDocumentAttachSqueal());


        return out;
    }


    get destinations() {
        return this.#destinations;
    }

    set destinations(value) {
        this.#destinations = value;
    }

    /**
     * @param {ChannelDto} cDto
     */
    insertDestination(cDto) {
        let found = false;
        for (const cDtoElement of this.#destinations)
            if (cDtoElement.type === cDto.type && cDtoElement.channel_name === cDto.channel_name)
                found = true;

        if (found === false)
            this.#destinations.push(cDto);
    }

    /**
     * @param {string} userString
     */
    insertDestinationUser(userString) {
        this.#destinationsUsers.push(userString);
    }

    /**
     * @param {CommentDto} cDto
     */
    insertComment(cDto) {
        this.#comments.push(cDto);
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get date() {
        return this.#date;
    }

    set date(value) {
        this.#date = value;
    }

    get sender() {
        return this.#sender;
    }

    set sender(value) {
        this.#sender = value;
    }

    /**
     * @return {string}
     */
    get message_type() {
        return this.#message_type;
    }

    set message_type(value) {
        this.#message_type = value;
    }

    get positive_value() {
        return this.#positive_value;
    }

    set positive_value(value) {
        this.#positive_value = value;
    }

    get negative_value() {
        return this.#negative_value;
    }

    set negative_value(value) {
        this.#negative_value = value;
    }

    get critical_mass() {
        return this.#critical_mass;
    }

    set critical_mass(value) {
        this.#critical_mass = value;
    }

    get quote_cost() {
        return this.#quote_cost;
    }

    set quote_cost(value) {
        return this.#quote_cost = value;
    }

    get content() {
        return this.#content;
    }

    set content(value) {
        return this.#content = value;
    }


    get reaction() {
        return this.#reaction;
    }

    set reaction(value) {
        this.#reaction = value;
    }
}

