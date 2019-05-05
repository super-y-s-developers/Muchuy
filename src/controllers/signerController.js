const rp = require('request-promise-native');
const { MY_DOMAIN, MINKA_API_KEY, MINKA_URL, LUCA_SYMBOL } = process.env;

const uri = `${MINKA_URL}/v1/signer`;

const headers = {
    'Content-Type': 'application/json',
    'x-api-key': MINKA_API_KEY,
}

const options = {
    uri: uri,
    method: 'POST',
    headers: headers,
    json: true
}


exports.createSigner = (access_token) => {
    let request = {
        ...options,
        headers: {
            ...headers,
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

exports.getBalance = (handle,access_token) => {
    let request = {
        ...options,
        method: 'GET',
        uri: `${uri}/${handle}/balance?unit=${LUCA_SYMBOL}`,
        headers: {
            ...headers,
            'Authorization': `Bearer ${access_token}`
        },
    }

    return rp(request)
        .then(res => res.error.code ? res.amout : rejected())
        .catch(err => console.log("Error creating signer", err));
}

exports.getSignerWalletHandle = (access_token, signerHandle) => {
    return getSigner(access_token, signerHandle).then(signer => signer.labels.walletHandle);
  }