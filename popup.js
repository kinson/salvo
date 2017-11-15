'use strict';

const EventEmitter = require('events').EventEmitter;
const bind = require('lodash').bind;
const opn = require('opn');
const http = require('http');

module.exports = class Popup extends EventEmitter {

  constructor() {
    super();
    this._open = false;
    this._loadStopCallback = event => {
      this.emit('loadstop', event);
    };
    this._eventListeners = {
      loadStopCallback: bind(this._loadStopCallback, this)
    };

  }

  open(uri = '/') {
    if (this._open === false) {
      opn(uri, { app: 'google chrome' });
      const server = http.createServer((req, res) => {
        req.url = req.headers.referer;
        this.emit('loadstop', req);
        res.end();
        server.close();
      }).listen(8085);
    }

    return this;
  }

  close() {
    if (this._open) {
      this._open = false;
    }

    return this;
  }
};
