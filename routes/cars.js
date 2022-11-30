const express = require('express')
const router = express.Router();
const {isLoggedIn, isAnon} = require('../middleware/isLoggedIn')
const isOwner = require('../middleware/isOwner')
const Car = require('../models/Car.model')
const Review = require('../models/Review.model');

router.get('/search-car', isLoggedIn,  (req, res, next) => {
    res.render('index.hbs')
        return;
})


router.get('/create-car', isLoggedIn,  (req, res, next) => {
    res.render('car-views/create-car.hbs')
        return;
})

router.post('/create-car', isLoggedIn, (req, res, next) => {
    if (!req.body.make || !req.body.model || !req.body.details || !req.body.year)
    {
        res.render('car-views/create-car.hbs', {message: "All fields are required to list a car"})
        return;
    }

    Car.create ({
        make: req.body.make,
        model: req.body.model,
        details: req.body.details,
        year: req.body.year,
        imageUrl: req.body.imageUrl,
        imageUrl1: req.body.imageUrl1,
        imageUrl2: req.body.imageUrl2,
        owner: req.session.user._id
    })
    .then((createdCar) => {
        console.log("THIS IS THE CAR I CREATED", createdCar)
        res.redirect('/cars/cars-list')      
    })
    .catch((err) => {
        console.log(err)
    });
})

router.get('/cars-list', (req, res, next) => {
    Car.find()
    .populate({
        path: "reviews",
        populate:{
            path: "user",
        },
    })
    .then((foundCars) => {
        res.render('car-views/all-cars.hbs', {foundCars})
    })
    .catch((err) => {
        console.log(err)
    })
})

router.post('/:id/delete-car', isOwner, (req, res, next) => {
    Car.findById(req.params.id)
    .then((foundCar) => {
        foundCar.delete()
        res.redirect('/cars/cars-list')
    })
    .catch((err) => {
        console.log(err)
    })
});

    router.get('/:id/edit-car', isOwner, (req, res, next) => {

        Car.findById(req.params.id)
            .then ((foundCar) => { 
            
                console.log("THIS IS THE CAR I WANT TO EDIT", foundCar)
                res.render('car-views/edit-car.hbs', foundCar)
            })
        .catch((err) => {
            console.log(err)
          })
    })

   

    router.post('/:id/edit-car', isOwner, (req, res, next) => {
        Car.findByIdAndUpdate(
            req.params.id,
            {
                make: req.body.make,
                model: req.body.model,
                year: req.body.year,
                details: req.body.details,
                imageUrl: req.body.imageUrl,
                imageUrl1: req.body.imageUrl1,
                imageUrl2: req.body.imageUrl2,
                },
                {new: true} 
        )
        .then((updateCar) => {
            console.log("changed car:", updateCar)
            res.redirect('/cars/cars-list')
        })
        .catch((err) => {
            console.log(err)
          })
    
})




module.exports = router