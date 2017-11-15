'use strict';

const rp = require('request-promise');

const krequest = (authString, req = {}) => {
  return rp({
    url: `https://baas.kinvey.com/appdata/${process.env.INTEGRATION_TEST_KID}/${req.endpoint || ''}`,
    headers: Object.assign(req.headers || {}, { 'authorization': `Kinvey ${authString}` }),
    method: req.method || 'GET',
    body: req.body ? JSON.stringify(req.body) : ''
  });
};

module.exports = krequest;
