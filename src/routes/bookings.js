const express = require('express')

const getLoggedInUser = require('../models/index')

const router = express.Router()

/* GET bookings listing. */
router.get('/', async (req, res, next) => {
  try {
    const user = await getLoggedInUser()

    return res.render('bookings', { title: 'Bookings', user, loggedIn: true })
  } catch (e) {
    return next(e)
  }
})

module.exports = router
