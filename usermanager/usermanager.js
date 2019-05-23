const messages = require('../messages/messages');
const loginMessage = " entered the chatroom.";
const logoutMessage = " exited the chatroom.";

function userLogin(data) {
    if(!online_user_names.includes(data.username)) {
        online_user_names.push(data.username);
    }
    online_user_sockets[data.username] = {"socket": socket, "username": data.username};

    io.emit('user update', {"users": online_user_names});
    messages.sendServerMessage(data.username + loginMessage);
}

function loginRemoteUser(username) {
    if(!online_user_names.includes(username)) {
        online_user_names.push(username);
    }
    io.emit('user update', {"users": online_user_names});
    messages.sendServerMessage(username + loginMessage);
}

function userLogout(data) {
    online_user_names = online_user_names.filter(u => u != data.username);

    online_user_sockets = Object.keys(online_user_sockets)
      .filter(u => u != data.username)
      .reduce((obj, key) => {
        obj[key] = online_user_sockets[key];
        return obj;
      }, {}
    );

    io.emit('user update', {"users": online_user_names});
    messages.sendServerMessage(data.username + logoutMessage);
}

function logoutRemoteUser(username) {
    online_user_names = online_user_names.filter(u => u != username);

    io.emit('user update', {"users": online_user_names});
    messages.sendServerMessage(username + logoutMessage);
}

module.exports =  {
    "userLogin": userLogin,
    "userLogout": userLogout,
    "loginRemoteUser": loginRemoteUser,
    "logoutRemoteUser": logoutRemoteUser
}