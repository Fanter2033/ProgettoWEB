/**
 * The UserController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/UserService');
const userPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.userPOST);
};

const userUsernameDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.userUsernameDELETE);
};

const userUsernameGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.userUsernameGET);
};

const userUsernamePUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.userUsernamePUT);
};


module.exports = {
  userPOST,
  userUsernameDELETE,
  userUsernameGET,
  userUsernamePUT,
};
