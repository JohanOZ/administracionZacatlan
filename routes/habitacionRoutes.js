import express from 'express';
import { admin, crear, editar, eliminar, guardar, guardarCambios, publicarHabitacion } from '../controllers/habitacionController.js';
import protegerRuta from '../middleware/protegerRuta.js';

const router = express.Router();

router.get('/habitaciones', protegerRuta, admin);

router.get('/habitaciones/crear', protegerRuta, crear);
router.post('/habitaciones/crear', protegerRuta, guardar);

router.get('/habitaciones/editar/:id', protegerRuta, editar);
router.post('/habitaciones/editar/:id', protegerRuta, guardarCambios);

router.post('/habitaciones/eliminar/:id', protegerRuta, eliminar);
router.post('/habitaciones/publicar/:id', protegerRuta, publicarHabitacion);


export default router;