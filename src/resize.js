import $ from 'jquery'
import 'jquery-ui/ui/disable-selection'

import './resize.scss'

const prop = {}

const element = {
  right:  $('<div class="tou-resize-handle tou-resize-handle-right"/>'),
  bottom: $('<div class="tou-resize-handle tou-resize-handle-bottom"/>'),
  unfix:  $('<a class="tou-unfix-handle"/>'),
  body:   $(document.body)
}

const event = {
  horizontal: {
    start (e) {
      element.tou = $(this).parent()
      element.group = element.tou.parent()
      element.list = element.tou.closest('.tou-list')

      prop.x = e.pageX
      prop.width = parseInt(element.tou.attr('data-width'))
      prop.max = 12 - element.group.find('.tou').not(element.tou).attrSum('data-width')
      prop.cellsize = element.group.width() / 12

      element.list.addClass('tou-resize-ing')

      element.body
        .on('mousemove', event.horizontal.drag)
        .on('mouseup', event.horizontal.end)
        .disableSelection()
    },
    drag (e) {
      let movement = Math.round((e.pageX - prop.x) / prop.cellsize)

      let width = prop.width + movement
      if (width < 1) {
        width = 1
      }

      if (width > prop.max) {
        width = prop.max
      }

      element.tou
        .attr('data-width', width)
    },
    end () {
      element.list.removeClass('tou-resize-ing')
      element.body
        .off('mousemove', event.horizontal.drag)
        .off('mouseup', event.horizontal.end)
        .enableSelection()
    }
  },
  vertical:   {
    start (e) {
      element.tou = $(this).parent().find('.tou-item')

      prop.y = e.pageY
      prop.height = element.tou.height()

      element.body
        .on('mousemove', event.vertical.drag)
        .on('mouseup', event.vertical.end)
        .disableSelection()
    },
    drag (e) {
      element.tou.height(prop.height + e.pageY - prop.y)
    },
    end () {
      element.tou.parent().addClass('tou-fixed-height')
      element.body
        .off('mousemove', event.vertical.drag)
        .off('mouseup', event.vertical.end)
        .enableSelection()
    }
  }
}

export default () => {
  element.right.on('mousedown', event.horizontal.start)
  element.bottom.on('mousedown', event.vertical.start)

  element.unfix.on('click', function () {
    $(this)
      .parent()
      .removeClass('tou-fixed-height')
      .find('.tou-item')
      .height('auto')
  })

  // apply all of .tou
  $('.tou').on('click', initialize)
}

export function initialize () {
  $('.tou-selected')
    .removeClass('tou-selected')

  $(this)
    .addClass('tou-selected')
    .append(element.right)
    .append(element.bottom)
    .append(element.unfix)
}
