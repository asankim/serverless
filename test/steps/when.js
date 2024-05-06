'use strict';
const _ = require('lodash');
const Promise = this.Promise || require('promise');
var agent = require('superagent-promise')(require('superagent'), Promise);

const makeHttpRequest = async (path, method, options) => {
  let root = process.env.TEST_ROOT;
  let url = options.noteId
    ? `${root}/${path}/${options.noteId}`
    : `${root}/${path}`;
  let httpReq = agent(method, url);
  let body = _.get(options, 'body');
  let idToken = _.get(options, 'idToken');

  try {
    httpReq.set('Authorization', idToken);
    if (body) {
      httpReq.send(body);
    }
    let response = await httpReq;
    //console.log('response:', response);
    return {
      statusCode: response.status,
      body: response.body,
    };
  } catch (error) {
    console.log('error:', error);
    return {
      statusCode: error.status,
      body: null,
    };
  }
};

exports.we_invoke_createNote = async function (options) {
  let response = makeHttpRequest('notes', 'POST', options);
  //console.log('create response:', response);
  return response;
};

exports.we_invoke_updateNote = async function (options) {
  let response = makeHttpRequest('notes', 'PUT', options);
  //console.log('update response:', response);
  return response;
};

exports.we_invoke_deleteNote = async function (options) {
  let response = makeHttpRequest('notes', 'DELETE', options);
  //console.log('update response:', response);
  return response;
};
