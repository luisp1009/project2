const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const carSchema = new Schema({
    make: { type: String },
    model: { type: String },
    year: { type: String },
    details: { type: String },
    imageUrlArray: { type: [String] },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    reviews: [{type: Schema.Types.ObjectId, ref: "Review"}]
  });

  const Car = model('Car', carSchema)

  module.exports = Car
