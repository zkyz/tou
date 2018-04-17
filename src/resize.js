import $ from 'jquery'
import 'jquery-ui/ui/disable-selection'

import './resize.scss'

export default () => {
  const SIDE_LEFT = 'LEFT'
  const SIDE_RIGHT = 'RIGHT'

  const prop = {
    side: '',
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    gridSize: 0,
    gapSize: 0
  }

  const element = {
    handle: $('<div class="tou-resize-handle"/>'),
    left: $('<div class="tou-resize-handle tou-resize-handle-left"/>'),
    right: $('<div class="tou-resize-handle tou-resize-handle-right"/>'),
    bottom: $('<div class="tou-resize-handle tou-resize-handle-bottom"/>'),
    unfix: $('<a class="tou-unfix-handle"/>'),
    body: $(document.body),
    tou: null,
    gap: null,
    list: null,
    group: null
  }

  const event = {
    start (e) {
      e.preventDefault()
      e.stopPropagation()

      element.group = element.tou.parent()
      element.list = element.tou.closest('.tou-list')
      element.gap = element.tou[prop.side === SIDE_LEFT ? 'prev' : 'next']('.tou-gap')

      prop.gridSize = element.group.width() / 12
      prop.width = parseInt(element.tou.attr('data-width')) || 12
      prop.gapWidth = parseInt(element.gap.attr('data-width')) || 0

      element.list.addClass('tou-resize-ing')
      element.body
        .on('mousemove', event.drag)
        .on('mouseup', event.end).disableSelection()
    },
    drag (e) {
      let moveWidth = Math.round((e.pageX - prop.x) / prop.gridSize)

      if (prop.side === SIDE_RIGHT) {
        moveWidth *= -1
      }

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
    .before('<div class="tou tou-gap"/>')
    .on('click', function () {
      $('.tou-selected').removeClass('tou-selected')
      $(this)
        .addClass('tou-selected')
        .append(element.left)
        .append(element.right)
        .append(element.bottom)
        .append(element.unfix)
    })

  $('.tou-group')
    .append('<div class="tou tou-gap"/>')
}
