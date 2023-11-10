const autoload = require("../autoload/autoload");
const Controller = require("./Controller");
const QuoteDto = require("../entities/dtos/QuoteDto");

module.exports = class QuoteController extends Controller {
  constructor(model) {
    super();
    this._model = model;
  }

  /**
   * @param {string} username
   * @return {Promise<{msg: string, code: number, content: {}}>}
   * Given an username returns the quota in standard controller output.
   */
  async getQuote(username) {
    let out = this.getDefaultOutput();
    let quote = await this._model.getQuote(username);
    if (!(quote instanceof QuoteDto)) {
      out["code"] = 404;
      out["msg"] = "Not found";
      return out;
    }
    out["content"] = quote.getDocument();
    return out;
  }

    /**
     @param username {string}
     @return Promise<{msg: string, code: number, content: {}}>
      precondition: user exist, already checked in createUser
     */
    async createQuote(username) {
        let output = this.getDefaultOutput();
        let quoteObj = new QuoteDto();
        quoteObj.id = username;
        quoteObj.remaining_daily = autoload.config._QUOTE_DEFAULT_DAILY;
        quoteObj.remaining_weekly = autoload.config._QUOTE_DEFAULT_WEEKLY;
        quoteObj.remaining_monthly = autoload.config._QUOTE_DEFAULT_MONTHLY;
        quoteObj.limit_daily = quoteObj.remaining_daily;
        quoteObj.limit_weekly = quoteObj.remaining_weekly;
        quoteObj.limit_monthly = quoteObj.remaining_monthly;

        let dataBaseRes = await this._model.createQuote(quoteObj);
        if (dataBaseRes) output["content"] = quoteObj;
        else {
            output["code"] = 500;
            output["msg"] = "Error creating quote in db";
        }
        return output;
    }

    /**
     * @param username {string}
     * @return Promise<{msg: string, code: number, content: {}}>
     */
    async deleteQuote(username) {
        let output = this.getDefaultOutput();
        let quoteObj = await this.getQuote(username);
        if (quoteObj["code"] !== 200) {
            output["code"] = 404;
            output["msg"] = "Not found";
            return output;
        }

        //Quota exists. Delete its.
        let result = await this._model.deleteQuote(username);
        if (result === false) {
            output["code"] = 500;
            output["msg"] = "Server error.";
        }

        return output;
    }

  /**
   * @param {UserDto} userAuth
   * @param {string} username
   * @param {number} percentage
   * @return {Promise<{msg: string, code: number, content: {}}>}
   */
  async applyPercentageQuote(userAuth, username, percentage) {
    let output = this.getDefaultOutput();
    if (this.isObjectVoid(userAuth)) {
      output["code"] = 403;
      output["msg"] = "Forbidden";
      return output;
    }

        if (userAuth.isAdmin === false) {
            output["code"] = 401;
            output["msg"] = "Sorry you are not an admin";
            return output;
        }

    if (percentage < 0 || percentage > 10000) {
      output["code"] = 400;
      output["msg"] = "Percentage noi in [0, 10000] range. Bad request.";
      return output;
    }

        let userQuote = await this.getQuote(username);
        if (userQuote["code"] === 404) {
            output["code"] = 404;
            output["msg"] = "Not found";
            return output;
        } else if (userQuote["code"] !== 200) {
            output["code"] = 500;
            output["msg"] = "Internal server error";
      return output;
    }
    //Quote found! :D

    let quoteDto = new QuoteDto(userQuote.content);
    quoteDto.limit_daily = Math.floor(
      quoteDto.limit_daily * (percentage / 100)
        );
    quoteDto.limit_weekly = Math.floor(
            quoteDto.limit_weekly * (percentage / 100)
        );
        quoteDto.limit_monthly = Math.floor(
            quoteDto.limit_monthly * (percentage / 100)
        );
        quoteDto.remaining_daily = Math.floor(
            quoteDto.remaining_daily * (percentage / 100)
        );
        quoteDto.remaining_weekly = Math.floor(
            quoteDto.remaining_weekly * (percentage / 100)
        );
        quoteDto.remaining_monthly = Math.floor(
            quoteDto.remaining_monthly * (percentage / 100)
        );

        let modelOut = this._model.patchQuote(quoteDto);
        if (modelOut === false) {
            output["code"] = 500;
            output["msg"] = "Internal server error";
            return output;
        }

        output["content"] = quoteDto.getDocument();

        return output;
    }




  //There are no controls because it's a system function
  async resetQuote(userList) {
    let today = new Date();

    //modifica il campo desiderato in ciascund username
    for (let userDto of userList) {
      let username = userDto.username;
      let quote = await this.getQuote(username);
      if (quote["code"] !== 200) {
        continue;
      }

      let quoteDto = new QuoteDto(quote['content']);
      quoteDto.remaining_daily = quoteDto.limit_daily;
      //primo giorno della settimana
      if (today.getDay() === 1) {
        quoteDto.remaining_weekly = quoteDto.limit_weekly;
      }
      //primo giorno del mese
      if (today.getDate() === 1) {
        quoteDto.remaining_monthly = quoteDto.limit_monthly;
      }
      //usiamo il model
      await this._model.patchQuote(quoteDto);
    }
  }


    /**
     * @param {string} oldUsername
     * @param {string} newUsername
     * @return {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async changeUsernameQuota(oldUsername, newUsername) {
        let output = this.getDefaultOutput();
        //no controls to do here.
        let quota = await this._model.getQuote(oldUsername);

        if (!(quota instanceof QuoteDto)) {
            output["code"] = 404;
            output["msg"] = "Not found";
            return output;
        }

        let result = await this.deleteQuote(oldUsername);
        if(result['code'] !== 200){
            output["code"] = 500;
            output["msg"] = "Internal server error. QuoteController::changeUsernameQuota - 1";
            return output;
        }

        quota.id = newUsername;
        result = await this._model.createQuote(quota);
        if(result === false){
            output['code'] = 500;
            output['msg'] = 'Internal server error QuoteController::changeUsernameQuota - 2';
        }

        return output;
    }

    /**
     *
     * @param {string} username
     * @param {number} debitQuota
     * @return {Promise<{msg: string, code: number, sub_code: number, content: {}}>}
     */
    async chargeLimitQuota(username, debitQuota) {
        let output = this.getDefaultOutput();
        let quoteRes = await this.getQuote(username);

        if(quoteRes.code !== 200){
            output['code'] = 404;
            output['msg'] = 'Not found.';
            return output;
        }
        quoteRes = new QuoteDto(quoteRes.content);

        if(quoteRes.remaining_daily < debitQuota){
            output['code'] = 412;
            output['msg'] = 'Daily quote not available';
            return output;
        }

        if(quoteRes.remaining_weekly < debitQuota){
            output['code'] = 412;
            output['msg'] = 'Weekly quote not available';
            return output;
        }

        if(quoteRes.remaining_monthly < debitQuota){
            output['code'] = 412;
            output['msg'] = 'Monthly quote not available';
            return output;
        }

        quoteRes.remaining_daily = quoteRes.remaining_daily - debitQuota;
        quoteRes.remaining_weekly = quoteRes.remaining_weekly - debitQuota;
        quoteRes.remaining_monthly = quoteRes.remaining_monthly - debitQuota;

        let response = await this._model.patchQuote(quoteRes);
        if(response === false){
            output['code'] = 500;
            output['msg'] = 'Internal server error';
            return output;
        }

        return output;
    }

};
