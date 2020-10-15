let router = require('express').Router();
let { signup, signin } = require('../controllers');



router.post('/signup', signup)

router.post('/signin', signin)



module.exports = router;