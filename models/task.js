const sequelize = require('sequelize');
const db = require('../config/sequelize');

/* Task model */
const Task = db.define('task', {
    id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userid: type.INTEGER,
    taskname: type.STRING,
    taskvalue: type.BOOLEAN,
});

module.exports = Task;