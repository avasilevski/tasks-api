var express = require('express');
var mysql = require('mysql');
const jwt = require('jsonwebtoken');
var router = express.Router();

//create SQL connection
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tasks"
});

connection.connect((err) => {
  if(err) throw err;
  console.log("Connected to SQL");
});

connection.query('CREATE TABLE IF NOT EXISTS tasks (id INT AUTO_INCREMENT PRIMARY KEY,userid INT,taskname VARCHAR(255),taskvalue BOOLEAN);', (err) => {
  if(err) throw err;
  console.log("Table tasks created");
});


/* Get tasks for user by userid */
router.get('/tasks', verifyToken, (req, res, next) => {
  connection.query(`SELECT * FROM tasks WHERE userid = ${req.body.userid}`, (err, result) => {
    if(err) throw err;
    res.status(200).json(result);
  });
});


/* Add task */
router.post('/tasks', verifyToken, (req, res, next) => {
  console.log(req.body);
  connection.query(`INSERT INTO tasks (userid, taskname, taskvalue) VALUES ("${req.body.userid}","${req.body.taskname}","${req.body.taskvalue}")`, (err, result) => {
    if(err) throw err;
    res.status(200);
  });
});


/* Delete task */
router.delete('/tasks', verifyToken, (req, res, next) => {
  connection.query(`DELETE FROM tasks WHERE id = "${req.body.id}"`, (err, results, fields) => {
    if(err) throw err;
    res.status(200);
  });
});


/* Token verification middleware */
function verifyToken(req, res, next){
  //Get auth header value
  const token = req.headers['auth'];
  //Check if authHeader is undefined
  console.log("Recived token: " + token);
  if(typeof token !== 'undefined'){
    //Set the token and do the verification
    jwt.verify(token, 'jwt_secret_key_1234', (err, authData) => {
      console.log(err);
      if(err){
        //Wrong token
        res.sendStatus(403);
      }else{
        req.authData;
        //Next middleware
        next();
      }
    });
  }else{
    //Forbidden
    res.sendStatus(403);
  }
}


module.exports = router;

//Github upload
//Tasks frontend state or server state
