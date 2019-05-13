const express = require('express');
const auth = require('../middlewares/auth');
const Task = require('../models/task');
const router = express.Router();


/* Get tasks for user by userid */
router.get('/', auth.verifyToken, (req, res, next) => {
  Task.findAll({where: {userid: req.body.userid}}).then(tasks => {
    res.status(200).json(tasks);
  }).catch(err => console.log(err));

  // connection.query(`SELECT * FROM tasks WHERE userid = ${req.body.userid}`, (err, result) => {
  //   if(err) throw err;
  //   res.status(200).json(result);
  // });
});


/* Add task */
router.post('/', auth.verifyToken, (req, res, next) => {
  Task.create({userid: req.body.userid, taskname: req.body.taskname, taskvalue: req.body.taskvalue}).then(task => {
    res.status(200).end();
  }).catch(err => console.log(err));

  // connection.query(`INSERT INTO tasks (userid, taskname, taskvalue) VALUES ("${req.body.userid}","${req.body.taskname}","${req.body.taskvalue}")`, (err, result) => {
  //   if(err) throw err;
  //   res.status(200);
  // });
});


/* Delete task */
router.delete('/', auth.verifyToken, (req, res, next) => {
  Task.destroy({where: {id: req.body.id}}).then(e => {
    res.status(200).end();
  }).catch(err => console.log(err));

  // connection.query(`DELETE FROM tasks WHERE id = "${req.body.id}"`, (err, results, fields) => {
  //   if(err) throw err;
  //   res.status(200);
  // });
});


module.exports = router;