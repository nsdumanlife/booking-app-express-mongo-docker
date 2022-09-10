const getDuration = require('./get-duration')

module.exports = function getDays(startDate, endDate) {
  const newBookingDays = [...Array(getDuration(startDate, endDate)).keys()].map(index => {
    const date = new Date(startDate)
    date.setDate(date.getDate() + index)
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  })

  return newBookingDays
}
