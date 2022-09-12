const mongoose = require('mongoose')
const autopopulate = require('mongoose-autopopulate')
const Booking = require('./booking')
const Review = require('./review')
const Bungalow = require('./bungalow')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: Number,
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      autopopulate: { maxDepth: 2 },
    },
  ],
  ownedBungalows: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bungalow',
      autopopulate: { maxDepth: 1 },
    },
  ],
})

class User {
  get profile() {
    return `${this.firstName} ${this.lastName} has ${this.bookings.length} ${
      this.bookings.length <= 1 ? 'booking' : 'bookings'
    }`
  }

  async book(bungalow, checkInDate, checkOutDate) {
    if (checkInDate - Date.now() < 0) throw new Error('Enter a valid date for check-in date')

    if (bungalow.checkAvailability(checkInDate, checkOutDate)) {
      const newBooking = await Booking.create({ guest: this, bungalow, checkInDate, checkOutDate })

      await bungalow.addBooking(newBooking)
      await this.bookings.push(newBooking)

      await this.save()
      await bungalow.save()

      // TODO:
      // do payment
      // create invoice
      // send confirmation email attached with invoice to user
    } else {
      throw new Error('Please select different date')
    }
  }

  async review(bungalow, text, rate) {
    const review = await Review.create({ text, rate, author: this })

    bungalow.reviews.push(review)

    await bungalow.save()
    await this.save()
  }

  async cancelBooking(booking) {
    // set booking status to cancelled
    booking.cancel()

    // remove from user's bookings
    const indexOfUserBooking = this.bookings.indexOf(booking)

    this.bookings.splice(indexOfUserBooking, 1)

    await this.save()
    await booking.save()

    // refund money to user
    // send email to user
  }

  async createBungalow(name, location, capacity, price) {
    // check services, maybe create addService method at bungalow model?
    const bungalow = await Bungalow.create({ name, location, capacity, price, owner: this })

    this.ownedBungalows.push(bungalow)

    await this.save()

    return bungalow
  }
}

userSchema.loadClass(User)
userSchema.plugin(autopopulate)

module.exports = mongoose.model('User', userSchema)
