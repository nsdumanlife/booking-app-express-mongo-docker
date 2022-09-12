const express = require('express')
const getLoggedInUser = require('../models/index')

const router = express.Router()

const getValueInput = () => {
  return document.querySelector('.search-input').value
}

/* GET home page. */
router.get('/', async (req, res) => {
  const user = await getLoggedInUser()

  res.render('index', { title: `Rent a Bungalow for Your Next Escape`, getValueInput, user, loggedIn: true })
})

router.get('/create-bungalow', async (req, res, next) => {
  try {
    const user = await getLoggedInUser()

    return res.render('create-bungalow', { title: `Become a host`, user, loggedIn: true })
  } catch (e) {
    return next(e)
  }
})

module.exports = router
