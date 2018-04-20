import $ from 'jquery'
import {initialize as groupInitialize} from './group-migrate'
import './utils/jquery.addons'
import './migrate.scss'

const prop = {}

const element = {
  handle:      $('<div class="tou-migrate-handle"/>'),
  guide:       $('<div class="tou-migrate-guide"/>'),
  body:        $(document.body),
  tou:         null,
  group:       null,
  list:        null,
  destination: null
}

const event = {
  start (e) {
    e.preventDefault()

    element.tou = $(this).parent()
    element.group = element.tou.parent()
    element.list = element.group.parent()

    prop.x = e.pageX
    prop.y = e.pageY

    element.tou.addClass('tou-moving')
    element.list.addClass('tou-migrate')
      .find('.tou').not(element.tou)
      .on('mouseenter', event.enter)
      .on('mousemove', event.move)

    element.body
      .on('mousemove', event.drag)
      .on('mouseup', event.end)
  },
  drag (e) {
    element.tou.css('transform', `translate(${e.pageX - prop.x}px, ${e.pageY - prop.y}px) ` +
      'scale(.5, .5) rotate(-1deg)')
  },
  enter () {
    element.target = $(this)
    element.group = element.target.parent().append(element.guide)

    prop.ableWidth = 12 - element.group.find('.tou').attrSum('data-width')
    prop.offset = element.target.offset()
    prop.position = {
      top:  element.target.offsetParent().top,
      left: element.target.position().left
    }
    prop.size = {
      width: element.target.innerWidth(),
      height: element.target.innerHeight()
    }
  },
  move (e) {
    // top
    if (prop.offset.top + 10 > e.pageY) {
      prop.side = 'top'
      element.guide
        .removeClass('tou-migrate-guide-v')
        .addClass('tou-migrate-guide-h')
        .css({
          top:  -3,
          left: 0
        })
    }
    // bottom
    else if (prop.offset.top + prop.size.height - 10 < e.pageY) {
      prop.side = 'bottom'
      element.guide
        .removeClass('tou-migrate-guide-v')
        .addClass('tou-migrate-guide-h')
        .css({
          top:  prop.size.height - 3,
          left: 0
        })
    }
    // left
    else if (prop.offset.left + 30 > e.pageX &&
      (prop.ableWidth > 0 || element.tou.parent().is(element.group))) {
      prop.side = 'left'
      element.guide
        .removeClass('tou-migrate-guide-h')
        .addClass('tou-migrate-guide-v')
        .css({
          top:  0,
          left: prop.position.left
        })
    }
    // right
    else if (prop.offset.left + prop.size.width - 30 < e.pageX &&
      (prop.ableWidth > 0 || element.tou.parent().is(element.group))) {
      prop.side = 'right'
      element.guide
        .removeClass('tou-migrate-guide-h')
        .addClass('tou-migrate-guide-v')
        .css({
          top:  0,
          left: prop.position.left + prop.size.width + 8
        })
    }
    else {
      prop.side = null
      element.guide
        .removeClass('tou-migrate-guide-v tou-migrate-guide-h')
    }
  },
  end: function () {
    if (prop.side === 'left') {
      element.target.before(element.tou)
    }
    else if (prop.side === 'right') {
      element.target.after(element.tou)
    }
    else if (prop.side === 'top') {
      const group = $('<div class="tou-group"/>')
      group
        .append(element.tou)
        .on('mouseenter', groupInitialize)

      element.tou.attr('data-width', 12)
      element.target.parent().before(group)
    }
    else if (prop.side === 'bottom') {
      const group = $('<div class="tou-group"/>')
      group
        .append(element.tou)
        .on('mouseenter', groupInitialize)

      element.tou.attr('data-width', 12)
      element.target.parent().after(group)
    }

    element.guide
      .removeClass('tou-migrate-guide-v tou-migrate-guide-h')

    element.tou
      .removeClass('tou-moving')
      .css({
        'transition': 'transform .4s',
        'transform':  'none'
      })

    setTimeout(() => element.tou.removeAttr('style'), 400)

    element.list.removeClass('tou-migrate')
      .find('.tou')
      .off('mouseenter', event.enter)
      .off('mousemove', event.move)

    element.body
      .off('mousemove', event.drag)
      .off('mouseup', event.end)
  }
}

export default () => {
  element.handle.on('mousedown', event.start)
  $('.tou').not('.tou-gap').on('mouseenter', initialize)
}

export function initialize () {
  $(this).append(element.handle)
}
