/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Get the squeal to see of the user
*
* last String Last squeal identifier received from client. This parameter is used to get the user logged content to see after the specified identifier. If not present return the first posts to see. (optional)
* returns List
* */
const squealGET = ({ last }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        last,
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
* Delete the squeal
*
* identifierUnderscoreid Integer 
* no response value expected for this operation
* */
const squealIdentifierIdDELETE = ({ identifierUnderscoreid }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        identifierUnderscoreid,
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
* Update the squeal
* Update the squeal with his identifier in path with the passed Squeal object in the body. The quota used by the final post is the maximum between the old quota and the newer
*
* identifierUnderscoreid Integer 
* newUnderscoresqueal Squeal new Squeal object
* no response value expected for this operation
* */
const squealIdentifierIdPUT = ({ identifierUnderscoreid, newUnderscoresqueal }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        identifierUnderscoreid,
        newUnderscoresqueal,
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
* Create a new squeal
*
* newUnderscoresqueal Squeal Squeal object to add
* returns Object
* */
const squealPOST = ({ newUnderscoresqueal }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        newUnderscoresqueal,
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
  squealGET,
  squealIdentifierIdDELETE,
  squealIdentifierIdPUT,
  squealPOST,
};
