const rp = require('request-promise-native');
const { MY_DOMAIN, MINKA_API_KEY, MINKA_URL, LUCA_SYMBOL } = process.env;
const { getNewAccessToken } = require("../utils/accessToken");
const { userRef } = require("../config/firebase.js");
const { getUidFromHandle, getNameFromHandle } = require("../controllers/userController");


const createAction = (access_token, source, target, type, lucaAmount, metadata) => {
  // Type can be: SEND, BORROW, PAY_DEBT, PAYMENT
  const data = {
    source,
    target,
    amount: String(lucaAmount),
    symbol: LUCA_SYMBOL,
    labels: {
      domain: MY_DOMAIN,
      type: type,
      ...metadata
    }
  }

  const options = {
    uri: `${MINKA_URL}/v1/action`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'x-api-key': MINKA_API_KEY,
      'Authorization': `Bearer ${access_token}`
    },
    body: data,
    json: true
  }

  return rp(options)
    .then(res => res)
    .catch(err => console.log("Error creating transaction", err));
}


const signAction = (access_token, action_id) => {
  const data = {
    "labels": {}
  };

  const options = {
    uri: `${MINKA_URL}/v1/action/${action_id}/signed`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'x-api-key': MINKA_API_KEY,
      'Authorization': `Bearer ${access_token}`
    }
  }

  return rp(options)
    .then(res => res)
    .catch(err => console.log("Error signing transaction", err));
}


exports.askTransaction = (source, target, type, lucaAmount, metadata={}) => {
    return getNewAccessToken().then(access_token => {
      return createAction(access_token, source, target, type, lucaAmount, metadata).then(action => {
        const { error, action_id } = action;
  
        if(error.code == 0) {
          // Send notification to target
          return getUidFromHandle(access_token, target)
            .then(targetUid => getMainDataFromHandle(access_token, source)
              .then(sourceName => 
                sendNotification(action_id, targetUid, type, { sourceName, lucaAmount })
              )
            )
            .catch(err => console.log("Error sending notification", err));
          
        } else {
          console.log("Error creating transaction", error);
        }
      })
    })
  }

exports.askTransaction2 = (req, res) => {
    const { source, target, type, lucaAmount, metadata } = req.body;
    return getNewAccessToken()
    .then(access_token => createAction(access_token, source, target, type, lucaAmount, metadata))
    .then(action => action.error.code == 0 ? getUidFromHandle(access_token, target) : console.log("Error creating transaction", error)) // Send notification to target   
    .then(async targetUid => {
        return getNameFromHandle(access_token, source)
        .then(userRef => userRef.child(`${targetUid}/notifications`).push({
            action_id,
            type,
            data: { sourceName, lucaAmount }
        }).then(() => "TRANSACTION SENT"))   
    })
}


exports.answerTransaction = (action_id, answer) => {
  if(answer == true) {
    // Sign transaction
    return signAction(action_id).then(res => {
      const { error, labels } = res;
      if(error.code == 0)
        // TODO: Tell receiver than transaction was accepted
        return labels.hash;
      else
        // TODO: Tell receiver than transaction had an error
        console.log("Error signing transaction", error);
    });
  } else {
    // TODO: Tell receiver than transaction was rejected
  }
}


