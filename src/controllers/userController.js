const { auth, userRef } = require("../config/firebase");
const { errorHandler } = require('../config/error');
const { getWallet, getBalance, createWallet, assignSignerToWallet } = require('../controllers/walletController');
const { getNewAccessToken } = require('../utils/accessToken');
const { createSigner } = require("../controllers/signerController");
const { getWalletUidFromHandle } = require('./walletController');
const { getSignerWalletHandle } = require('./signerController');
/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, uuid) => {
  try {
    const user = await auth.getUser(uuid);
    req.locals = { user };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

exports.get = (req, res) => {
  res.json(req.locals.user);
};

exports.getBalance = (req, res) => {
  getNewAccessToken().then(accessToken => {
    let handle = userRef.child(req.locals.user.uid).on("value", snapshot => {
      getBalance(snapshot.val().default,accessToken).then(balance => {
        res.json(balance)
      }).catch(console.error)
    })
  });
};

exports.getWallets = (req,res) => {
  getNewAccessToken().then(accessToken => {
    let handle = userRef.child(req.locals.user.uid).on("value", async snapshot => {
      let wallets = [];
      for(let handle of snapshot.val().wallets){
        console.log(handle)
        let wallet = await getWallet(accessToken, handle)
        wallet.balance = await getBalance(handle,accessToken)
        wallets.push(wallet)
      }
      console.log(wallets)
      res.json(wallets)
    })
  });
}


exports.createUser = (req, res) => {
  const { email, password, cc, name/*, phone*/ } = req.body;
  const uid = "";
  return getNewAccessToken().then(access_token => {
    
    // Create user in firebase auth
    return auth.createUser({
      uid: cc,
      email,
      //phoneNumber: phone,
      password,
      displayName: name
    })
      .then(userRecord => {
        const { uid } = userRecord;

        // Create signer in minka
        createSigner(access_token).then(signerHandle => {

          // Create default wallet in minka
          createWallet(access_token, "PERSON", '$'+uid).then(walletHandle => {

            // Assign signer to wallet as default in Minka
            assignSignerToWallet(access_token, signerHandle, walletHandle, isDefault=true)
              .then(err => {
                if(err && err.code == 0) {

                  // Create user in firebase database
                  userRef.child(uid).set({
                    wallets: [walletHandle],
                    default: walletHandle
                  });
                  res.send(uid)
                } else {
                  console.log("Error assigning signer to wallet", err)
                }
              })
              .catch(err => console.log("Error assigning signer to wallet", err));
          })
        });
      })
      .catch(error => console.log('Error creating new user:', error));
  });
}

exports.getUidFromHandle = (access_token, handle) => {
  let walletHandle = "";
  if(!handle.startsWith('$')) {
    // Treat signer wallet handle
    walletHandle = getSignerWalletHandle(access_token, handle);
  } else {
    // Treat as a wallet
    walletHandle = handle;
  }
  return getWalletUidFromHandle(access_token, walletHandle);
}


const getUserFromUid = (uid) => {
  return auth.getUser(uid)
    .then(userRecord => userRecord.toJSON())
    .catch(err => {
      console.log('Error fetching user data:', err);
    });
}


exports.getNameFromUid = function getNameFromUid(uid) {
  return getUserFromUid(uid).then(user => user.displayName);
}


exports.getNameFromHandle = (access_token, handle) => {
  return exports.getUidFromHandle(access_token, handle).then(uid => {
    return exports.getNameFromUid(uid);
  })
}

exports.getMainDataFromUid = uid => {
  return getUserFromUid(uid).then(user => {
    return {
      name: user.displayName,
      uid
    }
  });
}

exports.getMainDataFromHandle = (access_token, handle) => {
  return exports.getUidFromHandle(access_token, handle).then(uid => {
    return exports.getMainDataFromUid(uid);
  })
}