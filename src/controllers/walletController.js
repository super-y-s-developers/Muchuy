const rp = require('request-promise-native');
const { MY_DOMAIN, MINKA_API_KEY, MINKA_URL, LUCA_SYMBOL } = process.env;

const uri = `${MINKA_URL}/v1/wallet`

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


exports.getWallet = (handle,access_token) => {
    let request = {
        ...options,
        method: 'GET',
        uri: `${uri}/${handle}`,
        headers: {
            ...headers,
            'Authorization': `Bearer ${access_token}`
        },
    }

    return rp(request)
        .then(res => res)
        .catch(err => console.log("Error creating signer", err));
}


exports.createWallet = function createWallet(access_token, type, handle) {
  const data = {
    "handle": handle, 
    "labels": {
      "domain": MY_DOMAIN,
      "type": type
    }
  }

  request = {
        ...options,
        headers: {
            ...headers,
            'Content-Length': data.length,
            'Authorization': `Bearer ${access_token}`
        },
        body: data,
  }

  return rp(request)
    .then(res => res.handle)
    .catch(err => console.log("Error creating wallet", err));
}


exports.assignSignerToWallet = (access_token, signerHandle, walletHandle, isDefault=false) => {
  const data = {
    "signer": [ 
      signerHandle
    ]
  }
  if(isDefault) data["default"] = signerHandle;

  const request = {
    ...options,
    uri: `${uri}/${walletHandle}`,
    method: 'PUT',
    headers: {
        ...headers,
        'Content-Length': data.length,
        'Authorization': `Bearer ${access_token}`
    },
    body: data
  }

  return rp(request)
    .then(res => res.error)
    .catch(err => console.log("Error assigning signer to wallet", err));
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
        .then(res => res.amount)
        .catch(err => console.log("Error creating signer", err));
}
