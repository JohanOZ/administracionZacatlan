import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import db from '../config/db.js';

export const Usuario = db.define('usuarios', {
    id_usr : {
        type : Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nombre : {
        type: Sequelize.STRING,
        allowNull: false
    },
    email : {
        type: Sequelize.STRING,
        allowNull: false
    },
    password : {
        type: Sequelize.STRING,
        allowNull: false
    },
    administrador : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue: false
    }
}, {
    hooks : {
        beforeCreate : async function(usuario) {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash( usuario.password, salt );
        }
    },
    scopes: {
        eliminarPassword : {
            attributes: {
                exclude : ['password', 'admin']
            }
        }
    }

})

//Métodos personalizados

Usuario.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}