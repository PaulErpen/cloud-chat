var messages = require('../messages/messages');

function userLogin(data) {
    if(!online_user_names.includes(data.username)) {
        online_user_names.push(data.username);
    }
    online_user_sockets[data.username] = {"socket": socket, "username": data.username};

    io.emit('user update', {"users": online_user_names});
    messages.sendServerMessage(data.message);
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
    messages.sendServerMessage(data.message);
}

module.exports =  {
    "userLogin": userLogin,
    "userLogout": userLogout
}