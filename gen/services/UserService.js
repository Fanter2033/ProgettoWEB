/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Create the user
* Create the user in the request body
*
* user User new User object
* no response value expected for this operation
* */
const userPOST = ({ user }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        user,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Delete the specified user
* Delete the specified user only if the request is made by the deleting user of if is done from a Squealer admin
*
* username String 
* no response value expected for this operation
* */
const userUsernameDELETE = ({ username }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        username,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Get the information about the user
*
* username String 
* returns List
* */
const userUsernameGET = ({ username }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        username,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Update the user
* This method can be user only from the logged user or the Squealer admin.
*
* username String Update server status
* body User new User object
* no response value expected for this operation
* */
const userUsernamePUT = ({ username, body }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        username,
        body,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  userPOST,
  userUsernameDELETE,
  userUsernameGET,
  userUsernamePUT,
};
