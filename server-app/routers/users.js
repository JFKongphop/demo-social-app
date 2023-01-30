const express = require('express') ;
const { getUser } = require('../controllers/user');


const router = express.Router();

// get the userId when click to this profile
router.get('/find/:userId', getUser)

module.exports = router;