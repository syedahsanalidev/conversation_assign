const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router
  .route('/')
  .post(
    chatController.createChat
  )
  .get(chatController.getAllChats)
  router
  .route('/user/:user')
  .get(
    chatController.getAllChatsByUserID
  )
  module.exports = router;