const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

//bcrypt
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

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

connection.query('CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(255),email VARCHAR(255),password VARCHAR(255));', (err) => {
  if(err) throw err;
  console.log("Table users created");
});

/* Get users */
router.get('/', (req, res, next) => {
  connection.query('SELECT * FROM users', (err, result) => {
    if(err) throw err;
    res.status(200).json(result);
  });
});


/* Signup */
router.post('/signup', (req, res, next) => {
  connection.query(`SELECT * FROM users WHERE email = "${req.body.email}"`, (err, results, fields) => {
    if(err) throw err;
    //Check if email is registered
    if(results.length > 0){
      res.status(409).json({
        message: 'Mail exists'
      });
    }else{
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if(err) throw err;
        connection.query(`INSERT INTO users (name, email, password) VALUES ("${req.body.name}", "${req.body.email}", "${hash}")`, (err, result) => {
          if(err) throw err;
          res.status(200).json({
            message: 'Signup successful'
          });
        });
      });
    }
  });
});


/* Signin */
router.post('/signin', (req, res, next) => {
  connection.query(`SELECT * FROM users WHERE email = "${req.body.email}"`, (err, results, fields) => {
    if(err) throw err;
    if(results.length > 0){
      bcrypt.compare(req.body.password, results[0].password, (err, hashres) => {
        if(err) throw err;
        if(hashres){
          connection.query(`SELECT * FROM users WHERE email = "${req.body.email}" AND password = "${results[0].password}"`, (err, users, fields) => {
            if(err) throw err;
            jwt.sign({ id: users[0].id, name: users[0].name, email: users[0].email,}, 'jwt_secret_key_1234', { expiresIn: '1h' }, (err, token) => {
              res.status(200).json({
                message: 'Signin successful',
                token: token
              });
              console.log("Created token: " + token);
            });
          });
        }else{
          //wrong pass
          res.status(403).json({
            message: 'Wrong email or password'
          });
        }
      });
    }else{
      //wrong email
      res.status(403).json({
        message: 'Wrong email or password'
      });
    }
  });
});


/* Delete user */
router.delete('/delete/:userId', (req, res, next) => {
  connection.query(`DELETE FROM users WHERE id = "${req.params.userId}"`, (err, results, fields) => {
    if(err) throw err;
    res.status(200).end();
  });
});

module.exports = router;
