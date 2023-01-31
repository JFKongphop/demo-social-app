const express = require('express') ;
const { getComments, addComment } = require('../controllers/comment');


const router = express.Router();


router.get('/', getComments);
router.post('/', addComment);

module.exports = router;