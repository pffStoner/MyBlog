const express = require('express');
const router = express.Router(); 
const bcrypt = require('bcryptjs');

let User = require('../models/user');

//register form
router.get('/register', (req, res) => {
    res.render('register');
});

//register POST
router.post('/register',(req, res) =>{
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    //validation
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is not valid').isEmail();
    req.checkBody('username','Username is required').notEmpty();
    req.checkBody('password','Password is required').notEmpty();
    req.checkBody('password2','Password do not match').equals(req.body.password);
    
    // //check if user alredy exist
    // let query = {
    //     username: req.body.username
    // };
    
    // User.find(query)
    //    .then(user =>  {
    //          if(user) {         // a user is already present
    //              console.log('user exist');
                 
    //          } else {
    //             // no previous user present with this username
    //             return User.save(userObj);
    //          }
    //    })
    //    .then(user => {
    //        // save success response
    //    })
    //    .catch(error => { 
    //       // error in save method
    //    });
    

    //get erros
    let errors = req.validationErrors();
    
    //handle errors
    if (errors) {
        res.render('register',{
            errors:errors
        });
    } else {
        //create new user
        let newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password
        });

        bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(newUser.password,salt, (err,hash) => {
                if (err) {
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save((err) =>{
                    if (err) {
                     console.log(err);
                     return;
                    } else {
                        req.flash('success','You are now registred!');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
}); //    ./register

//render login template
router.get('/login', (req, res) => {
    res.render('login');
});

module.exports = router;