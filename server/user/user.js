const express = require('express');

function login (username, password) {
    var user = users.filter(u => u.username == username && u.password == password);
    if(user.length > 0) {
        online_user.push({"username": username});
        io.emit('online users', online_user);
        return {"username" : username, "password" : password};
    } else {
        return false;
    }
}

function logout (username) {
    var user = online_user.filter(u => u.username == username);
    console.log("User: " + user);
    if(user.length > 0) {
        var index = online_user.findIndex(obj => obj.username== username);
        console.log("Index: " + index);
        online_user.splice(index, 1); // at position index remove 1 item
        console.log(online_user.length);
        io.emit('online users', online_user);
        return true;
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
        online_user.push({"username": username});
        io.emit('online users', online_user);
        return {"username" : username, "password" : password};
    }
}

module.exports = {
    login : login,
    logout: logout,
    register: register
};