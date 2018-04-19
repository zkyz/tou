import $ from 'jquery'
import 'jquery-ui/ui/disable-selection'

import './resize.scss'

export default () => {
  const SIDE_LEFT = 'left'
  const SIDE_RIGHT = 'right'

  const prop = {
    size: {}
  }

  const element = {
    handle: $('<div class="tou-resize-handle"/>'),
    left:   $('<div class="tou-resize-handle tou-resize-handle-left"/>'),
    right:  $('<div class="tou-resize-handle tou-resize-handle-right"/>'),
    bottom: $('<div class="tou-resize-handle tou-resize-handle-bottom"/>'),
    unfix:  $('<a class="tou-unfix-handle"/>'),
    body:   $(document.body)
  }

  const event = {
    start (e) {
      e.preventDefault()
      e.stopPropagation()

      element.group = element.tou.parent()
      element.list = element.tou.closest('.tou-list')

      prop.size.grid = element.group.width() / 12
      prop.size.gap = parseInt(element.tou.attr('data-gap')) || 0
      prop.size.width = parseInt(element.tou.attr('data-width')) || 12

      element.next = element.tou.next()
      if (element.next.length === 0) {
        prop.size.next = {
          gap: 0,
          width: 0
        }
      }
      else {
        prop.size.next = {
          gap: parseInt(element.next.attr('data-gap')) || 0,
          width: parseInt(element.next.attr('data-width'))
        }
      }

      element.list.addClass('tou-resize-ing')
      element.body.on('mousemove', event.drag)
                  .on('mouseup', event.end)
                  .disableSelection()
    },
    drag (e) {
      let moveWidth = Math.round((e.pageX - prop.x) / prop.size.grid)


      let width = prop.width - moveWidth
      if (width < 1) {
        width = 1
      }

      let gapWidth = prop.gapSize + moveWidth
      if (gapWidth + width + prop.otherGapSize > 12) {
        gapWidth = 12 - width - prop.otherGapSize
      }

      element.tou
        .attr('data-width', width)
        .attr(`data-gap-${prop.side}`, gapWidth)
    },
    end () {
      element.list.removeClass('tou-resize-ing')
      element.body
        .off('mousemove', event.drag)
        .off('mouseup', event.end).enableSelection()
    }
  }

  element.left.on('mousedown', function (e) {
    prop.side = SIDE_LEFT
    prop.x = e.pageX

    element.tou = $(this).parent()

    event.start(e)
  })

  element.right.on('mousedown', function (e) {
    prop.side = SIDE_RIGHT
    prop.x = e.pageX

    element.tou = $(this).parent()

    event.start(e)
  })

  element.bottom.on('mousedown', function (e) {
    e.preventDefault()
    e.stopPropagation()

    element.tou = $(this).parent().find('.tou-item')

    prop.y = e.pageY
    prop.height = element.tou.height()

    const drag = function (e) {
      element.tou.height(prop.height + e.pageY - prop.y)
    }

    const end = () => {
      element.tou.parent().addClass('tou-fixed-height')
      element.body
        .off('mousemove', drag)
        .off('mouseup', end)
        .enableSelection()
    }

    element.body
      .on('mousemove', drag)
      .on('mouseup', end)
      .disableSelection()
  })

  element.unfix.on('click', function () {
    $(this).parent()
      .removeClass('tou-fixed-height')
      .find('.tou-item')
      .height('auto')
  })

  $('.tou')
    .on('click', function () {
      $('.tou-selected').removeClass('tou-selected')
      $(this)
        .addClass('tou-selected')
        .append(element.left)
        .append(element.right)
        .append(element.bottom)
        .append(element.unfix)
    })
}
