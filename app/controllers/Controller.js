module.exports = class Controller {

    constructor() {
    }


    /**
     *
     * @param obj
     * @returns {boolean}
     *
     * Gived an object returns true if is void, false otherwise.
     *
     */
    isObjectVoid(obj) {
        if(Object.keys(obj).length === 0)
            return true;
        return false;
    }

    getDefaultOutput() {
        return {
            'code': 200,
            'msg': 'Ok.',
            'content': {}
        };
    }

}