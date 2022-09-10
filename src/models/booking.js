const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')
const getDays = require('../helper/get-booking-days')

const bookingSchema = new mongoose.Schema({
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: { maxDepth: 1 },
  },
  bungalow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bungalow',
    autopopulate: { maxDepth: 1 },
  },
  checkInDate: Date,
  checkOutDate: Date,
  isReviewed: Boolean,
  cancelled: Boolean,
})

class Booking {
  get bookingDays() {
    return getDays(this.checkInDate, this.checkOutDate)
  }

  get totalPrice() {
    return this.bungalow.price * this.bookingDays.length
  }

  // completed, cancelled, upcoming
  get status() {
    if (Date.now() > this.checkOutDate) return 'Completed'
    return 'Upcoming'
  }

  async cancel() {
    if (this.cancelled) throw new Error('This booking is already cancelled.')

    this.cancelled = true
    // remove booking from bungalow's booking list
    this.bungalow.removeBooking(this)

    await this.save()
  }
}

bookingSchema.loadClass(Booking)
bookingSchema.plugin(autopopulate)

module.exports = mongoose.model('Booking', bookingSchema)
