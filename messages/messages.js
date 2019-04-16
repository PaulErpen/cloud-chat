const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
});
const messageCounter = 0;

function sendMessage(data) {
    var msg = data.message;
    var timestamp = getCurrentTimestamp();
    console.log(getMessageMood(msg));
    var messagePayload = {
      "messageid": 0,
      "payload":msg,
      "file": {
        "filename": "",
        "filelink": "",
      },
      "timestamp":timestamp, 
      "username":data.username, 
      "type":"message",
      "users": data.selectedUsers
    };

    messageCounter++;
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

    console.log(getMessageMood(msg));

    io.emit(
      'new broadcast', 
      {
        "messageid": 0,
        "payload":msg,
        "file": {
          "filename": "",
          "filelink": "",
        },
        "timestamp":timestamp, 
        "username":username, 
        "type":"broadcast",
        "users": []     
      });

    messageCounter++;
}

function sendFileBroadcast(message, username, filelink, filename) {
    var timestamp = getCurrentTimestamp();

    io.emit(
      'new broadcast',
      {
        "messageid": 0,
        "payload":message,
        "file": {
          "filename": filename,
          "filelink": filelink
        },
        "timestamp":timestamp, 
        "username":username, 
        "type":"filebroadcast",
        "users": []
      });
    messageCounter++;
}

function sendFileMessage(message, username, filelink, filename, selectedUsers) {
  var timestamp = getCurrentTimestamp();
  var messagePayload = {
    "messageid": 0,
    "payload":message,
    "file": {
      "filename": filename,
      "filelink": filelink
    },
    "timestamp":timestamp, 
    "username":username, 
    "type":"filemessage",
    "users": selectedUsers
  };
  messageCounter++;
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
  io.emit('new message', {
    "messageid": 0,
    "payload":message,
    "file": {
      "filename": "",
      "filelink": ""
    },
    "timestamp": getCurrentTimestamp(), 
    "username":"", 
    "type":"server",
    "users": []    
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

function getMessageMood(message) {
  const toneRequest = createToneRequest([message]);
  if (toneRequest) {
    toneAnalyzer.toneChat(toneRequest, (err, response) => {
      if (err) {
        return next(err);
      }
      return response;
    });
  }
  else {
    return undefined;
  }
}

function happyOrUnhappy (response) {
  const happyTones = ['satisfied', 'excited', 'polite', 'sympathetic'];
  const unhappyTones = ['sad', 'frustrated', 'impolite'];

  let happyValue = 0;
  let unhappyValue = 0;

  for (let i in response.utterances_tone) {
    const utteranceTones = response.utterances_tone[i].tones;
    for (let j in utteranceTones) {
      if (happyTones.includes(utteranceTones[j].tone_id)) {
        happyValue = happyValue + utteranceTones[j].score;
      }
      if (unhappyTones.includes(utteranceTones[j].tone_id)) {
        unhappyValue = unhappyValue + utteranceTones[j].score;
      }
    }
  }
  if (happyValue >= unhappyValue) {
    return 'happy';
  }
  else {
    return 'unhappy';
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