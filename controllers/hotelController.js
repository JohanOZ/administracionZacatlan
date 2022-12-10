import { unlink } from "node:fs/promises";
import { check, validationResult } from "express-validator";
import { generarId } from "../helpers/tokens.js";
import { Hotel } from "../models/Hotel.js";
import { Gerente } from "../models/Gerente.js";
import { Habitacion } from "../models/Habitacion.js";



const admin = async (req, res) => {
    const hoteles = await Hotel.findAll({
        where: {
        },
        include: [
            { model: Gerente, as : 'gerente'},
            { model: Habitacion}
        ]
    });
    res.render('hotel/admin', {
        pagina : 'Hoteles',
        csrfToken : req.csrfToken(),
        hoteles
    })
};
//Formulario crear Hotel
const crear = (req, res) => {
    res.render('hotel/crear', {
        pagina : 'Crear Hotel',
        csrfToken : req.csrfToken()
    });
};

const guardar = async (req, res) => {
    //Validación
    await check('nombre').notEmpty().withMessage('Introduce el nombre.').run(req)
    await check('direccion').notEmpty().withMessage('Introduce la dirección.').run(req)
    await check('telefono').isLength({ min: 8, max: 10 }).withMessage('Mínimo 1000 caracteres requeridos.').run(req)
    await check('email').isEmail().withMessage('Correo no válido').run(req)

    let resultado = validationResult(req)
    const { nombre, direccion, telefono, email } = req.body;

    //Verificar que resultado sea vacio
    if(!resultado.isEmpty()) {
        //Errores

        return res.render('hotel/crear', {
            pagina: 'Crear Cuenta',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
            hotel: {
                nombre,
                direccion,
                telefono,
                email
            }
        });
    };

    try {
       
        const hotelGuardado = await Hotel.create({
            nombre,
            direccion,
            telefono,
            email,
        })

        const { id_htl } = hotelGuardado;
        
        res.redirect(`/hoteles/agregar-imagen/${id_htl}`)
        
    } catch (error) {
        console.error(error);
    }
};

const agregarImagen = async (req, res) => {

    const { id } = req.params

    const hotel = await Hotel.findByPk(id);

    if (!hotel) {
        return res.redirect('/hoteles');
    }
    res.render('hotel/agregar-imagen', {
        pagina : `Agregar imagen de: ${hotel.nombre}`,
        csrfToken : req.csrfToken(),
        hotel
    });

};

const guardarImagen = async (req, res, next) => {
    
    const { id } = req.params

    const hotel = await Hotel.findByPk(id);
    
    if (!hotel) {
        return res.redirect('/hoteles');
    }
    try {
        hotel.imagen = req.file.filename

        await hotel.save();

        next()
    } catch (error) {
        
    }
};

const editar = async (req, res) => {
    const { id } = req.params;

    const hotel = await Hotel.findByPk(id);

    if(!hotel) {
        return res.redirect('/hoteles');
    }

    res.render('hotel/editar', {
        hotel,
        pagina : 'Editar Hotel',
        csrfToken : req.csrfToken()
    });
};

const guardarCambios = async (req, res) => {
    //Validación
    await check('nombre').notEmpty().withMessage('Introduce el nombre.').run(req)
    await check('direccion').notEmpty().withMessage('Introduce la dirección.').run(req)
    await check('telefono').isLength({ min: 8, max: 10 }).withMessage('Mínimo 1000 caracteres requeridos.').run(req)
    await check('email').isEmail().withMessage('Correo no válido').run(req)

    let resultado = validationResult(req)

    if(!resultado.isEmpty()) {
        //Errores

        return res.render('hotel/editar', {
            pagina: 'Crear Cuenta',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
            hotel: {
                nombre,
                direccion,
                telefono,
                email
            }
        });
    };

    const { id } = req.params;
    const { nombre, direccion, telefono, email } = req.body;

    try {
        await Hotel.update({
            nombre,
            direccion,
            telefono,
            email
        }, {
            where : {
                id_htl : id
            }
        });

        res.redirect(`/hoteles/agregar-imagen/${id}`)
    } catch (error) {
        console.error(error);
    }

};

const eliminar = async (req, res) => {
    const { id } = req.params;

    const hotel = await Hotel.findByPk(id);

    if(!hotel) {
        return res.redirect('/hoteles');
    }

    console.log('SE ESTÁ EJECUTANDO LA FUNCION BORRAR')

    //Eliminar imagen
    try {
        await unlink(`public/uploads/${hotel.imagen}`);
    } catch (error) {
        
    }

    //Eliminar propiedad

    await hotel.destroy();

    res.redirect('/hoteles')
};

const publicarHotel = async (req, res) => {
    const { id } = req.params;

    const hotel = await Hotel.findByPk(id);

    if(!hotel) {
        return res.redirect('/hoteles');
    }

    //Publicar o no hotel

    if(hotel.publicado) {
        hotel.publicado = false
        await hotel.save()
        
    } else {
        hotel.publicado = true
        await hotel.save()
    }

    res.redirect('/hoteles')
};

export {
    admin,
    crear,
    editar,
    guardar,
    eliminar,
    guardarCambios,
    publicarHotel,
    agregarImagen,
    guardarImagen
}