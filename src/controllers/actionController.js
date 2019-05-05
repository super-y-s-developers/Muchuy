const rp = require('request-promise-native');
const { MY_DOMAIN, MINKA_API_KEY, MINKA_URL, LUCA_SYMBOL } = process.env;
const { getNewAccessToken } = require("../utils/accessToken");
const { getUidFromHandle, getMainDataFromHandle } = require("../controllers/userController");
const { sendNotification } = require("../utils/notification");

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


exports.askTransaction = (req, res) => {
    const { source, target, type, lucaAmount, metadata } = req.body;
    return getNewAccessToken().then(access_token => {
        return createAction(access_token, source, target, type, lucaAmount, metadata).then(action => {
          const { error, action_id, labels } = action;
    
          if(error.code == 0) {
            // Send notification to target
            return getUidFromHandle(access_token, target)
              .then(targetUid => getMainDataFromHandle(access_token, source)
                .then(sourceData => 
                  sendNotification(labels.created, action_id, targetUid, type, { sourceData, lucaAmount })
                )
              )
              .catch(err => console.log("Error sending notification", err));
            
          } else {
            console.log("Error creating transaction", error);
          }
        })
      }).then(msg => res.send(msg))
  }

  exports.getAction = (access_token, action_id) => {
    const options = {
      uri: `${MINKA_URL}/v1/action/${action_id}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': MINKA_API_KEY,
        'Authorization': `Bearer ${access_token}`
      },
      json: true
    }
  
    return rp(options)
      .then(res => res)
      .catch(err => console.log("Error getting action", err));
  }

  exports.answerTransaction = async(req, res) => {
    let {action_id, answer} = req.body;
    let access_token = await getNewAccessToken()
    let { source, target } = await exports.getAction(access_token, action_id)
    let uid = await getUidFromHandle(access_token, source)
    
    let targetData = await getMainDataFromHandle(access_token, target)
    if(answer == true) {
      
      // Sign transaction
      let res = await signAction(access_token, action_id)
      const { error, labels } = res;
      console.log(access_token, source)
      
      if(error.code != 0) {
        // Tell receiver that transaction had an error
        sendNotification(labels.created, action_id, uid, "ERROR", { targetData })
            .then(n => res.json(n))
            .catch(consooe.error);
        
      }
    }

    // Tell receiver that transaction has a response
    sendNotification(new Date(), action_id, uid, "RESPONSE", { targetData, answer })
        .then(n => res.json(n))
        .catch(consooe.error);
  }


