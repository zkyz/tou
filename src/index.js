/* eslint-disable no-tabs */
import $ from 'jquery'
import 'jquery-ui/ui/widgets/draggable'
import 'jquery-ui/ui/widgets/sortable'
import 'jquery-ui/ui/disable-selection'
import './tou.scss'

(function () {
  const selected = $(`
    <div class="tou-selected">
      <div class="tou-size-handle tou-size-handle-left"/>
      <div class="tou-size-handle tou-size-handle-right"/>
    </div>
  `)

  const sizeHandle = {
    left: $('.tou-size-handle-left', selected),
    right: $('.tou-size-handle-right', selected),
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
        sizeHandle.list.removeClass('tou-movement')
        sizeHandle.container.off('mousemove', sizeHandle.event.drag)
        $('body').off('mouseup', sizeHandle.event.end).enableSelection()
      }
    }
  }

  sizeHandle.left.on('mousedown', function (e) {
    sizeHandle.target = $(this)
    sizeHandle.list = sizeHandle.target.closest('.tou-list')
    sizeHandle.container = sizeHandle.target.closest('.tou-group')
    sizeHandle.tou = sizeHandle.target.closest('.tou')
    sizeHandle.width = parseInt(sizeHandle.tou.attr('data-width')) || 12
    sizeHandle.startX = e.pageX
    sizeHandle.grid = sizeHandle.container.width() / 12
    sizeHandle.gap = sizeHandle.tou.prev('.tou-gap')
    sizeHandle.gapWidth = parseInt(sizeHandle.gap.attr('data-width')) || 0

    sizeHandle.list.addClass('tou-movement')
    sizeHandle.container.on('mousemove', sizeHandle.event.dragLeft)
    $('body').on('mouseup', sizeHandle.event.end).disableSelection()
  })

  sizeHandle.right.on('mousedown', function (e) {
    sizeHandle.target = $(this)
    sizeHandle.list = sizeHandle.target.closest('.tou-list')
    sizeHandle.container = sizeHandle.target.closest('.tou-group')
    sizeHandle.tou = sizeHandle.target.closest('.tou')
    sizeHandle.width = parseInt(sizeHandle.tou.attr('data-width')) || 12
    sizeHandle.startX = e.pageX
    sizeHandle.grid = sizeHandle.container.width() / 12
    sizeHandle.gap = sizeHandle.tou.next('.tou-gap')
    sizeHandle.gapWidth = parseInt(sizeHandle.gap.attr('data-width')) || 0

    sizeHandle.list.addClass('tou-movement')
    sizeHandle.container.on('mousemove', sizeHandle.event.dragRight)
    $('body').on('mouseup', sizeHandle.event.end).disableSelection()
  })

  $('.tou')
    .on('click', function () {
      $(this).append(selected)
    })
    .before('<div class="tou tou-gap"/>')
    .after('<div class="tou tou-gap"/>')
    .find('.tou-text')
    .attr('contenteditable', true)

  const itemMoveHandler = $('<div class="tou-group-move-handle"/>')
  $('.tou-group')
    .on('mouseenter', function () {
      $(this).append(itemMoveHandler)
    })

  $('.tou-list')
    .sortable({
      revert: true,
      axis: 'y',
      handle: '.tou-group-move-handle'
    })
})()
