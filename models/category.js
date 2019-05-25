const sequelize = require('sequelize');
const db = require('../config/sequelize');

/* Category model */
const category = db.define('category', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: sequelize.STRING,
    color: sequelize.INTEGER
});

module.exports = Category;