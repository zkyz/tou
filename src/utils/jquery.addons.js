import $ from 'jquery'

(function () {
  $.fn.attrSum = function (attr) {
    let sum = 0

    this.each((i, el) => {
      sum += parseInt(el.getAttribute(attr)) || 0
    })

    return sum
  }

  $.fn.attrMax = function (attr) {
    let max = 0
    let element = null

    this.each((i, el) => {
      const value = parseInt(el.getAttribute(attr)) || 0

      if (value >= max) {
        element = el
      }
    })

    return element ? $(element) : this
  }
})()
