import $ from 'jquery'

export const moveProps = {}

const movement = {
  start (e) {
    e.preventDefault()
    e.stopPropagation()

    moveProps.moving = true
    moveProps.target = window.tou.elements.move.closest('.tou').addClass('tou-moving')
    moveProps.parent = moveProps.target.parent()
    moveProps.start = [e.pageX, e.pageY]

    $('.tou-gap')
      .on('mouseenter', movement.placeholder.enter)
      .on('mouseleave', movement.placeholder.leave)

    $(document.body)
      .on('mousemove', movement.move)
      .on('mouseup', movement.end)

    $('.tou-list').addClass('tou-movement')
  },
  move (e) {
    moveProps.target.css('transform',
      `translate(${e.pageX - moveProps.start[0]}px, ${e.pageY - moveProps.start[1]}px)` +
      ' scale(.5, .5) rotate(-5deg)')
  },
  placeholder: {
    enter () {
      const $this = $(this)

      $this.removeClass('tou-not-allowed')

      if ($this.parent().is(moveProps.parent)) {
        $this.addClass('tou-not-allowed')
      } else if (parseInt($this.attr('data-width'))) {
        moveProps.destination = $(this).addClass('tou-ready-drop')
      }
    },
    leave () {
      $(this).removeClass('tou-ready-drop')
      moveProps.destination = null
    }
  },
  end () {
    moveProps.moving = false

    $('.tou-not-allowed').removeClass('tou-not-allowed')

    if (moveProps.destination) {
      const dataWidth = moveProps.destination.attr('data-width')
      const touGroup = moveProps.target.closest('.tou-group')
      const touGapPrev = moveProps.target.prev('.tou-gap')
      const touGapNext = moveProps.target.next('.tou-gap')

      moveProps.destination
        .removeAttr('data-width')
        .removeClass('tou-ready-drop')
        .before(moveProps.target)

      moveProps.target
        .removeClass('tou-moving')
        .css({
          'transition': 'outline,background-color .5s',
          'transform': 'none',
          'background-color': '#369'
        })
        .attr('data-width', dataWidth)
        .before('<div class="tou tou-gap" id="x"/>')

      setTimeout(() => moveProps.target.css({
        'background-color': '',
        'outline': ''
      }), 500)

      if (!touGroup.find('.tou:not(.tou-gap)').length) {
        touGroup.remove()
      } else {
        touGapPrev.remove()
        touGapNext.attr('data-width',
          (parseInt(touGapNext.attr('data-width')) || 0) + parseInt(moveProps.target.attr('data-width')))
      }
    } else {
      moveProps.target
        .removeClass('tou-moving')
        .css({
          'transition': 'transform .4s',
          'transform': 'none'
        })

      setTimeout(() => moveProps.target.css('transition', 'none'), 500)
    }

    $('.tou-gap')
      .off('mouseenter', movement.placeholder.enter)
      .off('mouseleave', movement.placeholder.leave)

    $('body')
      .off('mousemove', movement.move)
      .off('mouseup', movement.end)

    $('.tou-list').removeClass('tou-movement')
    moveProps.destination = null
  }
}

export default movement
