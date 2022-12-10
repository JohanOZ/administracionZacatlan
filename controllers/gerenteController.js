import { check, validationResult } from 'express-validator';
import { Hotel } from '../models/Hotel.js';
import { Gerente } from "../models/Gerente.js";
import { Habitacion } from "../models/Habitacion.js";

const admin = async (req, res) => {
    const gerentes = await Gerente.findAll({
        include: [
            { model: Hotel, as : 'hotel' }
        ]
    });
    console.log(gerentes);
    res.render('gerente/admin', {
        pagina : 'Gerentes',
        csrfToken : req.csrfToken(),
        gerentes
    });
};

//Formulario crear Gerente

const crear = async(req, res) => {

    const hoteles = await Hotel.findAll({
        
    })

    res.render('gerente/crear', {
        pagina : 'Registrar Gerente',
        csrfToken : req.csrfToken(),
        hoteles
    });
};

const guardar = async (req, res) => {
    //Validación
    await check('nombre').notEmpty().withMessage('Introduce el nombre.').run(req)
    await check('ap_paterno').notEmpty().withMessage('Introduce el apellido paterno.').run(req)
    await check('ap_materno').notEmpty().withMessage('Introduce el apellido materno.').run(req)
    await check('telefono').isMobilePhone().withMessage('Teléfono no válido').isLength({ min: 8, max: 10 }).withMessage('Telefono excede longitud').run(req)

    let resultado = validationResult(req)
    const { id_htl, nombre, ap_paterno, ap_materno, telefono } = req.body;
    console.log(req.body);
    const verificacion = await Gerente.findOne({ where : { id_htl }});
    console.log(verificacion);
    
    //Verificar que resultado sea vacio
    if(!resultado.isEmpty() || !verificacion==null) {
        let errores = resultado.array();
        console.log(errores);
        if(verificacion==null) {
            
        } else {
            let error = 
                {
                  value: '',
                  msg: 'Ya existe un gerente para ese hotel.',
                  param: 'id_htl',
                  location: 'body'
                }
              
            errores.push(error);
        }
        //Errores
        const hoteles = await Hotel.findAll({
        
        })
        return res.render('gerente/crear', {
            pagina: 'Registrar Gerente',
            csrfToken : req.csrfToken(),
            errores,
            hoteles,
            gerente: {
                nombre,
                ap_paterno,
                ap_materno,
                telefono
            }
        });
    };

    try {
        
        if(id_htl=='null') {
            await Gerente.create({
                nombre,
                ap_paterno,
                ap_materno,
                telefono
            });
        } else {
            await Gerente.create({
                id_htl,
                nombre,
                ap_paterno,
                ap_materno,
                telefono
            });
        }

        res.redirect('/gerentes');
        
    } catch (error) {
        console.error(error)
    }

};

const editar = async (req, res) => {
    const { id } = req.params;

    const gerente = await Gerente.findByPk(id);

    if(!gerente) {
        return res.redirect('/gerentes');
    }
    const hoteles = await Hotel.findAll();
    res.render('gerente/editar', {
        gerente,
        hoteles,
        pagina : 'Editar Gerente',
        csrfToken : req.csrfToken()
    });
};

const guardarCambios = async (req, res) => {
    //Validacion
    await check('nombre').notEmpty().withMessage('Introduce el nombre.').run(req)
    await check('ap_paterno').notEmpty().withMessage('Introduce el apellido paterno.').run(req)
    await check('ap_materno').notEmpty().withMessage('Introduce el apellido materno.').run(req)
    await check('telefono').isMobilePhone().withMessage('Teléfono no válido').isLength({ min: 8, max: 10 }).withMessage('Teléfono no válido').run(req)

    let resultado = validationResult(req)
    

    //Verificar que resultado sea vacio
    if(!resultado.isEmpty()) {
        //Errores
        const hoteles = await Hotel.findAll({
        
        })
        return res.render('gerente/crear', {
            pagina: 'Registrar Gerente',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
            hoteles,
            gerente: {
                nombre,
                ap_paterno,
                ap_materno,
                telefono
            }
        });
    };

    const { id } = req.params;
    const { id_htl, nombre, ap_paterno, ap_materno, telefono } = req.body;

    try {
        if(id_htl=='null') {
            id_htl = null
        }

        await Gerente.update({
            id_htl,
            nombre,
            ap_materno,
            ap_materno,
            telefono
        }, {
            where : {
                id_hbt : id
            }
        })
    } catch (error) {
        console.error(error);
    }
};

const eliminar = async (req, res) => {
    const { id } = req.params;

    const gerente = await Gerente.findByPk(id);

    if(!gerente) {
        return res.redirect('/gerentes');
    }

    //Eliminar gerente

    await gerente.destroy();

    res.redirect('/gerentes');
};

export {
    admin,
    crear,
    guardar,
    editar,
    guardarCambios,
    eliminar
}