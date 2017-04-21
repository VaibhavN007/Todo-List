'use strict';

exports.todoGET = function(args, res, next) {
  /**
   * Get all the tasks
   * 
   *
   * returns List
   **/
  var examples = {};
  examples['application/json'] = [ {
  "task" : "aeiou",
  "id" : 123456789,
  "completed" : true
} ];
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.todoPOST = function(args, res, next) {
  /**
   * Add a new todo task in the db
   * 
   *
   * task Todo Todo task to be added to Todo table
   * no response value expected for this operation
   **/
  res.end();
}

