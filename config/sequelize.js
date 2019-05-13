const Sequelize = require('sequelize');

module.exports = new Sequelize('tasks', 'root', '', {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});