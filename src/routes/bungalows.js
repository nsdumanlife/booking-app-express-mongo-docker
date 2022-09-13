const express = require('express')
const Bungalow = require('../models/bungalow')
const getLoggedInUser = require('../models/index')

const router = express.Router()

/* GET bungalows listing. */
router.get('/', async (req, res, next) => {
  try {
    const bungalows = await Bungalow.find({})

    const user = await getLoggedInUser()

    // if (req.query.name) {
    // 	return res.send(bungalows.filter(bungalow => bungalow.name.toLowerCase() === req.query.name.toLowerCase()))
    // }

    // res.send(bungalows)
    return res.render('bungalows', { title: `Rent a Bungalow for Your Next Escape`, bungalows, user })
  } catch (e) {
    return next(e)
  }
})
/* GET bungalow detail page. */
router.get('/:bungalowId', async (req, res, next) => {
  try {
    const bungalow = await Bungalow.findById(req.params.bungalowId)

    // if (bungalow) res.send(bungalow)
    if (bungalow) res.render('bungalow', { title: `Bungalow ${bungalow.name}`, bungalow })
    else res.sendStatus(404)
  } catch (e) {
    next(e)
  }
})
/* POST/create new booking. */
router.post('/:bungalowId', async (req, res) => {
  const bungalow = await Bungalow.findById(req.params.bungalowId)

  if (!bungalow)
    return res.render('error', {
      error: { status: 404 },
      message: `No bungalow found`,
    })

  const user = await getLoggedInUser()
  await user.book(bungalow, new Date(req.body.checkInDate), new Date(req.body.checkOutDate))

  return res.redirect('/bookings')
})
/* POST/create new review. */
router.post('/:bungalowId/reviews', async (req, res) => {
  const bungalow = await Bungalow.findById(req.params.bungalowId)
  const user = await getLoggedInUser()

  if (!bungalow)
    return res.render('error', {
      error: { status: 404 },
      message: `No bungalow found`,
    })

  await user.review(bungalow, req.body.text, req.body.rate)
  return res.redirect(`/bungalows/${bungalow.id}`)
})
/* POST/create new bungalow */
router.post('/', async (req, res) => {
  const user = await getLoggedInUser()

  const bungalow = await user.createBungalow(req.body.name, req.body.location, req.body.capacity, req.body.price)

  return res.redirect(`/bungalows`)
})

module.exports = router
