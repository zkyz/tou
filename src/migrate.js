import $ from 'jquery'
import './utils/jquery.addons'

import './migrate.scss'

export default () => {
  const element = {
    handle: $('<div class="tou-migrate-handle"/>'),
    body: $(document.body),
    tou: null,
    group: null,
    list: null,
    destination: null
  }

  const prop = {
    x: 0,
    y: 0
  }

  const event = {
    start (e) {
      e.preventDefault()
      e.stopPropagation()

      prop.x = e.pageX
      prop.y = e.pageY

      element.tou = $(this).parent()
      element.group = element.tou.parent()
      element.list = element.tou.closest('.tou-list')

      element.tou.addClass('tou-moving')
      element.list.addClass('tou-migrate')
      element.body
        .on('mousemove', event.drag)
        .on('mouseup', event.end)

      $('.tou-gap')
        .on('mouseenter', event.enter)
        .on('mouseleave', event.leave)
    },
    drag (e) {
      element.tou.css('transform', `translate(${e.pageX - prop.x}px, ${e.pageY - prop.y}px) ` +
        'scale(.5, .5) rotate(-1deg)')
    },
    enter () {
      const $this = $(this)

      if ($this.parent().is(element.group)) {
        element.destination = null
        $this.addClass('tou-migrate-not-allowed')
      }
      else if (parseInt($this.attr('data-width'))) {
        element.destination = $this
        $this.addClass('tou-migrate-allowed')
      }
    },
    leave () {
      element.destination = null
      $(this).removeClass('tou-migrate-allowed tou-migrate-not-allowed')
    },
    end: function () {
      $('.tou-migrate-allowed').toggleClass()
      $('.tou-migrate-not-allowed').toggleClass()

      if (element.destination) {
        const dataWidth = element.destination.attr('data-width')
        const touGroup = element.tou.closest('.tou-group')
        const touGapPrev = element.tou.prev('.tou-gap')
        const touGapNext = element.tou.next('.tou-gap')

        element.destination
          .removeAttr('data-width')
          .before(element.tou)

        element.tou
          .attr('data-width', dataWidth)
          .removeClass('tou-moving')
          .css({
            'transform': 'none',
            'transition': 'none'
          })
          .before('<div class="tou tou-gap"/>')

        if (!touGroup.has('.tou:not(.tou-gap)').length) {
          touGroup.remove()
        }
        else {
          const dataWidth = parseInt(element.tou.attr('data-width'))

          touGapPrev.remove()
          touGapNext.attr('data-width',
            (parseInt(element.tou.next('.tou-gap').attr('data-width')) || 0) + dataWidth)
        }
      }
      else {
        element.tou
          .removeClass('tou-moving')
          .css({
            'transition': 'transform .4s',
            'transform': 'none'
          })
          .cssRelease(400, {
            'transition': 'none'
          })
      }

      $('.tou-gap')
        .off('mouseenter', event.enter)
        .off('mouseleave', event.leave)

      element.body
        .off('mousemove', event.drag)
        .off('mouseup', event.end)

      element.list.removeClass('tou-migrate')

      element.destination = null
    }
  }

  element.handle
    .on('mousedown', event.start)

  $('.tou').not('.tou-gap')
    .on('mouseenter', function () {
      $(this).append(element.handle)
    })

  return {
    event
  }
}
