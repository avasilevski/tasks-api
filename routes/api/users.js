const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const router = express.Router();


/* Get users */
router.get('/', (req, res, next) => {
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
});


/* Delete user FOR DEV ONLY*/
router.delete('/delete/:userId', (req, res, next) => {
  User.destroy({where: { id: req.params.userId}}).then((e) => {
    res.status(200).end();
  });
});

module.exports = router;
