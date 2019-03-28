const express = require('express');

function login (username, password) {
    var user = users.filter(u => u.username == username && u.password == password);
    return user.length > 0;
}

function register (username, password) {
    var user = users.filter(u => u.username == username);
    if(user.length > 0) {
        return false;
    } else {
        users.push({"username" : username, "password" : password});
        return true;
    }
}

module.exports = {
    login : login,
    register: register
};