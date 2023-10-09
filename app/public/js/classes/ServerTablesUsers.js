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
        this.#userCount = 0;
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
        if(this.#userCount % this.#limit > 0)
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
        let html = `
        <div class="row w-100">
            <div class="col-md-2">
                <button type="button" class="btn btn-primary">Aggiungi</button>
            </div>
            <div class="col-md-4 offset-md-6 col-sm-12">
                <div class="row">
                    <input type="email" name="serverTableSearch" class="form-control" placeholder="Cerca fra gli utenti..." maxlength="32">
                </div>
            </div>
        </div>
        <br>
        <table class="w-100 table table-bordered table-dark">
            ${this.getTableHeader()}
            ${this.getTableBody()}
        </table>
        ${this.drawNavigationButtons()}
        `;
        containerNode.innerHTML = html;
    }

    //TODO FARE QUESTA TABELLA ACCESSIBILE!

    drawNavigationButtons(){
        switch (this.getNumberOfButtonsRequired()){
            case 0:
                return '';
            case 3:
                if(this.getRealPage() === 0){ //start
                    return `
                        <div class="row w-100">
                            <div class="offset-md-8 col-md-4 col-sm-12">
                                <div class="row">
                                    <button type="button" class="col-2 btn btn-primary">${this.#page}</button>
                                    &nbsp;
                                    <button type="button" class="col-2 btn btn-light">></button>
                                    &nbsp;
                                    <button type="button" class="col-2 btn btn-light">>>></button>                
                                </div>
                            </div>    
                        </div>`;
                } else { //end
                    return `
                        <div class="row w-100">
                            <div class="offset-md-8 col-md-4 col-sm-12">
                                <div class="row">
                                    <button type="button" class="col-2 btn btn-light"><<<</button>
                                    &nbsp;
                                    <button type="button" class="col-2 btn btn-light"><</button>
                                    &nbsp;
                                    <button type="button" class="col-2 btn btn-primary">${this.#page}</button>                
                                </div>
                            </div>    
                        </div>`;
                }
                break;
            case 5:
                return `
                <div class="row w-100">
                    <div class="offset-md-8 col-md-4 col-sm-12">
                        <div class="row">
                            <button type="button" class="col-2 btn btn-light"><<<</button>
                            &nbsp;
                            <button type="button" class="col-2 btn btn-light"><</button>
                            &nbsp;
                            <button type="button" class="col-2 btn btn-primary">${this.getRealPage()}</button>
                            &nbsp;
                            <button type="button" class="col-2 btn btn-light">></button>
                            &nbsp;
                            <button type="button" class="col-2 btn btn-light">>>></button>                
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
     * @param userRow
     * @return {string}
     */
    getUserRow(userRow) {
        let html = '';
        let objKeys = Object.keys(userRow);
        for (const assocJsonKey in this.#assoc_json)
            if(assocJsonKey === 'null'){
                html = html + `<td>${this.getAuthList(userRow)}</td>`;
            } else if (objKeys.includes(assocJsonKey))
                html = html + `<td>${userRow[assocJsonKey]}</td>`;

        if(Object.keys(this.#assoc_json).includes('actions')){
            html = html + `<td>
                <button type="button" class="btn btn-warning">Modifica</button>
                &nbsp;
                <button type="button" class="btn btn-danger">Elimina</button>
                </td>`;
        }

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

    /**
     * @param {UserDto} userRowElement
     * @return {string}
     */
    getAuthList(userRowElement) {
        if(!userRowElement.isUser && !userRowElement.isSmm && !userRowElement.isAdmin)
            return ' - ';
        let html = `<ul>`;
        if(userRowElement.isUser)
            html = html + `<li>User</li>`;
        if(userRowElement.isSmm)
            html = html + `<li>Social Media Manager</li>`;
        if(userRowElement.isAdmin)
            html = html + `<li>Moderator</li>`;
        html = html + `</ul>`;
        return html;
    }

    /**
     * @return {number}
     */
    getNumberOfButtonsRequired(){
        if(this.#page === this.getMaxPage() && this.getMaxPage() === 1)
            return 0;
        //From here we have multiple pages!

        if(this.#page === 1) //At the start
            return 3;

        if(this.#page === this.getMaxPage()) //At the end
            return 3;

        return 5; //Between the pages
    }


}