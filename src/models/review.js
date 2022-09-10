const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')

const reviewSchema = new mongoose.Schema({
  text: String,
  rate: Number,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: { maxDepth: 1 },
  },
})
class Review {
  // Add methods here
}

reviewSchema.loadClass(Review)
reviewSchema.plugin(autopopulate)

module.exports = mongoose.model('Review', reviewSchema)
