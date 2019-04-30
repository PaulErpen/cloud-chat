const request = require('request-promise');

class Authentication {
    getToken() {
        var options = {
            method: 'POST',
            url: process.env.DATABASE_URL+'/auth',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                "userid":"vxc32889", 
                "password":"lf4t3w-546qv5d11"
            },
            json: true
        };
        return request(options).then(
            (body) => {
                if(!body.token) {
                    throw "Could not get token for database transactions. Please check validity of the userid and password."
                }
                return body.token;
            }
        ).catch(function(error) {
            throw error;
        });
    }

    /**
     * Returns User if it exists in users, else returns false
     * @param username
     * @param password
     * @returns {*}
     */
    async login (username, password) {
        return this.getToken().then((token) => {
            var options = {
                method: 'POST',
                url: process.env.DATABASE_URL+'/sql_jobs',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + token
                },
                body: {
                    "commands": "SELECT * FROM users u WHERE u.password = '''"+password+"''' AND u.username ='''"+username+"'''",
                    "limit": 10,
                    "separator": ";",
                    "stop_on_error": "no"
                },
                json: true
            };
    
            return request(options).then(
                (body) => {
                    return this.awaitQuery(body);
                }
            ).catch(function(error) {
                throw error;
            });
        });
    }

    async awaitQuery(body) {
        //wait a moment so the database can process
        await this.sleep(500);
        return this.getToken().then((token) => {
            if(body.id) {
                if(!body.status || body.status != "completed") {
                    var options = {
                        method: 'GET',
                        url: process.env.DATABASE_URL+'/sql_jobs/'+body.id,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': "Bearer " + token
                        },
                        json: true
                    };
                    return request(options).then((body) => {
                        return this.awaitQuery(body);
                    }).catch(function(error) {
                        throw error;
                    });
                } else {
                    return body.results;
                }
            } else {
                throw "No ID for SQL Job given! Aborting."
            }
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
    async register (username, password) {
        return this.userExists(username).then(
            (result) => {
                if(result[0].rows_count == 0) {
                    return this.getToken().then((token) => {
                        var options = {
                            method: 'POST',
                            url: process.env.DATABASE_URL+'/sql_jobs',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': "Bearer " + token
                            },
                            body: {
                                "commands": "INSERT INTO users VALUES('''" + username + "''', '''"+password+"''')",
                                "limit": 10,
                                "separator": ";",
                                "stop_on_error": "no"
                            },
                            json: true
                        };
                
                        return request(options).then(
                            (body) => {
                                return this.awaitQuery(body);
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
        return this.getToken().then((token) => {
            var options = {
                method: 'POST',
                url: process.env.DATABASE_URL+'/sql_jobs',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + token
                },
                body: {
                    "commands": "SELECT * FROM users u WHERE u.username ='''"+username+"'''",
                    "limit": 10,
                    "separator": ";",
                    "stop_on_error": "no"
                },
                json: true
            };
    
            return request(options).then(
                (body) => {
                    return this.awaitQuery(body);
                }
            ).catch(function(error) {
                throw error;
            });
        });
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
module.exports = Authentication;