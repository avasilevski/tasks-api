var express = require('express');
const auth = require('../middlewares/auth');
var router = express.Router();
require("dotenv").config();


/* Get tasks for user by userid */
router.get('/', auth.verifyToken, (req, res, next) => {
  connection.query(`SELECT * FROM tasks WHERE userid = ${req.body.userid}`, (err, result) => {
    if(err) throw err;
    res.status(200).json(result);
  });
});


/* Add task */
router.post('/', auth.verifyToken, (req, res, next) => {
  connection.query(`INSERT INTO tasks (userid, taskname, taskvalue) VALUES ("${req.body.userid}","${req.body.taskname}","${req.body.taskvalue}")`, (err, result) => {
    if(err) throw err;
    res.status(200);
  });
});


/* Delete task */
router.delete('/', auth.verifyToken, (req, res, next) => {
  connection.query(`DELETE FROM tasks WHERE id = "${req.body.id}"`, (err, results, fields) => {
    if(err) throw err;
    res.status(200);
  });
});


module.exports = router;