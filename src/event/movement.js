import $ from 'jquery'

export default {
  start (e) {
    e.preventDefault()
    e.stopPropagation()

    const handle = $(this)
    handle.moving = true
    handle.target = handle.closest('.tou').addClass('tou-moving')
    handle.parent = handle.target.parent()
    handle.start = [e.pageX, e.pageY]

    $('.tou-gap')
      .on('mouseenter', handle.event.placeholder.enter)
      .on('mouseleave', handle.event.placeholder.leave)

    $('body')
      .on('mousemove', handle.event.move)
      .on('mouseup', handle.event.end)

    $('.tou-list').addClass('tou-movement')
  },
  move (e) {
    const
    const distance = [
      e.pageX - touMoveHandle.start[0],
      e.pageY - touMoveHandle.start[1]
    ]
    touMoveHandle.target.css('transform', `translate(${distance[0]}px, ${distance[1]}px) scale(.5, .5) rotate(-5deg)`)
  },
  placeholder: {
    enter: function () {
      const $this = $(this)

      $this.removeClass('tou-not-allowed')

      if ($this.parent().is(touMoveHandle.parent)) {
        $this.addClass('tou-not-allowed')
      } else if (parseInt($this.attr('data-width'))) {
        touMoveHandle.destination = $(this).addClass('tou-ready-drop')
      }
    },
    leave: function () {
      $(this).removeClass('tou-ready-drop')
      touMoveHandle.destination = null
    }
  },
  end:         function () {
    touMoveHandle.moving = false
    $('.tou-not-allowed').removeClass('tou-not-allowed')

    if (touMoveHandle.destination) {
      const dataWidth = touMoveHandle.destination.attr('data-width')
      const touGroup = touMoveHandle.target.closest('.tou-group')
      const touGapPrev = touMoveHandle.target.prev('.tou-gap')
      const touGapNext = touMoveHandle.target.next('.tou-gap')

      touMoveHandle.destination
        .removeAttr('data-width')
        .removeClass('tou-ready-drop')
        .before(touMoveHandle.target)

      touMoveHandle.target
        .removeClass('tou-moving')
        .css({
          'transition':       'outline,background-color .5s',
          'transform':        'none',
          'background-color': '#369'
        })
        .attr('data-width', dataWidth)
        .before('<div class="tou tou-gap" id="x"/>')

      setTimeout(function () {
        touMoveHandle.target
          .css({
            'background-color': '',
            'outline':          'none'
          })
      }, 500)

      if (!touGroup.find('.tou:not(.tou-gap)').length) {
        touGroup.remove()
      } else {
        touGapPrev.remove()
        touGapNext.attr('data-width',
          parseInt(touMoveHandle.target.next('.tou-gap').attr('data-width') || 0) + parseInt(touMoveHandle.target.attr('data-width')))
      }
    } else {
      touMoveHandle.target
        .removeClass('tou-moving')
        .css({
          'transition': 'transform .4s',
          'transform':  'none'
        })

      setTimeout(() => touMoveHandle.target.css('transition', 'none'), 500)
    }

    $('.tou-gap')
      .off('mouseenter', touMoveHandle.event.placeholder.enter)
      .off('mouseleave', touMoveHandle.event.placeholder.leave)

    $('body')
      .off('mousemove', touMoveHandle.event.move)
      .off('mouseup', touMoveHandle.event.end)

    $('.tou-list').removeClass('tou-movement')
    touMoveHandle.destination = null
  }
}