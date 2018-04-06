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

  const touMoveHandle = $('<div class="tou-move-handle"/>')
  touMoveHandle.event = {
    start: function (e) {
      e.preventDefault()
      e.stopPropagation()

      touMoveHandle.moving = true
      touMoveHandle.target = $(this).closest('.tou').addClass('tou-moving')
      touMoveHandle.start = [e.pageX, e.pageY]

      $('.tou-gap')
        .on('mouseenter', touMoveHandle.event.placeholder.enter)
        .on('mouseleave', touMoveHandle.event.placeholder.leave)

      $('body')
        .on('mousemove', touMoveHandle.event.move)
        .on('mouseup', touMoveHandle.event.end)

      $('.tou-list').addClass('tou-movement')
    },
    move: function (e) {
      const distance = [
        e.pageX - touMoveHandle.start[0],
        e.pageY - touMoveHandle.start[1]
      ]
      touMoveHandle.target.css('transform', `translate(${distance[0]}px, ${distance[1]}px) scale(.5, .5) rotate(-5deg)`)
    },
    placeholder: {
      enter: function () {
        const $this = $(this)
        if (parseInt($this.attr('data-width'))) {
          touMoveHandle.destination = $(this).addClass('tou-ready-drop')
        }
      },
      leave: function () {
        $(this).removeClass('tou-ready-drop')
        touMoveHandle.destination = null
      }
    },
    end: function () {
      touMoveHandle.moving = false

      if (touMoveHandle.destination) {
        const dataWidth = touMoveHandle.destination.attr('data-width')
        const touGroup = touMoveHandle.target.closest('.tou-group')
        const touGapPrev = touMoveHandle.target.prev('.tou-gap')
        const touGapNext = touMoveHandle.target.next('.tou-gap')

        touMoveHandle.destination
          .removeAttr('data-width')
          .removeClass('tou-ready-drop')
          .before(touMoveHandle.target)

        touMoveHandle.target
          .removeClass('tou-moving')
          .css({
            'transition': 'none',
            'transform': 'none'
          })
          .attr('data-width', dataWidth)
          .before('<div class="tou tou-gap" id="x"/>')

        if (!touGroup.find('.tou:not(.tou-gap)').length) {
          touGroup.remove()
        } else {
          touGapPrev.remove()
          touGapNext.attr('data-width',
            parseInt(touMoveHandle.target.next('.tou-gap').attr('data-width') || 0) + parseInt(touMoveHandle.target.attr('data-width')))
        }
      } else {
        touMoveHandle.target
          .removeClass('tou-moving')
          .css({
            'transition': 'transform .4s',
            'transform': 'none'
          })

        setTimeout(() => touMoveHandle.target.css('transition', 'none'), 500)
      }

      $('.tou-gap')
        .off('mouseenter', touMoveHandle.event.placeholder.enter)
        .off('mouseleave', touMoveHandle.event.placeholder.leave)

      $('body')
        .off('mousemove', touMoveHandle.event.move)
        .off('mouseup', touMoveHandle.event.end)

      $('.tou-list').removeClass('tou-movement')
    }
  }

  touMoveHandle.on('mousedown', touMoveHandle.event.start)

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
