const sequelize = require('sequelize');
const db = require('../config/sequelize');

/* User model */
const User = db.define('user', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: sequelize.STRING,
    email: {
        type: sequelize.STRING,
        allowNull: false
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    }
});

module.exports = User;