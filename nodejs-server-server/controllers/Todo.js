'use strict';

var url = require('url');

var Todo = require('./TodoService');

module.exports.todoGET = function todoGET (req, res, next) {
  Todo.todoGET(req.swagger.params, res, next);
};

module.exports.todoPOST = function todoPOST (req, res, next) {
  Todo.todoPOST(req.swagger.params, res, next);
};
