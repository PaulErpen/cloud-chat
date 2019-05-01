const request = require('request-promise');
const database = require('./database');

function getUserImage(username) {
    return database.getToken().then((token) => {
        var options = {
            method: 'POST',
            url: process.env.DATABASE_URL+'/sql_jobs',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + token
            },
            body: {
                "commands": "SELECT profilepic FROM users u WHERE u.username ='''"+username+"'''",
                "limit": 10,
                "separator": ";",
                "stop_on_error": "no"
            },
            json: true
        };

        return request(options).then(
            (body) => {
                return database.awaitQuery(body);
            }
        ).catch(function(error) {
            throw error;
        });
    });
}

module.exports = {
    "getUserImage": getUserImage
};