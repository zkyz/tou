import $ from 'jquery'
import 'jquery-ui/ui/disable-selection'

import * as undo from './undo'

import './group-migrate.scss'

const prop = {}

const element = {
  handle: $('<div class="tou-migrate-handle tou-group-handle"/>'),
  pseudo: $('<div class="tou-group-pseudo"/>'),
  assist: $('<div class="tou-group-assist">' +
    '<a role="copy"><i class="material-icons" title="복사">content_copy</i></a>' +
    '<a role="delete"><i class="material-icons" title="삭제">delete</i></a>' +
    '</div>'),
  body:   $(document.body)
}

const event = {
  start (e) {
    element.group = $(this).parent()
    element.list = element.group.parent()

    prop.y = e.pageY
    prop.top = element.group.position().top
    prop.width = element.group.width()
    prop.height = element.group.height()
    prop.ref = element.group.next().length
      ? ['before', element.group.next()]
      : ['append', element.list]

    console.log(element.group.next())

    element.pseudo.css({
      'display': 'block',
      'width':   prop.width,
      'height':  prop.height
    })

    element.group
      .addClass('tou-group-ing')
      .css({
        'width':  prop.width,
        'height': prop.height
      })
      .after(element.pseudo)

    element.list.addClass('tou-group-moving')

    element.body
      .on('mousemove', event.drag)
      .on('mouseup', event.end)
      .disableSelection()
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
            top:    'auto',
            width:  'auto'
          })

        const target = element.group.next()
        undo.save(undo.TYPES.GROUP.MIGRATE, element.group, prop.ref,
          target.length
            ? ['before', target]
            : ['append', element.list]
        )
      })

    element.list
      .removeClass('tou-group-moving')

    element.body
      .off('mousemove', event.drag)
      .off('mouseup', event.end)
      .enableSelection()
  }
}

export default () => {
  element.handle.on('mousedown', event.start)

  element.assist.find('[role=copy]')
    .on('click', function () {
      const group = $(this).closest('.tou-group')

      const clone = group.clone(true)
      clone.find('.tou-group-assist').remove()
      clone.find('.tou-migrate-handle').remove()
      clone.find('.tou-resize-handle').remove()
      clone.find('.tou-unfix-handle').remove()
      clone.find('.tou-selected').removeClass('tou-selected')

      group.after(clone)

      undo.save(undo.TYPES.GROUP.COPY, clone, group.prev(), group.next())
    })

  element.assist.find('[role=delete]')
    .on('click', function () {
      const group = $(this).closest('.tou-group')

      undo.save(undo.TYPES.GROUP.DELETE, group, group.prev(), group.next())

      undo.recyclebin(group)
    })

  $('.tou-group').on('mouseenter', initialize)
}

export function initialize () {
  $(this)
    .append(element.handle)
    .append(element.assist)
}
