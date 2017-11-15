'use strict';

const Middleware = require('kinvey-js-sdk/dist/export').Middleware;
const NetworkConnectionError = require('kinvey-js-sdk/dist/export').NetworkConnectionError;
const TimeoutError = require('kinvey-js-sdk/dist/export').TimeoutError;
const isDefined = require('kinvey-js-sdk/dist/export').isDefined;
const request = require('request');

module.exports = class HttpMiddleware extends Middleware {
  constructor(name = 'Http Middleware') {
    super(name);
  }

  handle(requestinfo) {
    const promise = new Promise((resolve, reject) => {
      const { url, method, headers, body, timeout, followRedirect } = requestinfo;

      this.xhrRequest = request(
        {
          method,
          url,
          headers,
          body,
          followRedirect,
          timeout
        },
        (error, response, data) => {
          if (isDefined(error)) {
            if (
              error.code === 'ESOCKETTIMEDOUT' ||
              error.code === 'ETIMEDOUT'
            ) {
              return reject(new TimeoutError('The network request timed out.'));
            }

            return reject(
              new NetworkConnectionError(
                'There was an error connecting to the network.',
                error
              )
            );
          }

          return resolve({
            response: {
              statusCode: response.statusCode,
              headers: response.headers,
              data
            }
          });
        }
      );
    });
    return promise;
  }

  cancel() {
    if (
      isDefined(this.xhrRequest) &&
      typeof this.xhrRequest.abort === 'function'
    ) {
      this.xhrRequest.abort();
    }

    return Promise.resolve();
  }
};
