import $ from 'jquery'
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
    position: {
      x: 0,
      y: 0
    }
  }

  const event = {
    start (e) {
      e.preventDefault()
      e.stopPropagation()

      prop.position = {
        x: e.pageX,
        y: e.pageY
      }

      element.tou = $(this).closest('.tou')
      element.group = element.tou.parent()
      element.list = element.tou.closest('.tou-list')

      element.list.addClass('tou-migrate')
      element.body
        .on('mousemove', event.drag)
        .on('mouseup', event.end)

      $('.tou-gap')
        .on('mouseenter', event.enter)
        .on('mouseleave', event.leave)
    },
    drag (e) {
      const distance = [
        e.pageX - prop.position.x,
        e.pageY - prop.position.y
      ]

      element.tou.css('transform', `translate(${distance[0]}px, ${distance[1]}px) ` +
        'scale(.5, .5) rotate(-5deg)')
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
      const $this = $(this)

      $this.removeClass('tou-migrate-allowed tou-migrate-not-allowed')

      if (!$this.data('width') || parseInt($this.data('width')) < 1) {
        return
      }

      if (element.destination) {
        const dataWidth = element.destination.attr('data-width')
        const touGroup = element.tou.closest('.tou-group')
        const touGapPrev = element.tou.prev('.tou-gap')
        const touGapNext = element.tou.next('.tou-gap')

        element.destination
          .removeAttr('data-width')
          .before(element.tou)

        element.tou
          .css({
            'background-color': '#369',
            'transform': 'none',
            'transition': 'outline,background-color .5s'
          })
          .delay(500)
          .css({
            'background-color': ''
          })
          .attr('data-width', dataWidth)
          .before('<div class="tou tou-gap" id="x"/>')

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
          .delay(500)
          .css({
            'transition': 'non'
          })
      }

      $('.tou-list').removeClass('tou-movement')

      $('.tou-gap')
        .off('mouseenter', event.enter)
        .off('mouseleave', event.leave)

      element.body
        .off('mousemove', event.drag)
        .off('mouseup', event.end)

      element.destination = null
    }
  }

  return {
    event
  }
}
