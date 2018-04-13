import $ from 'jquery'
<<<<<<< HEAD
import 'jquery-ui/ui/widgets/droppable'
import 'jquery-ui/ui/widgets/sortable'
import 'jquery-ui/ui/disable-selection'
import './tou.scss'
import movement, {moveProps} from './event/movement'
import resize, {resizeProps} from './event/resize'

(function () {
  'use strict'

  window.tou = {
    elements: {
      groupMove: $('<div class="tou-move-handle tou-group-move-handle"/>'),
      move: $('<div class="tou-move-handle"/>').on('mousedown', movement.start),
      resize: {
        left: $('<div class="tou-size-handle tou-size-handle-left"/>').on('mousedown', resize.toLeft),
        right: $('<div class="tou-size-handle tou-size-handle-right"/>').on('mousedown', resize.toRight)
      }
    }
  }

  $('.tou')
    .before('<div class="tou tou-gap"/>')
    .on('click', function () {
      $('.tou-selected').removeClass('tou-selected')

      resizeProps.target = $(this).addClass('tou-selected')
        .append(window.tou.elements.resize.left, window.tou.elements.resize.right)
    })
    .on('mouseenter', function () {
      if (!moveProps.moving) {
        $(this).append(window.tou.elements.move)
      }
    })
    // find '.tou .tou-text' after add attribute
    .find('.tou-text')
    .attr('contenteditable', true)
=======

import './tou.scss'

import migrate from './migrate'
import resize from './resize'

resize()
migrate()

;
// .tou-group migrate
(function () {
  const prop = {
    y: 0
  }

  const handle = $('<div class="tou-migrate-handle tou-group-handle"/>')
    .on('mousedown', function (e) {
      prop.y = e.pageY
    })
>>>>>>> tou movement #3

  $('.tou-group')
    .append('<div class="tou tou-gap"/>')
    .on('mouseenter', function () {
<<<<<<< HEAD
      $(this).append(window.tou.elements.groupMove)
    })

  $('.tou-list')
    .sortable({
      revert: true,
      axis: 'y',
      handle: '.tou-group-move-handle'
=======
      $(this).append(handle)
>>>>>>> tou movement #3
    })
})()
