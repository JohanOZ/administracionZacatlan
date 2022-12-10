import express from 'express';
import { cerrarSesion, formularioLogin, formularioRegistro, login, registrar } from '../controllers/usuarioController.js';
import protegerAuthRutas from '../middleware/protegerAuthRutas.js';
const router = express.Router();

router.get('/login', protegerAuthRutas, formularioLogin);
router.get('/registro', protegerAuthRutas, formularioRegistro);

router.post('/registro', protegerAuthRutas, registrar);
router.post('/login', protegerAuthRutas, login);

//Cerrar sesión
router.post('/cerrar-sesion', cerrarSesion);


export default router;