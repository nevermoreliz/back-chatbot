const express = require('express')
const router = express.Router()
const { getPersona, createPersona, updatePersona, retornarImagen, getPersonas } = require('../controllers/personas')
const { validatorCreatePersona, validatorUpdatePersona } = require('../validators/personas');
const authMiddleware = require('../middleware/session');
const checkRol = require('../middleware/rol');

router.get("/:id", authMiddleware, checkRol(['superadmin']), getPersona);
router.get("/", authMiddleware, checkRol(['superadmin']), getPersonas);
router.post("/", [authMiddleware, checkRol(['superadmin']), validatorCreatePersona], createPersona);
router.put("/:id", [authMiddleware, checkRol(['superadmin','agente'])],validatorUpdatePersona, updatePersona);
router.get("/profile/:img", [authMiddleware, checkRol(['superadmin','agente'])], retornarImagen);

// enlaces para database
router.post("/datatable", authMiddleware, checkRol(['superadmin']), getPersonas);



module.exports = router