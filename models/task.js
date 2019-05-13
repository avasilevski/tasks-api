const sequelize = require('sequelize');
const db = require('../config/sequelize');

/* Task model */
const Task = db.define('task', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userid: sequelize.INTEGER,
    taskname: sequelize.STRING,
    taskvalue: sequelize.BOOLEAN,
});

module.exports = Task;