var files = {};

function addFile(file, user, users) {
    if(false) {return false;}//do file redupe here //add new user chain

    var selectedUsers = {};
    for (const user in users) {
        selectedUsers[user] = false;
    }
    files[file.name] = {
        "owners": [user],
        "users": selectedUsers,
        "originalName": file.originalName,
        "timestamp": new Date()
    };
    return file;
}

function fileExists(filename) {
    return files[filename] != undefined;
}

function userAccesedFile(file, user) {
    if(files[filename] != undefined) {
        return false;
    }
    files[filename][users][username] = true;
    return true;
}

function cronJob() {
    var deleted
    for (const file in files) {
        
    }
}

module.exports = {
    "addFile": addFile,
    "fileExists": fileExists,
    "userAccesedFile": userAccesedFile,
    "cronJob": cronJob
}