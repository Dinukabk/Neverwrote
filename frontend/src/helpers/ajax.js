/**
 * This helper file provides a set of functions for performing HTTP requests.
 * It will work on both the backend and the frontend.
 */

const ajax = {};

if(process.env.IN_BROWSER) {
  ajax.request = opts => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('error', () => {
      reject(new Error('Request failed'));
    });
    xhr.addEventListener('load', () => {
      if(xhr.status !== 200) {
        reject(new Error(`Received status ${xhr.status}`));
      } else {
        resolve(opts.json ? JSON.parse(xhr.responseText) : xhr.responseText);
      }
    });
    xhr.open(opts.method, opts.url);
    if(opts.json) {
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(opts.data !== undefined ? JSON.stringify(opts.data) : opts.data);
    } else {
      xhr.send(opts.data);
    }
  });
} else {
  const request = require('request');

  ajax.request = opts => new Promise((resolve, reject) => {
    request({
      url: opts.url,
      method: opts.method,
      body: opts.data,
      json: opts.json
    }, (error, response, body) => {
      if(error) {
        reject(error);
      } else if(response.statusCode !== 200) {
        reject(new Error(`Received status ${response.statusCode}`));
      } else {
        resolve(body);
      }
    });
  });
}

module.exports = ajax;
