import { check, validationResult } from 'express-validator';
import { Hotel } from '../models/Hotel.js';
import { Gerente } from "../models/Gerente.js";
import { Habitacion } from "../models/Habitacion.js";


const admin = async (req, res) => {
    const habitaciones = await Habitacion.findAll({
        include: [
            { model: Hotel, as : 'hotel' }
        ]
    });
    res.render('habitacion/admin', {
        pagina : 'Habitaciones',
        csrfToken : req.csrfToken(),
        habitaciones
    });
};

//Formulario registrar habitacion

const crear = async (req, res) => {
    const hoteles = await Hotel.findAll({

    });

    res.render('habitacion/crear', {
        pagina : 'Registrar Habitación',
        csrfToken : req.csrfToken(),
        hoteles
    });
};

const guardar = async (req, res) => {
    //Validacion
    await check('nombre').notEmpty().withMessage('Introduce el nombre.').run(req)
    await check('piso').notEmpty().withMessage('Introduce el piso.').run(req)

    let resultado = validationResult(req)
    let { id_htl, nombre, piso, refrigerador } = req.body;
    

    //Verificar que resultado sea vacio
    if(!resultado.isEmpty()) {

        const hoteles = await Hotel.findAll();
        //Errores

        return res.render('habitacion/crear', {
            hoteles,
            pagina: 'Crear Habitacion',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
            habitacion: {
                nombre,
                piso,
            }
        });
    };

    try {
        if(refrigerador=='on') {
            const habitacionGuardada = Habitacion.create({
                nombre,
                piso,
                refrigerador : 1
            })
        } else {
            const habitacionGuardada = Habitacion.create({
                nombre,
                piso,
                refrigerador : 0
            })

        }
    } catch (error) {
        console.error(error);
    }

    res.redirect('/habitaciones')
};

const editar = async (req, res) => {
    const { id } = req.params;
    const hoteles = await Hotel.findAll();
    const habitacion = await Habitacion.findByPk(id);

    if(!habitacion) {
        return res.redirect('/habitaciones');
    }

    res.render('habitacion/editar', {
        habitacion,
        hoteles,
        pagina : 'Editar Habitación',
        csrfToken : req.csrfToken()
    });
};

const guardarCambios = async (req, res) => {
    //Validacion
    await check('nombre').notEmpty().withMessage('Introduce el nombre.').run(req)
    await check('piso').notEmpty().withMessage('Introduce el piso.').run(req)

    let resultado = validationResult(req)
    
    //Verificar que resultado sea vacio
    if(!resultado.isEmpty()) {

        const hoteles = await Hotel.findAll();
        //Errores

        return res.render('habitacion/crear', {
            hoteles,
            pagina: 'Crear Habitacion',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
            habitacion: {
                nombre,
                piso,
            }
        });
    };

    const { id } = req.params;
    let { id_htl, nombre, piso, refrigerador } = req.body;


    try {
        if(id_htl=="null") {
            id_htl = null
        }

        if(refrigerador=='on') {
            await Habitacion.update({
                nombre,
                piso,
                refrigerador : 1,
                id_htl
            }, {
                where : {
                    id_hbt : id
                }
            });
    
        } else {
            await Habitacion.update({
                nombre,
                piso,
                refrigerador : 0,
                id_htl
            }, {
                where : {
                    id_hbt : id
                }
            });
    
        }
        res.redirect(`/habitaciones`)
    } catch (error) {
        console.error(error);
    }
};

const eliminar = async (req, res) => {
    const { id } = req.params;

    const habitacion = await Habitacion.findByPk(id);

    if(!habitacion) {
        return res.redirect('/habitaciones');
    }

    //Eliminar gerente

    await habitacion.destroy();

    res.redirect('/habitaciones');
};

const publicarHabitacion = async (req, res) => {
    const { id } = req.params;

    const habitacion = await Habitacion.findByPk(id);

    if(!habitacion) {
        return res.redirect('/habitaciones');
    }

    //Publicar o no hotel

    if(habitacion.publicado) {
        habitacion.publicado = false
        await habitacion.save()
        
    } else {
        habitacion.publicado = true
        await habitacion.save()
    }

    res.redirect('/habitaciones')
};

export {
    admin,
    crear,
    guardar,
    editar,
    guardarCambios,
    eliminar,
    publicarHabitacion
}