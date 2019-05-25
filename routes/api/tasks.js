const express = require('express');
const auth = require('../../middlewares/auth');
const Task = require('../../models/task');
const router = express.Router();


/* Get tasks for user by userid */
router.get('/', auth.verifyToken, (req, res, next) => {
  const userid = req.headers['userid'];
  Task.findAll({where: {userid: userid}}).then(tasks => {
    res.status(200).json(tasks);
  }).catch(err => console.log(err));
});


/* Add task */
router.post('/', auth.verifyToken, (req, res, next) => {
  Task.create({ userid: req.body.userid, taskname: req.body.taskname, taskvalue: req.body.taskvalue}).then(task => {
    res.status(200).json(task);
  }).catch(err => console.log(err));
});


/* Delete task */
router.delete('/', auth.verifyToken, (req, res, next) => {
  Task.destroy({where: {id: req.body.id}}).then(e => {
    res.status(200).end();
  }).catch(err => console.log(err));
});


module.exports = router;