const rp = require('request-promise-native');
const { MY_DOMAIN, MINKA_API_KEY, MINKA_URL, LUCA_SYMBOL } = process.env;
const { getNewAccessToken } = require("../utils/accessToken");
const { userRef } = require("../config/firebase.js");


exports.sendNotification = (created, action_id, targetUid, type, data) => {
  return userRef.child(`${targetUid}/notifications`).push({
    created,
    action_id,
    type,
    data
  }).then(() => "TRANSACTION SENT");
}