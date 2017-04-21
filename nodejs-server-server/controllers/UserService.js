'use strict';

exports.createUsersWithArrayInput = function(args, res, next) {
  /**
   * Creates list of users with given input array
   * 
   *
   * body List List of user object
   * no response value expected for this operation
   **/
  res.end();
}

exports.createUsersWithListInput = function(args, res, next) {
  /**
   * Creates list of users with given input array
   * 
   *
   * body List List of user object
   * no response value expected for this operation
   **/
  res.end();
}

exports.getUserByName = function(args, res, next) {
  /**
   * Get user by user name
   * 
   *
   * username String username of the uesr
   * returns User
   **/
  var examples = {};
  examples['application/json'] = {
  "password" : "aeiou",
  "id" : 123456789,
  "username" : "aeiou"
};
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.loginUser = function(args, res, next) {
  /**
   * Logs user into the system
   * 
   *
   * username String The user name for login
   * password String The password for login in clear text
   * returns String
   **/
  var examples = {};
  examples['application/json'] = "aeiou";
  if (Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  } else {
    res.end();
  }
}

exports.logoutUser = function(args, res, next) {
  /**
   * Logs out current logged in user session
   * 
   *
   * no response value expected for this operation
   **/
  res.end();
}

exports.updateUser = function(args, res, next) {
  /**
   * Updated user
   * This can only be done by the logged in user.
   *
   * username String name that need to be updated
   * body User Updated user object
   * no response value expected for this operation
   **/
  res.end();
}

