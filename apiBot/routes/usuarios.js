const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/session')
const { validatorUsuario, validatorUpdateUsuario } = require('../validators/usuarios')
const { getUsuario, createUsuario, updateUsuario } = require('../controllers/usuarios');

//TODO http://localhost/usuarios :: get,post,delete.put

router.get("/", getUsuario);
router.post("/", [authMiddleware, validatorUsuario], createUsuario);
router.put("/:id", [authMiddleware, validatorUpdateUsuario], updateUsuario);

module.exports = router