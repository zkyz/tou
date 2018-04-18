import $ from 'jquery'
import 'jquery-ui/ui/disable-selection'

import './group-migrate.scss'

export default () => {
  const element = {
    handle: $('<div class="tou-migrate-handle tou-group-handle"/>'),
    pseudo: $('<div class="tou-group-pseudo"/>'),
    group: null,
    list: null,
    body: $(document.body)
  }

  const prop = {
    y: 0,
    top: 0
  }

  const event = {
    enter () {
      $(this).append(element.handle)
    },
    start (e) {
      element.group = $(this).closest('.tou-group')

      prop.y = e.pageY
      prop.top = element.group.position().top
      prop.width = element.group.width()
      prop.height = element.group.height()

      element.list = $(this).closest('.tou-list')
        .addClass('tou-group-moving')

      element.body
        .on('mousemove', event.drag)
        .on('mouseup', event.end)
        .disableSelection()

      element.pseudo.css({
        'display': 'block',
        'width': prop.width,
        'height': prop.height
      })

      element.group
        .addClass('tou-group-ing')
        .css({
          'width': prop.width,
          'height': prop.height
        })
        .after(element.pseudo)
    },
    drag (e) {
      element.group.css({
        'top': prop.top + e.pageY - prop.y
      })

      const target = $(e.target).closest('.tou-group')
      if (target.length) {
        target[target.offset().top + 25 < e.pageY ? 'after' : 'before'](element.pseudo)
      }
    },
    end () {
      element.group
        .animate({
          'top': element.pseudo.position().top
        }, 500, () => {
          element.pseudo
            .after(element.group)
            .hide()

          element.group
            .removeClass('tou-group-ing')
            .css({
              height: 'auto',
              top: 'auto',
              width: 'auto'
            })
        })

      element.list
        .removeClass('tou-group-moving')

      element.body
        .off('mousemove', event.drag)
        .off('mouseup', event.end)
        .enableSelection()
    }
  }

  element.handle
    .on('mousedown', event.start)

  $('.tou-group')
    .on('mouseenter', event.enter)
}
