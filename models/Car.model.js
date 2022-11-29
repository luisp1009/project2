const { Schema, model } = require("mongoose");

const carSchema = new Schema({
    make: { type: String },
    model: { type: String },
    year: { type: String },
    details: { type: String },
    imageUrl: { type: String },
    imageUrl1: { type: String },
    imageUrl2: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    reviews: [{type: Schema.Types.ObjectId, ref: "Review"}]
  });

  const Car = model('Car', carSchema)

  module.exports = Car
