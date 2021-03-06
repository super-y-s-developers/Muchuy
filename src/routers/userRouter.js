const express = require('express');
const userController = require('../controllers/userController');
const { authorize } = require('../config/auth.js');
const { askTransaction, answerTransaction } = require('../controllers/actionController')

const router = express.Router();
/**
 * Load user when API with uuid route parameter is hit
 */
router.param('uuid', userController.load);

router
  .route('/:uuid')
  /**
   * @api {get} v1/users/:uuid Get User
   */ 
  .get(authorize, userController.get);

router
  .route('/')
  /**
   * @api {post} v1/users/ Post User - create new user
   */ 
  .post(userController.createUser)

router
  .route('/:uuid/balance/')
  /**
   * @api {get} v1/users/:uuid/balance/:handle Get User wallet balance
   */ 
  .get(authorize, userController.getBalance);
 
router
  .route('/:uuid/wallets/')
  /**
   * @api {get} v1/users/:uuid/wallets/ Get User's wallets
   */ 
  .get(authorize, userController.getWallets);
  

  module.exports = router;