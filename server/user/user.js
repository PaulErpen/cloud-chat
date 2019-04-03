const express = require('express');

/**
 * Returns User if it exists in users, else returns false
 * @param username
 * @param password
 * @returns {*}
 */
function login (username, password) {
    var user = users.filter(u => u.username == username && u.password == password);
    if(user.length > 0) {
        return {"username" : username, "password" : password};
    } else {
        return false;
    }
}

/**
 * Tests if user exists in user
 * true: returns false
 * false: adds new user to user and returns user
 * @param username
 * @param password
 * @returns {*}
 */
function register (username, password) {
    var user = users.filter(u => u.username == username);
    if(user.length > 0) {
        return false;
    } else {
        users.push({"username" : username, "password" : password});
        return {"username" : username, "password" : password};
    }
}

module.exports = {
    login : login,
    register: register
};