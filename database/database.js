const request = require('request-promise');

function getToken() {
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

module.exports = {
    "getToken": getToken
}