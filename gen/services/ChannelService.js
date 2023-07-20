/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Delete the channel
*
* channelUnderscorename String 
* no response value expected for this operation
* */
const channelChannelNameDELETE = ({ channelUnderscorename }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        channelUnderscorename,
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
* Get channel information
*
* channelUnderscorename String 
* returns Channel
* */
const channelChannelNameGET = ({ channelUnderscorename }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        channelUnderscorename,
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
* Update the channel
* Update the channel with his name in path with the passed Channel object in the body.
*
* channelUnderscorename String 
* channel Channel new Channel object
* no response value expected for this operation
* */
const channelChannelNamePUT = ({ channelUnderscorename, channel }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        channelUnderscorename,
        channel,
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
* Create the channel
* Create the channel in the request body
*
* channel Channel new Channel object
* no response value expected for this operation
* */
const channelPOST = ({ channel }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        channel,
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
  channelChannelNameDELETE,
  channelChannelNameGET,
  channelChannelNamePUT,
  channelPOST,
};
