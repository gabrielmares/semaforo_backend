// const models = require('../models');

let router = require('express').Router();
// let poolMysql = require('../mysql').pool;
let passport = require('passport');
const jwt = require('jsonwebtoken');
let signUp = require('../controllers');



router.post('/signup', (req, res, next) => {
    signUp(req, res, next)
})

router.post('/signin', (req, res) => {

    res.sendStatus(200)
})


module.exports = router;