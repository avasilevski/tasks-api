const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const sequelize = require('../config/sequelize');
const router = express.Router();


/* Get users */
router.get('/', (req, res, next) => {
  // sequelize.query('SELECT * FROM users', {model: User}).then((users) => {
  //   res.status(200).json(users);
  // });
  User.findAll().then(users => {
    res.status(200).json(users);
  }).catch(err => console.log(err));
});


/* Signup */
router.post('/signup', (req, res, next) => {
  User.findOne({where: {email: req.body.email}}).then(user => {
    if(user != null){
      res.status(409).json({
        message: 'Mail exists'
      });
    }else{
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) throw err;
        User.create({ name: req.body.name, email: req.body.email, password: hash}).then(user => {
          res.status(200).json({
            message: 'Signup successful'
          });
        });
      });
    }
  }).catch(err => console.log(err));

  // connection.query(`SELECT * FROM users WHERE email = "${req.body.email}"`, (err, results, fields) => {
  //   if(err) throw err;
  //   //Check if email is registered
  //   if(results.length > 0){
  //     res.status(409).json({
  //       message: 'Mail exists'
  //     });
  //   }else{
  //     bcrypt.hash(req.body.password, 10, (err, hash) => {
  //       if(err) throw err;
  //       connection.query(`INSERT INTO users (name, email, password) VALUES ("${req.body.name}", "${req.body.email}", "${hash}")`, (err, result) => {
  //         if(err) throw err;
  //         res.status(200).json({
  //           message: 'Signup successful'
  //         });
  //       });
  //     });
  //   }
  // });
});


/* Signin */
router.post('/signin', (req, res, next) => {
  User.findOne({where: {email: req.body.email}}).then(userCheck => {
    if(userCheck != null){
      bcrypt.compare(req.body.password, userCheck.dataValues.password, (err, hashres) => {
        if(err) console.log(err);
        if(hashres){
          User.findOne({where: {email: req.body.email, password: userCheck.dataValues.password}}).then(user => {
            jwt.sign({ id: user.dataValues.id, name: user.dataValues.name, email: user.dataValues.email,}, process.env.JWT_KEY, { expiresIn: '1h' }, (err, token) => {
              res.status(200).json({
                message: 'Signin successful',
                token: token
              });
            });
          }).catch(err => console.log(err));
        }else{
          //wrong email
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
  }).catch(err => console.log(err));

  // connection.query(`SELECT * FROM users WHERE email = "${req.body.email}"`, (err, results, fields) => {
  //   if(err) throw err;
  //   if(results.length > 0){
  //     bcrypt.compare(req.body.password, results[0].password, (err, hashres) => {
  //       if(err) throw err;
  //       if(hashres){
  //         connection.query(`SELECT * FROM users WHERE email = "${req.body.email}" AND password = "${results[0].password}"`, (err, users, fields) => {
  //           if(err) throw err;
  //           jwt.sign({ id: users[0].id, name: users[0].name, email: users[0].email,}, process.env.JWT_KEY, { expiresIn: '1h' }, (err, token) => {
  //             res.status(200).json({
  //               message: 'Signin successful',
  //               token: token
  //             });
  //           });
  //         });
  //       }else{
  //         //wrong pass
  //         res.status(403).json({
  //           message: 'Wrong email or password'
  //         });
  //       }
  //     });
  //   }else{
  //     //wrong email
  //     res.status(403).json({
  //       message: 'Wrong email or password'
  //     });
  //   }
  // });
});


/* Delete user FOR DEV ONLY*/
router.delete('/delete/:userId', (req, res, next) => {
  User.destroy({where: { id: req.params.userId}}).then((e) => {
    res.status(200).end();
  });
});

module.exports = router;
