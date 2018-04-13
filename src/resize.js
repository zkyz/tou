import $ from 'jquery'
import 'jquery-ui/ui/disable-selection'

import './resize.scss'

export default function () {
  'use strict'

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
    body: $(document.body),
    tou: null,
    gap: null,
    list: null,
    container: null
  }

  const event = {
    start () {
      element.tou = $(this).closest('.tou')
      element.gap = element.tou.prev('.tou-gap')
      element.list = element.tou.closest('.tou-list')
      element.container = element.tou.closest('.tou-group')

      prop.gridSize = prop.container.width() / 12
      prop.width = parseInt(element.tou.attr('data-width')) || 12
      prop.gapWidth = parseInt(prop.gap.attr('data-width')) || 0

      element.list.addClass('tou-resize-ing')
      element.container.on('mousemove', event.drag)
      element.body.on('mouseup', event.end).disableSelection()
    },
    drag (e) {
      const moveWidth = Math.round((e.pageX - prop.x) / prop.gridSize)
      element.tou.attr('data-width', prop.width - moveWidth)
      element.gap.attr('data-width', prop.gapWidth + moveWidth)
    },
    end () {
      element.list.removeClass('tou-resize-ing')
      element.container.off('mousemove', event.drag)
      element.body.off('mouseup', event.end).enableSelection()
    }
  }

  element.left.on('mousedown', function (e) {
    prop.side = SIDE_LEFT
    prop.x = e.pageX
    event.start()
  })

  element.right.on('mousedown', function (e) {
    prop.side = SIDE_RIGHT
    prop.x = e.pageX
    event.start()
  })
}
