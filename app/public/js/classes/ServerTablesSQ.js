class ServerTablesSQ {
    #containerId;
    #page;
    #limit;
    #assoc_json;
    #orderBy;
    #orderDir;
    #search;
    #searchDest;
    #data;
    #userCount;
    #variableName;

    /**
     * @param {string} id id html
     * @param {object} assoc_json E' un oggetto della forma {json_field => Nome della colonna che lo rappresenta}
     * @param {string} variableName Nome della variabile per invocare le funzioni
     */
    constructor(id, assoc_json, variableName) {
        this.#containerId = id;
        this.#page = 1;
        this.#limit = 10;
        this.#assoc_json = assoc_json;
        this.#orderBy = '_id';
        this.#orderDir = 'ORDER_DESC';
        this.#search = '';
        this.#searchDest = '';
        this.#data = [];
        this.#userCount = 0;
        this.#variableName = variableName;
    }

    /**
     * @return {number}
     */
    getRealPage() {
        return this.#page - 1;
    }

    /**
     * @return {number}
     */
    getMaxPage() {
        let pages = parseInt(this.#userCount / this.#limit);
        if (this.#userCount % this.#limit > 0)
            pages = pages + 1;
        return pages;
    }

    /**
     * @return {number}
     */
    getOffset() {
        return this.getRealPage() * this.#limit;
    }

    async askData2Server() {
        const response = await fetch(`../../squeal/?orderBy=${this.#orderBy}&orderDir=${this.#orderDir}&search_sender=${this.#search}&search_dest=${this.#searchDest}&offset=${this.getOffset()}&limit=${this.#limit}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (response.ok) {
            let temp = await response.json();
            this.#data = temp.squeals;
            this.#userCount = temp.totalCount;
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
        <div class="ps-2 row w-100">
            <div class="col-md-4 col-sm-12">
                <div class="row">
                    <input type="input" name="serverTableDestinations" class="form-control" onkeyup="${this.#variableName}.executeSearchDest(this);" value="${this.#searchDest}" placeholder="Cerca tra i destinatari..." maxlength="32">
                </div>
            </div>           
            <div class="col-md-4 offset-md-4 col-sm-12">
                <div class="row">
                    <input type="input" name="serverTableSearch" class="form-control" onkeyup="${this.#variableName}.executeSearchNormal(this);" value="${this.#search}" placeholder="Cerca tra gli squeal..." maxlength="32">
                </div>
            </div>
        </div>
        <br>
        <table class="w-100 table table-bordered table-dark table-data">
            ${this.getTableHeader()}
            ${this.getTableBody()}
        </table>
        <div class="table-buttons">
            ${this.drawNavigationButtons()}        
        </div>
        `;
        containerNode.innerHTML = html;
    }

    drawData() {
        let containerNode = document.getElementById(this.#containerId);
        let table = containerNode.getElementsByClassName("table-data")[0];
        let footer = containerNode.getElementsByClassName("table-buttons")[0];
        table.innerHTML = `
            ${this.getTableHeader()}
            ${this.getTableBody()}`;
        footer.innerHTML = this.drawNavigationButtons();
    }

    /**
     * @param {HTMLElement} inputElement
     * @return {Promise<void>}
     */
    async executeSearchDest(inputElement) {
        this.#searchDest = inputElement.value;
        await this.executeSearch(this.#searchDest, this.#search);
    }

    /**
     * @param {HTMLElement} inputElement
     * @return {Promise<void>}
     */
    async executeSearchNormal(inputElement) {
        this.#search = inputElement.value;
        await this.executeSearch(this.#searchDest, this.#search);
    }

    /**
     * @return {Promise<void>}
     */
    async executeSearch(sD, sN) {
        this.#page = 1;
        await this.askData2Server();
        if(sN === this.#search && sD === this.#searchDest)
            this.drawData();
    }

    /**
     * @param {number} page
     * @return {Promise<void>}
     */
    async setPage(page) {
        this.#page = page;
        await this.askData2Server();
        this.drawData();
    }

    //TODO FARE QUESTA TABELLA ACCESSIBILE!

    drawNavigationButtons() {
        switch (this.getNumberOfButtonsRequired()) {
            case 0:
                return '';
            case 3:
                if (this.getRealPage() === 0) { //start
                    return `
                        <div class="row w-100">
                            <div class="offset-md-${12 - this.getNumberOfButtonsRequired()} col-md-${this.getNumberOfButtonsRequired()} col-sm-12">
                                <div class="row">
                                    <button type="button" class="col-3 btn btn-primary">${this.#page}</button>
                                    &nbsp;
                                    <button type="button" class="col-4 btn btn-light" onclick="${this.#variableName}.setPage(${this.#page + 1})">></button>
                                    &nbsp;
                                    <button type="button" class="col-4 btn btn-light" onclick="${this.#variableName}.setPage(${this.getMaxPage()})">>>></button>                
                                </div>
                            </div>    
                        </div>`;
                } else { //end
                    return `
                        <div class="row w-100">
                            <div class="offset-md-${12 - this.getNumberOfButtonsRequired()} col-md-${this.getNumberOfButtonsRequired()} col-sm-12">
                                <div class="row">
                                    <button type="button" class="col-4 btn btn-light" onclick="${this.#variableName}.setPage(1)"><<<</button>
                                    &nbsp;
                                    <button type="button" class="col-4 btn btn-light" onclick="${this.#variableName}.setPage(${this.#page - 1})"><</button>
                                    &nbsp;
                                    <button type="button" class="col-3 btn btn-primary">${this.#page}</button>                
                                </div>
                            </div>    
                        </div>`;
                }
            case 5:
                return `
                <div class="row w-100">
                    <div class="offset-md-${12 - this.getNumberOfButtonsRequired()} col-md-${this.getNumberOfButtonsRequired()} col-sm-12">
                        <div class="row">
                            <button type="button" class="col-2 btn btn-light" onclick="${this.#variableName}.setPage(1)"><<<</button>
                            &nbsp;
                            <button type="button" class="col-2 btn btn-light" onclick="${this.#variableName}.setPage(${this.#page - 1})"><</button>
                            &nbsp;
                            <button type="button" class="col-3 btn btn-primary">${this.#page}</button>
                            &nbsp;
                            <button type="button" class="col-2 btn btn-light" onclick="${this.#variableName}.setPage(${this.#page + 1})">></button>
                            &nbsp;
                            <button type="button" class="col-2 btn btn-light" onclick="${this.#variableName}.setPage(${this.getMaxPage()})">>>></button>           
                        </div>
                    </div>    
                </div>
                `
        }
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
        html = html + '</thead>';

        return html;
    }

    /**
     * @param channelRow
     * @return {string}
     */
    getRow(channelRow) {
        let html = '';
        let objKeys = Object.keys(channelRow);
        for (const assocJsonKey in this.#assoc_json)
            if (assocJsonKey === 'destinations') {
                let destStr = '<ul>';
                for (const dest of channelRow[assocJsonKey]) {
                    destStr = destStr + `<li>${dest}</li>`;
                }
                destStr = destStr + '</ul>'
                html = html + `<td>${destStr}</td>`
            } else if (objKeys.includes(assocJsonKey))
                html = html + `<td>${channelRow[assocJsonKey]}</td>`;


        if (Object.keys(this.#assoc_json).includes('actions')) {
            html = html + `<td>
                <button type="button" class="btn btn-warning" onclick="${this.#variableName}.updateChannel('${channelRow.channel_name}')" data-bs-toggle="modal" data-bs-target="#modalAggiungiCanale">Modifica</button>
                &nbsp;
                <button type="button" class="btn btn-danger" onclick="${this.#variableName}.deleteChannel('${channelRow.channel_name}')" data-bs-toggle="modal" data-bs-target="#modalEliminaCanale">Elimina</button>
                &nbsp;
                <button type="button" class="btn btn-success" onclick="${this.#variableName}.newSqueal('${channelRow.channel_name}')" data-bs-toggle="modal" data-bs-target="#nuovoSqueal">Crea squeal</button>
                </td>`;
        }

        return html;
    }


    /**
     * @return {string}
     */
    getTableBody() {
        if (this.#data.length === 0) {
            return '<tbody class="text-center"><h1>No Data</h1></tbody>';
        }
        let html = '<tbody>';
        for (let i = 0; i < this.#data.length; i++) {
            html = html + `<tr>`
            html = html + this.getRow(this.#data[i]);
            html = html + `</tr>`
        }

        html = html + '</tbody>';
        return html;
    }

    /**
     * @return {number}
     */
    getNumberOfButtonsRequired() {
        if (this.getMaxPage() === 0)
            return 0;
        if (this.#page === this.getMaxPage() && this.getMaxPage() === 1)
            return 0;
        //From here we have multiple pages!

        if (this.#page === 1) //At the start
            return 3;

        if (this.#page === this.getMaxPage()) //At the end
            return 3;

        return 5; //Between the pages
    }
}