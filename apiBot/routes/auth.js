const express = require('express')
const router = express.Router()

const { validatorRegistro, validatorLogin } = require('../validators/auth');
const { loginCtrl, registroCtrl, renewToken } = require('../controllers/auth');
const authMiddleware = require('../middleware/session');

router.post("/registro", validatorRegistro, registroCtrl);
router.post("/login", validatorLogin, loginCtrl);
router.get('/renew', authMiddleware, renewToken)


module.exports = router