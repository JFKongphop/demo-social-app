const express = require('express') ;
const { getUser, updateUser } = require('../controllers/user');


const router = express.Router();

// get the userId when click to this profile
router.get('/find/:userId', getUser);
router.put('/', updateUser);


module.exports = router;