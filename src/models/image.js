const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
  src: String,
  alt: String,
})

// class Image {
// 	// add methods here
// }

// imageSchema.loadClass(Image)

module.exports = mongoose.model('Image', imageSchema)
