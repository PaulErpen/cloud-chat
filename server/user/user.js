const express = require('express');

function login (username, password) {
    var user = users.filter(u => u.username == username && u.password == password);
    if(user.length > 0) {
        return {"username" : username, "password" : password};
    } else {
        return false;
    }
}

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