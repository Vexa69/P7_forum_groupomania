const express = require('express');
const router = express.Router();
const isOwner = require('../middleware/isOwner');
const auth = require('../middleware/auth');
const messageCtrl = require('../controllers/messagesCtrl');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, messageCtrl.createMessage); // Post - Création des messages avec les images.

router.get('/all/:id', messageCtrl.findAllMessagesForOne);

router.get('/:id', messageCtrl.findOneMessage);

router.get('/', messageCtrl.findAllMessages);

router.delete('/:id', auth, isOwner, messageCtrl.deleteMessage);

module.exports = router;
