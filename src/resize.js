import $ from 'jquery'
import 'jquery-ui/ui/disable-selection'

import './resize.scss'

export default () => {
  const SIDE_LEFT = 'LEFT'
  const SIDE_RIGHT = 'RIGHT'

  const prop = {
    side: '',
    width: 0,
    x: 0,
    gridSize: 0,
    gapSize: 0
  }

  const element = {
    left: $('<div class="tou-resize-handle tou-resize-handle-left"/>'),
    right: $('<div class="tou-resize-handle tou-resize-handle-right"/>'),
    bottom: $('<div class="tou-resize-handle tou-resize-handle-bottom"/>'),
    body: $(document.body),
    tou: null,
    gap: null,
    list: null,
    group: null
  }

  const event = {
    start () {
      element.group = element.tou.parent()
      element.list = element.tou.closest('.tou-list')
      element.gap = element.tou.prev('.tou-gap')

      prop.gridSize = element.group.width() / 12
      prop.width = parseInt(element.tou.attr('data-width')) || 12
      prop.gapWidth = parseInt(element.gap.attr('data-width')) || 0

      element.list.addClass('tou-resize-ing')
      element.body
        .on('mousemove', event.drag)
        .on('mouseup', event.end).disableSelection()
    },
    drag (e) {
      const moveWidth = Math.round((e.pageX - prop.x) / prop.gridSize)
      element.tou.attr('data-width', prop.width - moveWidth)
      element.gap.attr('data-width', prop.gapWidth + moveWidth)
    },
    end () {
      element.list.removeClass('tou-resize-ing')
      element.body
        .off('mousemove', event.drag)
        .off('mouseup', event.end).enableSelection()
    }
  }

  element.left.on('mousedown', function (e) {
    e.preventDefault()
    e.stopPropagation()

    prop.side = SIDE_LEFT
    prop.x = e.pageX

    element.tou = $(this).parent()

    event.start()
  })

  element.right.on('mousedown', function (e) {
    e.preventDefault()
    e.stopPropagation()

    prop.side = SIDE_RIGHT
    prop.x = e.pageX

    element.tou = $(this).parent()

    event.start()
  })

  element.bottom.on('mousedown', function (e) {
  })

  $('.tou')
    .on('click', function () {
      $('.tou-selected').removeClass('tou-selected')
      $(this)
        .addClass('tou-selected')
        .append(element.left)
        .append(element.right)
        .append(element.bottom)
    })
}
