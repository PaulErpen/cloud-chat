const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
});
var messageCounter = 0;

function sendMessage(data) {
    var msg = data.message;
    var timestamp = getCurrentTimestamp();
    var messageid = getUniqueMessageKey();
    getMessageMood(msg, messageid);

    var messagePayload = {
      "messageid": messageid,
      "payload":msg,
      "file": {
        "filename": "",
        "filelink": "",
      },
      "timestamp":timestamp, 
      "username":data.username, 
      "type":"message",
      "users": data.selectedUsers,
      "mood":""
    };

    for(var i = 0; i < data.selectedUsers.length; i++) {
      var username = data.selectedUsers[i];
      online_user_sockets[username].socket.emit('new message',
        messagePayload);
    }
    online_user_sockets[data.username].socket.emit('new message',
    messagePayload);
}

function sendBroadcast(data) {
    var msg = data.message;
    var username = data.username;
    var timestamp = getCurrentTimestamp();
    var messageid = getUniqueMessageKey();

    getMessageMood(msg, messageid);

    io.emit(
      'new broadcast', 
      {
        "messageid": messageid,
        "payload":msg,
        "file": {
          "filename": "",
          "filelink": "",
        },
        "timestamp":timestamp, 
        "username":username, 
        "type":"broadcast",
        "users": [],
        "mood":""
      });

}

function sendFileBroadcast(message, username, filelink, filename) {
    var timestamp = getCurrentTimestamp();
    var messageid = getUniqueMessageKey();

    io.emit(
      'new broadcast',
      {
        "messageid": messageid,
        "payload":message,
        "file": {
          "filename": filename,
          "filelink": filelink
        },
        "timestamp":timestamp, 
        "username":username, 
        "type":"filebroadcast",
        "users": [],
        "mood":""
      });
}

function sendFileMessage(message, username, filelink, filename, selectedUsers) {
  var timestamp = getCurrentTimestamp();
  var messageid = getUniqueMessageKey();
  var messagePayload = {
    "messageid": messageid,
    "payload":message,
    "file": {
      "filename": filename,
      "filelink": filelink
    },
    "timestamp":timestamp, 
    "username":username, 
    "type":"filemessage",
    "users": selectedUsers,
    "mood":""
  };
  for(var i = 0; i < selectedUsers.length; i++) {
    var userid = selectedUsers[i];
    online_user_sockets[userid].socket.emit(
      'new message',
      messagePayload
    );
  }
  online_user_sockets[username].socket.emit(
    'new message',
    messagePayload
  );
}

function sendServerMessage(message) {
  var messageid = getUniqueMessageKey();
  io.emit('new message', {
    "messageid": messageid,
    "payload":message,
    "file": {
      "filename": "",
      "filelink": ""
    },
    "timestamp": getCurrentTimestamp(), 
    "username":"", 
    "type":"server",
    "users": [],
    "mood":""
  });
}

function getCurrentTimestamp() {
    var currentdate = new Date();
    return currentdate.getDate() + "."
        + currentdate.getMonth() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
}

function getUniqueMessageKey() {
  messageCounter++;
  return messageCounter;
}

function getMessageMood(message, id) {
  const toneRequest = createToneRequest([message]);
  if (toneRequest) {
    toneAnalyzer.toneChat(toneRequest, (err, response) => {
      if (err) {
        io.emit('update message', {
          "messageid": id,
          "mood":"not able to determine mood"
        });
      } else {
        var moods = "";
        for (const key in response.utterances_tone[0].tones) {
          if(key>0) {moods+=", "};
          moods += response.utterances_tone[0].tones[key].tone_name;
        }
        io.emit('update message', {
          "messageid": id,
          "mood": moods
        });
      }
    });
  }
}

function createToneRequest (messages) {
  let toneChatRequest;

  if (messages) {
    toneChatRequest = {utterances: []};

    for (let i in messages) {
      const utterance = {text: messages[i]};
      toneChatRequest.utterances.push(utterance);
    }
  }

  return toneChatRequest;
}

module.exports = {
    "sendMessage": sendMessage,
    "sendBroadcast": sendBroadcast,
    "sendFileBroadcast": sendFileBroadcast,
    "sendFileMessage": sendFileMessage,
    "sendServerMessage": sendServerMessage
};