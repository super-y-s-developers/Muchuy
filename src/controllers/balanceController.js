const rp = require('request-promise-native');
const { MY_DOMAIN, MINKA_API_KEY } = process.env;

const options = {
    uri: `${MINKA_URL}/v1/signer`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'x-api-key': MINKA_API_KEY,
      'Authorization': `Bearer ${access_token}`
    },
    json: true
}

exports.getBalance = (access_token) => {
    let request = {
        ...options,
        uri: `${MINKA_URL}/v1/signer`,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${access_token}`
        },
        body: {
            "labels": { 
                "domain": MY_DOMAIN
            }
        }
    }

    return rp(request)
        .then(res => res.handle)
        .catch(err => console.log("Error creating signer", err));
}
