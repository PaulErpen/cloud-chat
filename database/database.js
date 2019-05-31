const request = require('request-promise');

function cleanString(somestring) {
    return somestring.replace(/[']+/g, '');
}

function getToken() {
    var options = {
        method: 'POST',
        url: process.env.DATABASE_URL+'/auth',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            "userid":"vxc32889", 
            "password":"Hellohello<3"
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

async function awaitQuery(body) {
    //wait a moment so the database can process
    await sleep(50);
    return getToken().then((token) => {
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
                    return awaitQuery(body);
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
    "getToken": getToken,
    "awaitQuery": awaitQuery,
    "cleanString": cleanString
}