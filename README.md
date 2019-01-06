# Salvo

*A framework for writing end-to-end tests with Kinvey and your MIC provider*

## Notes:
* Currently only works with google chrome
* Test access token is stored locally for 55 minutes before requiring a token refresh

## Getting Started
* There are two basic functions that this library provides, authentication and an abstraction for requests sent to Kinvey service object, an example is provided using Salvo with Jest

```js
const krequest = require('salvo').request;
const kauth = require('salvo').auth;

describe('end to end tests', () => {
  let authString = '';
  beforeAll(done => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;
    return kauth('./__tests__/').then(res => {
      authString = res;
      done();
    });
  });

  it('should return app data from Kinvey', done => {
    return krequest(authString).then(res => {
      const result = JSON.parse(res);
      expect(result).toHaveProperty('kinvey', 'hello AppName');
      expect(result).toHaveProperty('appName', 'AppName');
      done();
    });
  });
});
```
