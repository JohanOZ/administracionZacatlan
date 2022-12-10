import { check, validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import { Usuario } from "../models/Usuario.js";
import { generarJWT } from "../helpers/tokens.js";

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: "Iniciar Sesión",
        csrfToken : req.csrfToken()
    });
};

const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: "Crear Cuenta",
        csrfToken : req.csrfToken()
    });
};

const login = async (req, res) => {
    await check('email').isEmail().withMessage('Correo no válido.').run(req)
    await check('password').notEmpty().withMessage('Introduce tu contraseña.').run(req)

    let resultado = validationResult(req)

    const { nombre, email, password } = req.body;

    //Verificar que resultado esté vacio

    if(!resultado.isEmpty()) {
        //Errores

        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
            usuario : {
                email
            }
        });
    };

    //Comprobar si usuario existe
    const usuario = await Usuario.findOne({where : { email }});
    if(!usuario) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken : req.csrfToken(),
            errores : [{param: 'password', msg: 'Credenciales no válidas'}]
        })
    }

    //Validar contraseña
    if(!usuario.verificarPassword(password)) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken : req.csrfToken(),
            errores : [{param: 'password', msg: 'Credenciales no válidas'}]
        })
    }

    //Autenticar usuario
    const token = generarJWT(usuario.id_usr);

    return res.cookie('_token', token, {
        httpOnly: true,
    }).redirect('/hoteles')

};

const registrar = async (req, res) => {
    //Validación
    await check('nombre').notEmpty().withMessage('Introduce tu nombre.').run(req)
    await check('email').isEmail().withMessage('Correo no válido.').run(req)
    await check('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres requeridos.').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req)

    let resultado = validationResult(req)
    console.log(resultado);
    const { nombre, email, password } = req.body;
    //Verificar que resultado esté vacio
    if(!resultado.isEmpty()) {
        //Errores

        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken : req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre,
                email
            }
        });
    };

    //Verificar si existe un usuario con ese email
    const existeUsuario = await Usuario.findOne({
        where: { email }
    })

    if(existeUsuario) {
        return res.render('auth/registro', {
            pagina : 'Crear Cuenta',
            csrfToken : req.csrfToken(),
            errores : [{param: 'email', msg: 'Ya existe una cuenta con ese email, inicia sesión'}],
            usuario: {
                nombre,
                email
            }
        });
    };

    try {
        await Usuario.create({
            nombre,
            email,
            password
        });

        //Mostrar mensaje de confirmacion de cuenta

        res.render('templates/mensaje', {
            pagina: 'Cuenta Creada Con Éxito',
            mensaje : 'Tu cuenta ha sido creada con éxito, comunicate con un administrador para que te permisos'
        })
    } catch (error) {
        console.error(error);
    }

};

const cerrarSesion = (req, res) => {
    return res.clearCookie('_token').status(200).redirect('/auth/login')
};

export {
    formularioLogin,
    formularioRegistro,
    login,
    registrar,
    cerrarSesion
}