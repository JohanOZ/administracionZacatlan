import jwt from 'jsonwebtoken';
import { Usuario } from '../models/Usuario.js';
const protegerAuthRutas = async (req, res, next) => {

    //Verificar si hay token en cookie
    const { _token } = req.cookies;

    if(!_token) {
        return next();
    }

    //Comprobar token

    try {
        if(jwt.verify(_token, process.env.JWT_SECRET)) {
            return res.redirect('/hoteles');
        } else {
            return res.clearCookie('_token').redirect('/auth/login');
        }
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login');
    }   
}

export default protegerAuthRutas;