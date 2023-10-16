module.exports = class AuthenticationAttemptDto {
  //sintax js: # private
  #ipAddress;
  #timestampStart;
  #timestampEnd;
  #requestedUsername;
  #requestedRole;
  #serverResponseCode;

  constructor(documentFromMongoose = null) {
    if (documentFromMongoose === null) {
      this.#ipAddress = null;
      this.#timestampStart = null;
      this.#timestampEnd = null;
      this.#requestedUsername = null;
      this.#requestedRole = null;
      this.#serverResponseCode = null;
    } else {
      this.#ipAddress = documentFromMongoose.ipAddress;
      this.#timestampStart = documentFromMongoose.timestampStart;
      this.#timestampEnd = documentFromMongoose.timestampEnd;
      this.#requestedUsername = documentFromMongoose.requestedUsername;
      this.#requestedRole = documentFromMongoose.requestedRole;
      this.#serverResponseCode = documentFromMongoose.serverResponseCode;
    }
  }

  get timestampStart() {
    return this.#timestampStart;
  }

  set timestampStart(value) {
    this.#timestampStart = value;
  }

  get timestampEnd() {
    return this.#timestampEnd;
  }

  set timestampEnd(value) {
    this.#timestampEnd = value;
  }

  get requestedUsername() {
    return this.#requestedUsername;
  }

  set requestedUsername(value) {
    this.#requestedUsername = value;
  }

  get requestedRole() {
    return this.#requestedRole;
  }

  set requestedRole(value) {
    this.#requestedRole = value;
  }

  getDocument() {
    return {
      ipAddress: this.#ipAddress,
      timestampStart: this.#timestampStart,
      timestampEnd: this.#timestampEnd,
      requestedUsername: this.#requestedUsername,
      requestedRole: this.#requestedRole,
      serverResponseCode: this.#serverResponseCode,
    };
  }

  get ipAddress() {
    return this.#ipAddress;
  }

  set ipAddress(value) {
    this.#ipAddress = value;
  }

  get serverResponseCode() {
    return this.#serverResponseCode;
  }

  set serverResponseCode(value) {
    this.#serverResponseCode = value;
  }
};
