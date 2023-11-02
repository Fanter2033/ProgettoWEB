class ServerTablesUsers {

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
        const response = await fetch(`../../user/?orderBy=${this.#orderBy}&orderDir=${this.#orderDir}&search=${this.#search}&offset=${this.getOffset()}&limit=${this.#limit}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        });
        if (response.ok) {
            let temp = await response.json();
            this.#data = temp.users;
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
        containerNode.innerHTML = `
        <div class="row w-100">
            <div class="col-md-2">
                <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalAggiungiUtente" onclick="cleanModalAddUser()">
                Aggiungi</button>
            </div>
            <div class="col-md-4 offset-md-6 col-sm-12">
                <div class="row">
                    <input type="email" name="serverTableSearch" class="form-control" onkeyup="${this.#variableName}.executeSearch(this);" value="${this.#search}" placeholder="Cerca fra gli utenti..." maxlength="32">
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
     * @param userRow
     * @return {string}
     */
    getUserRow(userRow) {
        let html = '';
        let objKeys = Object.keys(userRow);
        for (const assocJsonKey in this.#assoc_json)
            if (assocJsonKey === 'null') {
                html = html + `<td>${this.getAuthList(userRow)}</td>`;
            } else if (objKeys.includes(assocJsonKey))
                html = html + `<td>${userRow[assocJsonKey]}</td>`;

        if (Object.keys(this.#assoc_json).includes('actions')) {
            html = html + `<td>
                <button type="button" class="btn btn-warning" onclick="${this.#variableName}.updateUser('${userRow.username}')" data-bs-toggle="modal" data-bs-target="#modalAggiungiUtente">Modifica</button>
                &nbsp;
                <button type="button" class="btn btn-danger" onclick="${this.#variableName}.deleteUser('${userRow.username}')" data-bs-toggle="modal" data-bs-target="#modalEliminaUtente">Elimina</button>
                &nbsp;
                <button type="button" class="btn btn-success" onclick="${this.#variableName}.changeQuotaUser('${userRow.username}')" data-bs-toggle="modal" data-bs-target="#modalCambiaQuota">Cambia quota utente</button>
                </td>`;
        }

        return html;
    }

    /**
     * @param {string} username
     * @return {UserDto|null}
     */
    extractUserByUsername(username) {
        for (const userKey in this.#data)
            if (this.#data[userKey].username === username)
                return this.#data[userKey];
        return null;
    }

    /**
     * @param {string} username
     * This function shows modal to edit user.
     */
    updateUser(username) {
        let userDto = this.extractUserByUsername(username);
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
            html = html + this.getUserRow(this.#data[i]);
            html = html + `</tr>`
        }

        html = html + '</tbody>';
        return html;
    }

    /**
     * @param {UserDto} userRowElement
     * @return {string}
     */
    getAuthList(userRowElement) {
        if (!userRowElement.isUser && !userRowElement.isSmm && !userRowElement.isAdmin)
            return ' - ';
        let html = `<ul>`;
        if (userRowElement.isUser)
            html = html + `<li>User</li>`;
        if (userRowElement.isSmm)
            html = html + `<li>Social Media Manager</li>`;
        if (userRowElement.isAdmin)
            html = html + `<li>Moderator</li>`;
        html = html + `</ul>`;
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

    /**
     * @param {string} username
     *
     */
    changeQuotaUser(username){
        let userDto = this.extractUserByUsername(username);
        if (userDto === null)
            return userDto;

        fetch(`../../user/${username}/quote`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => {return response.json()})
            .then((json) => {
                $("#modalCambiaQuota [name='container']").html(this.crateLayoutChangeQuota(
                    json.remaining_daily,
                    json.remaining_weekly,
                    json.remaining_monthly,
                    json.limit_daily,
                    json.limit_weekly,
                    json.limit_monthly,
                ) + 'Nuovi valori <div name="new_values_container"></div>');
                $('#newPercentage').val(100).trigger('onkeyup');
            });

        $(`#modalCambiaQuota [name="perform_operation"]`).attr('onclick', `executeChangeQuota('${username}')`)

    }

    /**
     * @param {number} old_quota_rd
     * @param {number} old_quota_rw
     * @param {number} old_quota_rm
     * @param {number} old_quota_ld
     * @param {number} old_quota_lw
     * @param {number} old_quota_lm
     * @return {string}
     */
    crateLayoutChangeQuota(old_quota_rd, old_quota_rw, old_quota_rm, old_quota_ld, old_quota_lw, old_quota_lm) {
        return `<ul id="layout_old_quota">
        <li>Rimanente giornaliera <span name="rd">${old_quota_rd}</span></li>
        <li>Rimanente settimanale <span name="rw">${old_quota_rw}</span></li>
        <li>Rimanente mensile <span name="rm">${old_quota_rm}</span></li>
        <li>Limite giornaliera <span name="ld">${old_quota_ld}</span></li>
        <li>Limite settimanale <span name="lw">${old_quota_lw}</span></li>
        <li>Limite mensile <span name="lm">${old_quota_lm}</span></li>
        </ul>`;
    }

    createLayoutNewQuota(element){
        let percentage = parseInt($(element).val());
        let rd = parseInt($('#layout_old_quota [name="rd"]').html());
        let rw = parseInt($('#layout_old_quota [name="rw"]').html());
        let rm = parseInt($('#layout_old_quota [name="rm"]').html());
        let ld = parseInt($('#layout_old_quota [name="ld"]').html());
        let lw = parseInt($('#layout_old_quota [name="lw"]').html());
        let lm = parseInt($('#layout_old_quota [name="lm"]').html());
        $('#modalCambiaQuota [name="new_values_container"]').html(
            `<ul id="layout_new_quota">
            <li>NUOVA Rimanente giornaliera <span name="rd">${this.calculatePercentage(rd, percentage)}</span></li>
            <li>NUOVA Rimanente settimanale <span name="rw">${this.calculatePercentage(rw, percentage)}</span></li>
            <li>NUOVA Rimanente mensile <span name="rm">${this.calculatePercentage(rm, percentage)}</span></li>
            <li>NUOVA Limite giornaliera <span name="ld">${this.calculatePercentage(ld, percentage)}</span></li>
            <li>NUOVA Limite settimanale <span name="lw">${this.calculatePercentage(lw, percentage)}</span></li>
            <li>NUOVA Limite mensile <span name="lm">${this.calculatePercentage(lm, percentage)}</span></li>
            </ul>`
        );
    }

    calculatePercentage(value, percentage){
        let res = Math.floor(value * percentage / 100);
        if(isNaN(res)) return 0;
        return res
    }

}