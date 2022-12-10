import { Sequelize } from "sequelize";
import db from "../config/db.js";

export const Hotel = db.define('hoteles', {
    id_htl: {
        type : Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true     
    },
    nombre : {
        type: Sequelize.STRING,
        allowNull: false
    },
    direccion : {
        type: Sequelize.STRING,
        allowNull: false
    },
    telefono : {
        type: Sequelize.STRING
    },
    email : {
        type: Sequelize.STRING
    },
    imagen : {
        type : Sequelize.STRING,
    },
    publicado : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue: false
    }
});