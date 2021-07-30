const express = require('express');
const router = express.Router();
const commentsCtrl = require('../controllers/commentsCtrl');
const auth = require('../middleware/auth');

router.get('/', commentsCtrl.findAllComments);

router.get('/:Messageid', commentsCtrl.findOneComment);

router.post('/', auth, commentsCtrl.createComment);

router.put('/:id', auth, commentsCtrl.modifyOneComments);

router.delete('/', auth, commentsCtrl.deleteComment);

module.exports = router;
