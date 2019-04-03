function sendMessage(data) {
    var msg = data.message;
    var timestamp = getCurrentTimestamp();

    for(var i = 0; i < data.selectedUsers.length; i++) {
      var username = data.selectedUsers[i];
      online_user_sockets[username].socket.emit('new message',
        {"payload":msg, 
        "timestamp":timestamp, 
        "username":data.username, 
        "type":"message",
        "users": data.selectedUsers
      });
    }
}

function sendBroadcast(data) {
    var msg = data.message;
    var username = data.username;
    var timestamp = getCurrentTimestamp();

    io.emit(
      'new broadcast', 
      {"payload":msg, 
      "timestamp":timestamp, 
      "username":username, 
      "type":"broadcast"
    });
}

function sendFileBroadcast(message, username, filelink, filename) {
    var timestamp = getCurrentTimestamp();

    io.emit(
      'new broadcast',
      {"payload":message,
      "filename": filename,
      "filelink": filelink,
      "timestamp":timestamp, 
      "username":username, 
      "type":"filebroadcast"
    });
}

function sendFileMessage(message, username, filelink, filename, selectedUsers) {
    var timestamp = getCurrentTimestamp();

    for(var i = 0; i < selectedUsers.length; i++) {
        var userid = selectedUsers[i];
        online_user_sockets[userid].socket.emit('new message',
        {"payload":message,
        "filename": filename,
        "filelink": filelink,
        "timestamp":timestamp, 
        "username":username, 
        "type":"filemessage",
        "users": selectedUsers
        });
    }
}

function getCurrentTimestamp() {
    var currentdate = new Date();
    return currentdate.getDate() + "."
        + currentdate.getMonth() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
}

module.exports = {
    "sendMessage": sendMessage,
    "sendBroadcast": sendBroadcast,
    "sendFileBroadcast": sendFileBroadcast,
    "sendFileMessage": sendFileMessage
};