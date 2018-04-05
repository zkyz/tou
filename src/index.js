/* eslint-disable no-tabs */
import $ from 'jquery'
import 'jquery-ui/ui/widgets/droppable'
import 'jquery-ui/ui/widgets/sortable'
import 'jquery-ui/ui/disable-selection'
import './tou.scss'

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

  const touMoveHandler = $('<div class="tou-move-handle"/>')
  touMoveHandler.event = {
    start: function (e) {
      e.preventDefault()
      e.stopPropagation()

      touMoveHandler.moving = true
      touMoveHandler.target = $(this).closest('.tou').addClass('tou-moving')
      touMoveHandler.start = [e.pageX, e.pageY]

      $('.tou-gap')
        .on('mouseenter', touMoveHandler.event.placeholder.enter)
        .on('mouseleave', touMoveHandler.event.placeholder.leave)

      $('body')
        .on('mousemove', touMoveHandler.event.move)
        .on('mouseup', touMoveHandler.event.end)

      $('.tou-list').addClass('tou-movement')
    },
    move: function (e) {
      const distance = [
        e.pageX - touMoveHandler.start[0],
        e.pageY - touMoveHandler.start[1]
      ]
      touMoveHandler.target.css('transform', `translate(${distance[0]}px, ${distance[1]}px) scale(.5, .5) rotate(-5deg)`)
    },
    placeholder: {
      enter: function () {
        touMoveHandler.destination = $(this).addClass('tou-ready-drop')
      },
      leave: function () {
        $(this).removeClass('tou-ready-drop')
        touMoveHandler.destination = null
      }
    },
    end: function () {
      touMoveHandler.moving = false

      if (touMoveHandler.destination) {
        const dataWidth = touMoveHandler.destination.attr('data-width')

        touMoveHandler.destination
          .removeAttr('data-width')
          .removeClass('tou-ready-drop')
          .before(touMoveHandler.target)

        touMoveHandler.target
          .removeClass('tou-moving')
          .css({
            'transition': 'none',
            'transform': 'none'
          })
          .attr('data-width', dataWidth)
          .before('<div class="tou tou-gap"/>')
      } else {
        touMoveHandler.target
          .removeClass('tou-moving')
          .css({
            'transition': 'transform .4s',
            'transform': 'none'
          })

        setTimeout(() => touMoveHandler.target.css('transition', 'none'), 500)
      }

      $('.tou-gap')
        .off('mouseenter', touMoveHandler.event.placeholder.enter)
        .off('mouseleave', touMoveHandler.event.placeholder.leave)

      $('body')
        .off('mousemove', touMoveHandler.event.move)
        .off('mouseup', touMoveHandler.event.end)

      $('.tou-list').removeClass('tou-movement')
    }
  }

  touMoveHandler.on('mousedown', touMoveHandler.event.start)

  $('.tou')
    .on('mouseenter', function () {
      if (!touMoveHandler.moving) {
        $(this).append(touMoveHandler)
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
