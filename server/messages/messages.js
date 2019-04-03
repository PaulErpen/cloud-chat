function sendMessage(data) {
    var msg = data.message;
    var currentdate = new Date();
    var timestamp = currentdate.getDate() + "."
        + currentdate.getMonth() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
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

function sendBroadcast(io, data) {
    var msg = data.message;
    var username = data.username;
    var currentdate = new Date();
    var timestamp = currentdate.getDate() + "."
        + currentdate.getMonth() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    io.emit(
      'new broadcast', 
      {"payload":msg, 
      "timestamp":timestamp, 
      "username":username, 
      "type":"broadcast"
    });
}

module.exports = {
    "sendMessage": sendMessage,
    "sendBroadcast": sendBroadcast
};