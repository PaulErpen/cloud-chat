global.files = [];

function addFile(file, user, selectedUsers) {
    files.push(
        {"filename": file.filename,
        "user": user,
        "selectedUser": selectedUsers
    });
}

module.exports = {"addFile":addFile};