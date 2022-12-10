import express from 'express';
import { admin, agregarImagen, crear, editar, eliminar, guardar, guardarCambios, guardarImagen, publicarHotel } from '../controllers/hotelController.js';
import protegerRuta from '../middleware/protegerRuta.js';
import upload from '../middleware/subirImagen.js';

const router = express.Router();

router.get('/hoteles', protegerRuta, admin);

router.get('/hoteles/crear', protegerRuta, crear);
router.post('/hoteles/crear', protegerRuta ,guardar);

router.get('/hoteles/agregar-imagen/:id', protegerRuta, agregarImagen);
router.post('/hoteles/agregar-imagen/:id',
    protegerRuta,
    upload.single('imagen'),
    guardarImagen
);

router.get('/hoteles/editar/:id', protegerRuta, editar);

router.post('/hoteles/editar/:id', protegerRuta, guardarCambios);

router.post('/hoteles/eliminar/:id', protegerRuta, eliminar);

router.post('/hoteles/publicar/:id', protegerRuta, publicarHotel);

export default router; 