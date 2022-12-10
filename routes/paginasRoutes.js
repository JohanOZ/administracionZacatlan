import express from 'express';
import { formularioLogin } from '../controllers/usuarioController.js';
import protegerAuthRutas from '../middleware/protegerAuthRutas.js';

const router = express.Router();

router.get('/', protegerAuthRutas, formularioLogin);

export default router;