module.exports = class AuthenticationAttempt {

    constructor(ipAddress, timestamp, serverResponse, user, role) {
        this.ipAddress = ipAddress;
        this.timestampStart = timestamp;
        this.timestampEnd = timestamp;
        this.serverResponseCode = serverResponse;
        this.requestedUsername = user;
        this.requestedRole = role;
    }

    /**
     * @param timestamp
     */
    setTimestampEnd(timestamp) {
        this.timestampEnd = timestamp;
    }

    /**
     * @param {number} serverResponse
     */
    setServerResponseCode(serverResponse) {
        this.serverResponseCode = serverResponse;
    }

}