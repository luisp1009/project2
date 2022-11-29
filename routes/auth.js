const express = require('express')
const router = express.Router();
const axios = require("axios");
const User = require('../models/User.model')
const session = require("express-session");
const bcryptjs = require('bcryptjs');
const saltRounds = 10

const {isLoggedIn, isAnon} = require("../middleware/isLoggedIn")

//////// login router /////////
router.get('/login', isAnon ,(req, res, next) => {
    res.render('auth-views/login.hbs')
})

router.post('/login', isAnon, (req, res, next) => {
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
                res.redirect('/cars/search-car')
            } else {
                res.render('auth-views/login', {message: "You have entered a wrong username or password"})
            }
        }
    })
})

//////// signup router /////////
router.get('/signup', isAnon, (req, res, next) => {
    res.render('auth-views/signup')
})

router.post('/signup', isAnon, (req, res, next) => {
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
router.get('/logout', isLoggedIn,  (req, res, next) => {
    req.session.destroy()
    res.redirect('/')
})





//////// fetch data from API/////////
router.get("/", (req, res, next) => {
    res.render("index.hbs");
  });
  
  router.get(
    "/searchCar",
    (req, res, next) => {
      if (!req.session.user) {
        res.redirect("/auth/login");
        return;
      }
      next();
    },
    (req, res, next) => {
      axios.get(`https://api.nhtsa.gov/SafetyRatings/modelyear/${req.query.carYear}/make/${req.query.carMake}/model/${req.query.carModel}`)
        .then((responseFromAPI) => {
          let carData = responseFromAPI.data;
          console.log("RESPONSE:", carData);
  
          res.render("results.hbs", {carArray: carData.Results});
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    }
  );


  router.get(
    "/carDetails/:carId",
    (req, res, next) => {
      if (!req.session.user) {
        res.redirect("/auth/login");
        return;
      }
      next();
    },
    (req, res, next) => {
      axios.get(`https://api.nhtsa.gov/SafetyRatings/VehicleId/${req.params.carId}`)
        .then((responseFromAPI) => {
          let carData = responseFromAPI.data.Results[0];
          console.log("RESPONSE:", carData);
  
          res.render("safetyResults.hbs", carData);
        })
        .catch((err) => {
          console.log(err);
          res.send(err);
        });
    }
  );




module.exports = router
