/**
 * This helper file provides a set of functions for communicating with the
 * backend API. It will work on both the backend and the frontend.
 */

const ajax = require('./ajax');

const api = {};

if(process.env.IN_BROWSER) {
  api.baseUrl = '/api';
} else {
  api.baseUrl = 'http://api:3000';
}

api.get = function(path) {
  return ajax.request({
    method: 'GET',
    url: this.baseUrl + path,
    json: true
  });
};

api.post = function(path, data) {
  return ajax.request({
    method: 'POST',
    url: this.baseUrl + path,
    json: true,
    data
  });
};

api.put = function(path, data) {
  return ajax.request({
    method: 'PUT',
    url: this.baseUrl + path,
    json: true,
    data
  });
};

api.delete = function(path) {
  return ajax.request({
    method: 'DELETE',
    url: this.baseUrl + path,
    json: true
  });
};

module.exports = api;
