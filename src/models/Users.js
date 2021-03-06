const { DataTypes } = require('sequelize');
const rolUsers = require('./roles');
require('dotenv').config();

const sequelizePool = require('./pool');


const UserModel = sequelizePool.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    rol: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: rolUsers,
            key: 'id'
        }
    },
    sucursal: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    identificador: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    timestamps: false
});



try {
    UserModel.sync();
} catch (error) {
    throw error
}



module.exports = UserModel;