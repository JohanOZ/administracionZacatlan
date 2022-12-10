import express from 'express';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';
import usuarioRoutes from './routes/usuarioRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import gerenteRoutes from './routes/gerenteRoutes.js';
import habitacionRoutes from './routes/habitacionRoutes.js'
import paginasRoutes from './routes/paginasRoutes.js';
import db from './config/db.js'
//Crear app
const app = express();

//Conexión a la base de datos
try {
    await db.authenticate();
    console.log('Base de datos conectada');
} catch (error) {
    console.error(error);
}

//Definir puerto
const port = process.env.PORT || 4000;

//Habilitar PUG
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: true }));

//Habilitar Cookie parser
app.use(cookieParser() );

//Habilitar CSRF
app.use( csrf({ cookie: true }) );

//Routing
app.use('/auth', usuarioRoutes);
app.use('/', hotelRoutes);
app.use('/', gerenteRoutes);
app.use('/', habitacionRoutes);
app.use('/', paginasRoutes)

//Carpeta Publica
app.use( express.static('public') );

app.listen(port, () => {
    console.log(`Servidor iniciado en el puerto: ${port}`);
})