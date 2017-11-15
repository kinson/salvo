'use strict';

const Kinvey = require('kinvey-js-sdk');
const NetworkRack = require('kinvey-js-sdk/dist/export').NetworkRack;
const MobileIdentityConnect = require('kinvey-js-sdk/dist/identity').MobileIdentityConnect;
const HttpMiddleware = require('./http');
const Popup = require('./popup');
const fs = require('fs');

let AUTH_PATH = './auth';
const readInAuth = () => {
  if (!fs.existsSync(AUTH_PATH)) {
    return false;
  }
  const fileContents = fs.readFileSync(AUTH_PATH);
  const jsonData = JSON.parse(fileContents);
  const timeNow = new Date().getTime() / 1000;
  // if the token is older than 50 minutes it is expired and needs to be refreshed, should not be reused
  if (timeNow - jsonData.time > 3000) {
    return false;
  }
  return jsonData.token;
};

const getToken = () => {

  const existingToken = readInAuth();
  return new Promise(resolve => {
    if (existingToken !== false) {
      return resolve(existingToken);
    }

    return Kinvey.User.loginWithMIC('http://localhost:8085')
      .then(user => {
        const authString = user.data._kmd.authtoken;
        fs.writeFile(AUTH_PATH, JSON.stringify({
          token: authString,
          time: (new Date().getTime() / 1000)
        }), err => {
          if (err) {
            console.log(err);
          }
        });
        resolve(authString);
      }).catch(error => {
        console.log('was an error');
        console.log(error);
      });
  });
};

const loadMiddlewareKIDAndToken = authPath => {
  if (authPath && authPath !== '') {
    AUTH_PATH = `${authPath}auth`;
  }

  NetworkRack.useHttpMiddleware(new HttpMiddleware());
  MobileIdentityConnect.usePopupClass(Popup);
  require('dotenv').config();
  Kinvey.initialize({
    appKey: process.env.INTEGRATION_TEST_KID,
    appSecret: process.env.INTEGRATION_TEST_APP_SECRET
  });

  return getToken();
};

module.exports = loadMiddlewareKIDAndToken;
