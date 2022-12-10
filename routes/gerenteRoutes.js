import express from 'express';
import protegerRuta from '../middleware/protegerRuta.js';
import { admin, crear, editar, eliminar, guardar, guardarCambios } from '../controllers/gerenteController.js';

const router = express.Router();

router.get('/gerentes', protegerRuta, admin);

router.get('/gerentes/crear', protegerRuta, crear);
router.post('/gerentes/crear', protegerRuta, guardar);

router.get('/gerentes/editar/:id', protegerRuta, editar);
router.post('/gerentes/editar/:id', protegerRuta, guardarCambios);

router.post('/gerentes/eliminar/:id', protegerRuta, eliminar)

export default router;