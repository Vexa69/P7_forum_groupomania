const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const messageCtrl = require('../controllers/messagesCtrl');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, messagesCtrl.createMessage); // Post - Création des messages avec les images.

router.get('/all/:id', messagesCtrl.findAllMessagesForOne);

router.get('/:id', messagesCtrl.findOneMessage);

router.get('/', messagesCtrl.findAllMessages);

router.put('/:id', auth, messagesCtrl.modifyOneMessages);

router.delete('/', auth, messagesCtrl.deleteMessage);

module.exports = router;
