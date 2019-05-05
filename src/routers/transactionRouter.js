const express = require('express');
const { askTransaction, answerTransaction } = require('../controllers/actionController')

const router = express.Router();

router
  .route('/ask')
  /**
   * @api {post} v1/transaction/ask Post transaction - make a transaction
   */ 
  .post(askTransaction)

  router
  .route('/answer')
  /**
   * @api {post} v1/transaction/asnwer Post transaction - give an answer to an transaction asked
   */ 
  .post(answerTransaction)
   

  module.exports = router;