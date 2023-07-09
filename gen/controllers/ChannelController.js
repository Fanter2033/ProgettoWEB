/**
 * The ChannelController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic reoutes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

const Controller = require('./Controller');
const service = require('../services/ChannelService');
const channelChannelNameDELETE = async (request, response) => {
  await Controller.handleRequest(request, response, service.channelChannelNameDELETE);
};

const channelChannelNameGET = async (request, response) => {
  await Controller.handleRequest(request, response, service.channelChannelNameGET);
};

const channelChannelNamePUT = async (request, response) => {
  await Controller.handleRequest(request, response, service.channelChannelNamePUT);
};

const channelPOST = async (request, response) => {
  await Controller.handleRequest(request, response, service.channelPOST);
};


module.exports = {
  channelChannelNameDELETE,
  channelChannelNameGET,
  channelChannelNamePUT,
  channelPOST,
};
