const request = require('request');

class Authentication {
    constructor(app) {
        var options = {
            host: process.env.DATABASE_URL,
            port: '80',
            path: '/auth',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "userid":"vxc32889", 
                "password":"lf4t3w-546qv5d11"
            }
        };
        request.post(options, function(error, response, body) {
            debugger;
        });
    }

    /**
     * Returns User if it exists in users, else returns false
     * @param username
     * @param password
     * @returns {*}
     */
    login (username, password) {
        var user = users.filter(u => u.username == username && u.password == password);
        if(user.length > 0) {
            return {"username" : username, "password" : password};
        } else {
            return false;
        }
    }

    /**
     * Tests if user exists in user
     * true: returns false
     * false: adds new user to user and returns user
     * @param username
     * @param password
     * @returns {*}
     */
    register (username, password) {
        var user = users.filter(u => u.username == username);
        if(user.length > 0) {
            return false;
        } else {
            users.push({"username" : username, "password" : password});
            return {"username" : username, "password" : password};
        }
    }
}
module.exports = {
    Authentication : "Authentication"
};