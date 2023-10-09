class ServerTablesUsers {

    #containerId;
    #page;
    #limit;
    #assoc_json;
    #orderBy;
    #orderDir;
    #search;
    #data;

    /**
     * @param {string} id
     * @param {object} assoc_json E' un oggetto della forma {json_field => Nome della colonna che lo rappresenta}
     */
    constructor(id, assoc_json) {
        this.#containerId = id;
        this.#page = 1;
        this.#limit = 10;
        this.#assoc_json = assoc_json;
        this.#orderBy = 'username';
        this.#orderDir = 'ORDER_ASC';
        this.#search = '';
        this.#data = [];
    }

    /**
     * @return {number}
     */
    getRealTable() {
        return this.#page - 1;
    }

    /**
     * @return {number}
     */
    getOffset() {
        return this.getRealTable() * this.#limit;
    }

    async askData2Server() {
        const response = await fetch(`../../user/?orderBy=${this.#orderBy}&orderDir=${this.#orderDir}&search=${this.#search}&offset=${this.getOffset()}&limit=${this.#limit}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (response.ok) {
            this.#data = await response.json();
        }
    }

    /**
     * @returns {void}
     */
    draw() {
        let containerNode = document.getElementById(this.#containerId);
        if (containerNode === null)
            return;
        let html = `
        <div class="w-100">
            <div class="col-md-4 offset-md-8 col-sm-12">
            <div class="row">
                <input type="email" class="form-control" placeholder="Cerca fra gli utenti...">
            </div>
            </div>
        </div>
        <br>
        <table class="w-100 table table-bordered table-dark">
            ${this.getTableHeader()}
            ${this.getTableBody()}
        </table>
        `;
        containerNode.innerHTML = html;
    }

    /**
     * @return {string}
     */
    getTableHeader() {
        let html = '<thead>';
        for (const assocJsonKey in this.#assoc_json) {
            let displayName = this.#assoc_json[assocJsonKey];
            html = html + `<th class="text-center">${displayName}</th>`;
        }
        html = html + `<th class="text-center">Azioni</th>`;
        html = html + '</thead>';

        return html;
    }

    /**
     * @param userRow
     * @return {string}
     */
    getUserRow(userRow) {
        let html = '';
        let objKeys = Object.keys(userRow);
        for (const assocJsonKey in this.#assoc_json)
            if (objKeys.includes(assocJsonKey))
                html = html + `<td>${userRow[assocJsonKey]}</td>`;

        return html;
    }


    /**
     * @return {string}
     */
    getTableBody() {
        let html = '<tbody>';
        for (let i = 0; i < this.#data.length; i++){
            html = html + `<tr>`
            html = html + this.getUserRow(this.#data[i]);
            html = html + `</tr>`
        }

        html = html + '</tbody>';
        return html;
    }
}