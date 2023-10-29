class ServerTablesUC {
    #containerId;
    #page;
    #limit;
    #assoc_json;
    #orderBy;
    #orderDir;
    #search;
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
        this.#orderBy = 'username';
        this.#orderDir = 'ORDER_ASC';
        this.#search = '';
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
        const response = await fetch(`../../channel/CHANNEL_USERS/?orderBy=${this.#orderBy}&orderDir=${this.#orderDir}&search=${this.#search}&offset=${this.getOffset()}&limit=${this.#limit}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (response.ok) {
            let temp = await response.json();
            this.#data = temp.channels;
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
        <div class="row w-100">
            <div class="col-md-2">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalAggiungiCanale" onclick="cleanModalAddChannel('CHANNEL_USERS')">
                Aggiungi</button>
            </div>
            <div class="col-md-4 offset-md-6 col-sm-12">
                <div class="row">
                    <input type="input" name="serverTableSearch" class="form-control" onkeyup="${this.#variableName}.executeSearch(this);" value="${this.#search}" placeholder="Cerca tra i canali..." maxlength="32">
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
    async executeSearch(inputElement) {
        this.#search = inputElement.value;
        let searched = this.#search;
        this.#page = 1;
        await this.askData2Server();
        if(searched === this.#search)
            this.drawData();
    }

    /**
     * @param {number} page
     * @return {Promise<void>}
     */
    async setPage(page){
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
                break;
            case 5:
                return `
                <div class="row w-100">
                    <div class="offset-md-${12 - this.getNumberOfButtonsRequired()} col-md-${this.getNumberOfButtonsRequired()} col-sm-12">
                        <div class="row">
                            <button type="button" class="col-4 btn btn-light" onclick="${this.#variableName}.setPage(1)"><<<</button>
                            &nbsp;
                            <button type="button" class="col-4 btn btn-light" onclick="${this.#variableName}.setPage(${this.#page - 1})"><</button>
                            &nbsp;
                            <button type="button" class="col-3 btn btn-primary">${this.getRealPage()}</button>
                            &nbsp;
                            <button type="button" class="col-4 btn btn-light" onclick="${this.#variableName}.setPage(${this.#page})">></button>
                            &nbsp;
                            <button type="button" class="col-4 btn btn-light" onclick="${this.#variableName}.setPage(${this.getMaxPage()})">>>></button>           
                        </div>
                    </div>    
                </div>
                `
                break;
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
    getChannelRole(channelRow) {
        let html = '';
        let objKeys = Object.keys(channelRow);
        for (const assocJsonKey in this.#assoc_json)
            if (assocJsonKey === 'private') {
                let isPrivate = 'Privato';
                if(channelRow.private !== true)
                    isPrivate = 'Pubblico';
                html = html + `<td>${isPrivate}</td>`;
            } else if (objKeys.includes(assocJsonKey))
                html = html + `<td>${channelRow[assocJsonKey]}</td>`;

        if (Object.keys(this.#assoc_json).includes('actions')) {
            html = html + `<td>
                <button type="button" class="btn btn-warning" onclick="${this.#variableName}.updateChannel('${channelRow.username}')" data-bs-toggle="modal" data-bs-target="#modalAggiungiUtente">Modifica</button>
                &nbsp;
                <button type="button" class="btn btn-danger" onclick="${this.#variableName}.deleteChannel('${channelRow.username}')" data-bs-toggle="modal" data-bs-target="#modalEliminaUtente">Elimina</button>
                &nbsp;
                <button type="button" class="btn btn-success" onclick="${this.#variableName}.deleteChannel('${channelRow.username}')" data-bs-toggle="modal" data-bs-target="#modalEliminaUtente">Cambia ruoli</button>
                </td>`;
        }

        return html;
    }

    /**
     * @param {string} channel_name
     * @return {ChannelDto|null}
     */
    extractChannelByName(channel_name) {
        for (const userKey in this.#data)
            if (this.#data[userKey].username === channel_name)
                return this.#data[userKey];
        return null;
    }

    /**
     * @param {string} username
     * This function shows modal to edit user.
     */
    updateUser(username) {
        let userDto = this.extractChannelByName(username);
        if (userDto === null)
            return userDto;

        document.getElementById('exampleModalLongTitle').innerHTML = 'Modifica utente';
        document.getElementById('registerUsername').value = userDto.username;
        document.getElementById('registerEmail').value = userDto.email;
        document.getElementById('registerFirstName').value = userDto.first_name;
        document.getElementById('registerLastName').value = userDto.last_name;
        document.getElementById('registerPassword').value = '';
        document.getElementById('confirmPassword').value = '';
        document.getElementById('isUser').checked = userDto.isUser;
        document.getElementById('isMod').checked = userDto.isAdmin;
        document.getElementById('isSmm').checked = userDto.isSmm;
        document.getElementById('executeOperation').setAttribute('onclick', `applicaCambiamentiUtente('${username}')`);
        document.getElementById('executeOperation').innerHTML = 'Modifica utente';
    }

    /**
     * @param {string} username
     * This function shows modal to delete user.
     */
    deleteUser(username) {
        document.getElementById('eliminaUtenteUsername').innerHTML = `Volete eliminare l'utente "${username}"?`;
        document.getElementById('executeDeleteButton').setAttribute('onclick', `executeDeleteOnServer("${username}")`);
    }


    /**
     * @return {string}
     */
    getTableBody() {
        if(this.#data.length === 0){
            return '<tbody class="text-center"><h1>No Data</h1></tbody>';
        }
        let html = '<tbody>';
        for (let i = 0; i < this.#data.length; i++) {
            html = html + `<tr>`
            html = html + this.getChannelRole(this.#data[i]);
            html = html + `</tr>`
        }

        html = html + '</tbody>';
        return html;
    }

    /**
     * @return {number}
     */
    getNumberOfButtonsRequired() {
        if(this.getMaxPage() === 0)
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