import { Sequelize } from "sequelize";
import db from "../config/db.js";
import { Hotel } from "./Hotel.js";

export const Gerente = db.define('gerentes', {
    id_grt: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true  
    },
    id_htl: {                     //Llave Foranea
        type: Sequelize.INTEGER,
    }, 
    nombre: {
        type: Sequelize.STRING
    },
    ap_paterno: {
        type: Sequelize.STRING
    },
    ap_materno: {
        type: Sequelize.STRING,
    },
    telefono: {
        type: Sequelize.STRING
    }
});

Gerente.belongsTo(Hotel, { as : 'hotel', foreignKey : "id_htl"},);
Hotel.hasOne(Gerente, { as : 'gerente', foreignKey : "id_htl"});