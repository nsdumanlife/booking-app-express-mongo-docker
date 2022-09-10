const express = require('express')

const router = express.Router()

const getValueInput = () => {
  return document.querySelector('.search-input').value
}

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: `Rent a Bungalow for Your Next Escape`, getValueInput })
})

module.exports = router
