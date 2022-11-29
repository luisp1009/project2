const express = require('express');
const router = express.Router();
const Review = require('../models/Review.model');
const Car = require('../models/Car.model');
const isNotOwner = require('../middleware/isNotOwner')
const {isLoggedIn, isAnon} = require('../middleware/isLoggedIn')


router.get('/:id/add-reviews', 
isLoggedIn,
isNotOwner, (req, res, next) => {
    res.render('comment-views/add-reviews.hbs', {carId: req.params.id})
})

router.post('/:id/add-reviews', isNotOwner, (req, res, next) => {
    Review.create({
        user: req.session.user._id,
        comment: req.body.comment
    })
    .then((newReview) => {
        Car.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { reviews: newReview._id } }
             , 
            {new: true}
            )
            .then((updatedCar) => {
                res.redirect('/cars/cars-list')
            })
            .catch((err) => {
                console.log(err)
            })
    })
    .catch((err) => {
        console.log(err)
    })
})


module.exports = router