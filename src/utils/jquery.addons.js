import $ from 'jquery'

(function () {
  $.fn.cssRelease = function (timer, props) {
    setTimeout((function (_this) {
      return function () {
        _this.css(props)
      }
    })($(this)), timer)
    return this
  }
})()
