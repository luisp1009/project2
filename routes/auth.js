const express = require('express')
const router = express.Router();
const axios = require("axios");
const User = require('../models/User.model')
const session = require("express-session");
const bcryptjs = require('bcryptjs')
const saltRounds = 10



//////// login router /////////
router.get('/login', (req, res, next) => {
    res.render('auth-views/login')
})

router.post('/login', (req, res, next) => {
    if (!req.body.userName || !req.body.password) {
        res.render('auth-views/login', {message : "username and password are required to access"})
        return;
    }

    User.findOne({userName: req.body.userName})
    .then((foundUser) => {
        if (!foundUser) {
            res.render('auth-views/login', {message: "User does not exist"})
        } else {
            let correctPassword = bcryptjs.compareSync(req.body.password, foundUser.password);
            if(correctPassword) {
                req.session.user = foundUser;
                res.render('index', {message:"You have logged in"})
            } else {
                res.render('auth-views/login', {message: "You have entered a wrong username or password"})
            }
        }
    })
})

//////// signup router /////////
router.get('/signup', (req, res, next) => {
    res.render('auth-views/signup')
})

router.post('/signup', (req, res, next) => {
    if (!req.body.fullName || !req.body.email || !req.body.userName || !req.body.password)
    {
        res.render('auth-views/signup', {message: "All fields are required to create an account"})
        return;
    }
    const salt = bcryptjs.genSaltSync(saltRounds)
    const hashedPass = bcryptjs.hashSync(req.body.password, salt)

    User.findOne({email: req.body.email})
    .then((foundUser) => {
        if  (foundUser){
            res.render('auth-views/signup', {message: "You have already signed up"})
            return
        } else {
            User.create({
                fullName: req.body.fullName,
                email: req.body.email,
                userName: req.body.userName,
                password: hashedPass
            })
            .then(() => {
                res.redirect('/auth/login')
            })
            .catch((err) => {
                console.log(err)
            })
        }
    })
    .catch((err) => {
        console.log(err)
    })
})


//////// logout router /////////
router.get('/logout', (req, res, next) => {
    req.session.destroy()
    res.render('auth-views/login', {message: "You have logged out. Please log in again"})
})


router.get("/", (req, res, next) => {
    res.render("index.hbs");
  });


router.get('/searchcar', 
(req, res, next) => {
    axios.get(`https://api.nhtsa.gov/SafetyRatings/year/${req.query.carYear}`)
    .then((responseFromAPI) => {
        let carData = responseFromAPI.data[0];
        console.log("RESPONSE:", carData);
        res.render("carresults.hbs", carData);
    })
    .catch((err) => {
        console.log(err);
        res.send(err);
    })
});





module.exports = router
