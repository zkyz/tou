import $ from 'jquery'

import resize from './resize'
import migrate from './migrate'
import groupMigrate from './group-migrate'

import './undo'

import './tou.scss'

window.$ = $

resize()
migrate()
groupMigrate()

;
(function () {
  $('.tou>.tou-text')
    .on('blur', function () {
      $(this).removeAttr('contenteditable')
    })
    .on('dblclick', function () {
      $(this)
        .attr('contenteditable', true)
        .focus()

      document.execCommand('selectAll')
    })
})()
