const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')
const getDays = require('../helper/get-booking-days')

const bungalowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      autopopulate: { maxDepth: 2 },
    },
  ],
  bookedDates: [],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      autopopulate: { maxDepth: 2 },
    },
  ],
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
      autopopulate: { maxDepth: 1 },
    },
  ],
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    autopopulate: { maxDepth: 1 },
  },
})
class Bungalow {
  get rating() {
    const sumOfReviewsRates = this.reviews.reduce((sum, review) => sum + Number(review.rate), 0)

    return Math.ceil(sumOfReviewsRates / this.reviews.length)
  }

  checkAvailability(checkInDate, checkOutDate) {
    const newBookingDays = getDays(checkInDate, checkOutDate)

    return newBookingDays.every(date => !this.bookedDates.includes(date))
  }

  async addBooking(booking) {
    this.bookings.push(booking)
    this.bookedDates.push(...booking.bookingDays)

    await this.save()
  }

  async removeBooking(booking) {
    // remove the booked dates from bungalow's calendar
    const checkInDateStr = getDays(booking.checkInDate, booking.checkOutDate)

    const indexOfCheckInDate = this.bookedDates.indexOf(checkInDateStr)

    this.bookedDates.splice(indexOfCheckInDate, booking.bookingDays.length)

    // remove booking from bungalow bookings
    const indexOfBungalowBooking = this.bookings.indexOf(booking)

    this.bookings.splice(indexOfBungalowBooking, 1)

    await this.save()
  }

  addService(service, owner) {
    if (this.owner === owner) this.services.push(service)
  }
}
bungalowSchema.loadClass(Bungalow)
bungalowSchema.plugin(autopopulate)

module.exports = mongoose.model('Bungalow', bungalowSchema)
