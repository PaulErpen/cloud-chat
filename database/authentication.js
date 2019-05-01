const request = require('request-promise');
const database = require('./database');

class Authentication {
    /**
     * Returns User if it exists in users, else returns false
     * @param username
     * @param password
     * @returns {*}
     */
    async login (username, password) {
        return database.getToken().then((token) => {
            var options = {
                method: 'POST',
                url: process.env.DATABASE_URL+'/sql_jobs',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + token
                },
                body: {
                    "commands": "SELECT username, password FROM users u WHERE u.password = '''"+password+"''' AND u.username ='''"+username+"'''",
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

    /**
     * Tests if user exists in user
     * true: returns false
     * false: adds new user to user and returns user
     * @param username
     * @param password
     * @returns {*}
     */
    async register (username, password, userpic) {
        return this.userExists(username).then(
            (result) => {
                if(result[0].rows_count == 0) {
                    return database.getToken().then((token) => {
                        var options = {
                            method: 'POST',
                            url: process.env.DATABASE_URL+'/sql_jobs',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer " + token
                            },
                            body: {
                                "commands": "INSERT INTO users VALUES('''" + username + "''', '''"+password+"''', '''"+userpic+"''')",
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
                return false;
            }
        );
    }

    userExists(username) {
        return database.getToken().then((token) => {
            var options = {
                method: 'POST',
                url: process.env.DATABASE_URL+'/sql_jobs',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + token
                },
                body: {
                    "commands": "SELECT username, password FROM users u WHERE u.username ='''"+username+"'''",
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
}
module.exports = Authentication;