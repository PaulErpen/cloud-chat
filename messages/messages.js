const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
const toneAnalyzer = new ToneAnalyzerV3({
  version: '2017-09-21',
});
const LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');
const languageTranslator = new LanguageTranslatorV3({
    version: '2018-05-01',
    iam_apikey: 'WxFRwTlgJTAd5l1PQA2MoxGn2xV4jtJHTqMZ1SYd9Nxi',
    url: 'https://gateway-fra.watsonplatform.net/language-translator/api'
});
var messageCounter = 0;
var userinfo = require('../database/userinfo');
var database = require('../database/database');

function sendMessage(data) {
    var msg = data.message;
    var timestamp = getCurrentTimestamp();
    var messageid = getUniqueMessageKey();
    getMessageMood(msg, messageid);

    var messagePayload = {
      "messageid": messageid,
      "payload":msg,
      "file": "",
      "timestamp":timestamp, 
      "username":data.username, 
      "type":"message",
      "users": data.selectedUsers,
      "mood":""
    };

    online_user_sockets[data.username].socket.emit('new message',
        messagePayload);

    for(var i = 0; i < data.selectedUsers.length; i++) {
        var messagetargetusername = data.selectedUsers[i];
        translateMessage(data, messagetargetusername, messagePayload).then( result => {
            if(result != null) {
                messagePayload.payload = result.message;
                online_user_sockets[result.target].socket.emit('new message', messagePayload);
                messagePayload.payload = msg;
            }
        });
    }
}

function sendBroadcast(data) {
    var msg = data.message;
    var username = data.username;
    var timestamp = getCurrentTimestamp();
    var messageid = getUniqueMessageKey();

    getMessageMood(msg, messageid);

    var messagePayload = {
        "messageid": messageid,
        "payload":msg,
        "file": "",
        "timestamp":timestamp,
        "username":username,
        "type":"broadcast",
        "users": [],
        "mood":""
    };

    online_user_sockets[username].socket.emit('new broadcast',
        messagePayload);

    for(var i = 0; i < online_user_names.length; i++) {
        var broadcasttargetusername = online_user_names[i];
        if(username != broadcasttargetusername) {
            translateMessage(data, broadcasttargetusername, messagePayload).then( result => {
                if(result != null) {
                    messagePayload.payload = result.message;
                    online_user_sockets[result.target].socket.emit('new broadcast', messagePayload);
                    messagePayload.payload = msg;
                }
            });
        }
    }
}

function sendFileBroadcast(data) {
  var messageid =  getUniqueMessageKey();
  var msg = data.message;
  getMessageMood(data.message, messageid);

    var messagePayload = {
        "messageid": messageid,
        "payload": msg,
        "file": data.file,
        "timestamp": getCurrentTimestamp(),
        "username": data.username,
        "type":"filebroadcast",
        "users": [],
        "mood":""
    };

    online_user_sockets[data.username].socket.emit('new filebroadcast',
        messagePayload);

    for(var i = 0; i < online_user_names.length; i++) {
        var filebroadcasttargetusername = online_user_names[i];
        if(data.username != filebroadcasttargetusername) {
            translateMessage(data, filebroadcasttargetusername, messagePayload).then( result => {
                if(result != null) {
                    messagePayload.payload = result.message;
                    online_user_sockets[result.target].socket.emit('new filebroadcast', messagePayload);
                    messagePayload.payload = msg;
                }
            });
        }
    }
}

function sendFileMessage(data) {
    var messageid = getUniqueMessageKey();
    var msg = data.message;
    getMessageMood(msg, messageid);
    var messagePayload = {
        "messageid": messageid,
        "payload": data.message,
        "file": data.file,
        "timestamp": getCurrentTimestamp(),
        "username": data.username,
        "type": "filemessage",
        "users": data.selectedUsers,
        "mood":""
    };

    online_user_sockets[data.username].socket.emit('new message',
        messagePayload);

    for(var i = 0; i < data.selectedUsers.length; i++) {
        var messagetargetusername = data.selectedUsers[i];
        translateMessage(data, messagetargetusername, messagePayload).then( result => {
            if(result != null) {
                messagePayload.payload = result.message;
                online_user_sockets[result.target].socket.emit('new message', messagePayload);
                messagePayload.payload = msg;
            }
        });
    }
}

function sendServerMessage(message) {
  var messageid = getUniqueMessageKey();
  io.emit('new message', {
    "messageid": messageid,
    "payload":message,
    "file": "",
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

function translateMessage(data, targetusername, messagePayload) {
    var currentLanguage = null;
    var targetLanguage = null;
    var msg = data.message;
    var newmessage = null;

    const identifyParams = {
        text: msg
    };

    return languageTranslator.identify(identifyParams)
        .then(identifiedLanguages => {
            currentLanguage = identifiedLanguages.languages[0].language;

            return userinfo.getUserLanguage(targetusername).then(
                function(result) {
                    targetLanguage = database.cleanString(result[0].rows[0][0]);

                    var model = currentLanguage + "-" + targetLanguage;

                    return languageTranslator.listModels()
                        .then(availableModels => {
                            for(var index = 1; index < availableModels.models.length; index++) {
                                var modelexists = false;
                                if(model === availableModels.models[index].model_id) {
                                    modelexists = true;
                                    const translateParams = {
                                        text: messagePayload.payload,
                                        model_id: model,
                                    };

                                    return languageTranslator.translate(translateParams)
                                        .then(translationResult => {
                                            newmessage = translationResult.translations[0].translation;
                                            return {"target": targetusername, "message": newmessage};
                                        })
                                        .catch(err => {
                                            console.log('error:', err);
                                            return null;
                                        });
                                }
                            }
                            if(!modelexists) {
                                return msg;
                            }
                        })
                        .catch(err => {
                            console.log('error:', err);
                        });
                });
        })
        .catch(err => {
            console.log('error:', err);
        });
}

function sendAvailableLanguages() {
    var availableLanguages;
    languageTranslator.listIdentifiableLanguages()
        .then(identifiedLanguages => {
            availableLanguages = identifiedLanguages;
            io.emit('available languages', availableLanguages);
        })
        .catch(err => {
            console.log('error:', err);
        });
}

module.exports = {
    "sendMessage": sendMessage,
    "sendBroadcast": sendBroadcast,
    "sendFileBroadcast": sendFileBroadcast,
    "sendFileMessage": sendFileMessage,
    "sendServerMessage": sendServerMessage,
    "sendAvailableLanguages": sendAvailableLanguages
};