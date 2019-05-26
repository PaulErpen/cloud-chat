const loginMessage = " entered the chatroom.";
const logoutMessage = " exited the chatroom.";

function userLogin(username, socket) {
    return new Promise(function(resolve, reject) {
        if(!online_user_names.includes(username)) {
            online_user_names.push(username);
        }
        online_user_sockets[username] = {"socket": socket, "username": username};
    
        io.emit('user update', {"users": online_user_names});
        resolve(username + loginMessage);
    });
}

function loginRemoteUser(username) {
    return new Promise(function(resolve, reject) {
        if(!online_user_names.includes(username)) {
            online_user_names.push(username);
        }
        io.emit('user update', {"users": online_user_names});
        resolve(username + loginMessage);
    });
}

function logoutRemoteUser(username) {
    return new Promise(function(resolve, reject) {
        online_user_names = online_user_names.filter(u => u != username);

        io.emit('user update', {"users": online_user_names});
        resolve(username + logoutMessage);
    });
}

function logoutOnDisconnect(socket) {
    return new Promise(function(resolve, reject) {
        var username;
        for (const key in online_user_sockets) {
            if(online_user_sockets[key].socket.id == socket.id) {
                username = key;
            }
        }

        if(username != undefined) {
            resolve(userLogout(username, socket));
        }
        else {
            if(username != undefined)
                resolve(userLogout("Error: "+username+ " was never logged in. "+username));
        }
    });
}

function userLogout(username, socket) {
    return new Promise(function(resolve, reject) {
        online_user_names = online_user_names.filter(u => u != username);

        online_user_sockets = Object.keys(online_user_sockets)
        .filter(u => u != username)
        .reduce((obj, key) => {
            obj[key] = online_user_sockets[key];
            return obj;
        }, {}
        );

        io.emit('user update', {"users": online_user_names});
        resolve(username + logoutMessage);
    });
}

module.exports =  {
    "userLogin": userLogin,
    "loginRemoteUser": loginRemoteUser,
    "logoutRemoteUser": logoutRemoteUser,
    "logoutOnDisconnect": logoutOnDisconnect
}