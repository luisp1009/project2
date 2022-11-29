const Car = require('../models/Car.model')

const isNotOwner = (req, res, next) => {
    Car.findById(req.params.id)
    .then((foundCar) => {
        if (String(foundCar.owner) !== String(req.session.user._id)) {
            next()
        } else {
            res.render('car-views/all-cars.hbs', {message: "You don't have permission."})
        }
    })
    .catch((err) => {
        console.log(err)
    })
}

module.exports = isNotOwner