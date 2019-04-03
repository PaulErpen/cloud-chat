global.files = [];
const fs = require('fs');

function addFile(file, user, selectedUsers) {
    files.push(
        {"filename": file.filename,
        "user": user,
        "selectedUser": selectedUsers
    });
}

function getFileLink(filename) {

}

function fileExists(filename) {
    
}

module.exports = {"addFile":addFile};