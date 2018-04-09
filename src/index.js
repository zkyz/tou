/* eslint-disable no-tabs */
import $ from 'jquery'
import 'jquery-ui/ui/widgets/droppable'
import 'jquery-ui/ui/widgets/sortable'
import 'jquery-ui/ui/disable-selection'
import './tou.scss'
import movement from './event/movement'

(function () {
  const sizeHandle = {
    left: $('<div class="tou-size-handle tou-size-handle-left"/>'),
    right: $('<div class="tou-size-handle tou-size-handle-right"/>'),
    target: null,
    event: {
      dragLeft: function (e) {
        const moveWidth = Math.round((e.pageX - sizeHandle.startX) / sizeHandle.grid)
        sizeHandle.tou.attr('data-width', sizeHandle.width - moveWidth)
        console.log(sizeHandle.gap)
        sizeHandle.gap.attr('data-width', sizeHandle.gapWidth + moveWidth)
      },
      dragRight: function (e) {
        const moveWidth = Math.round((e.pageX - sizeHandle.startX) / sizeHandle.grid)
        sizeHandle.tou.attr('data-width', sizeHandle.width + moveWidth)
        sizeHandle.gap.attr('data-width', sizeHandle.gapWidth - moveWidth)
      },
      end: function () {
        sizeHandle.list.removeClass('tou-resizing')
        sizeHandle.container.off('mousemove', sizeHandle.event.drag)
        $('body').off('mouseup', sizeHandle.event.end).enableSelection()
      }
    }
  }

  sizeHandle.left.on('mousedown', function (e) {
    sizeHandle.target = $(this)
    sizeHandle.list = sizeHandle.target.closest('.tou-list')
    sizeHandle.container = sizeHandle.target.closest('.tou-group')
    sizeHandle.width = parseInt(sizeHandle.tou.attr('data-width')) || 12
    sizeHandle.startX = e.pageX
    sizeHandle.grid = sizeHandle.container.width() / 12
    sizeHandle.gap = sizeHandle.tou.prev('.tou-gap')
    sizeHandle.gapWidth = parseInt(sizeHandle.gap.attr('data-width')) || 0

    sizeHandle.list.addClass('tou-resizing')
    sizeHandle.container.on('mousemove', sizeHandle.event.dragLeft)
    $('body').on('mouseup', sizeHandle.event.end).disableSelection()
  })

  sizeHandle.right.on('mousedown', function (e) {
    sizeHandle.target = $(this)
    sizeHandle.list = sizeHandle.target.closest('.tou-list')
    sizeHandle.container = sizeHandle.target.closest('.tou-group')
    sizeHandle.width = parseInt(sizeHandle.tou.attr('data-width')) || 12
    sizeHandle.startX = e.pageX
    sizeHandle.grid = sizeHandle.container.width() / 12
    sizeHandle.gap = sizeHandle.tou.next('.tou-gap')
    sizeHandle.gapWidth = parseInt(sizeHandle.gap.attr('data-width')) || 0

    sizeHandle.list.addClass('tou-resizing')
    sizeHandle.container.on('mousemove', sizeHandle.event.dragRight)
    $('body').on('mouseup', sizeHandle.event.end).disableSelection()
  })

  const touMoveHandle = $('<div class="tou-move-handle"/>')

  touMoveHandle.on('mousedown', movement.start)

  $('.tou')
    .on('mouseenter', function () {
      if (!touMoveHandle.moving) {
        $(this).append(touMoveHandle)
      }
    })
    .on('click', function () {
      sizeHandle.tou && sizeHandle.tou.removeClass('tou-selected')
      sizeHandle.tou = $(this).addClass('tou-selected').append(sizeHandle.left, sizeHandle.right)
    })
    .before('<div class="tou tou-gap"/>')

  $('.tou-text')
    .attr('contenteditable', true)

  const groupMoveHandler = $('<div class="tou-move-handle tou-group-move-handle"/>')
  $('.tou-group')
    .on('mouseenter', function () {
      $(this).append(groupMoveHandler)
    })
    .append('<div class="tou tou-gap"/>')

  $('.tou-list')
    .sortable({
      revert: true,
      axis: 'y',
      handle: '.tou-group-move-handle'
    })
})()
