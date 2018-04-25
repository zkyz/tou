import $ from 'jquery'

import resize from './resize'
import migrate from './migrate'
import groupMigrate from './group-migrate'

import * as undo from './undo'

import './tou.scss'

window.$ = $

resize()
migrate()
groupMigrate()

;(function () {
  const save = function () {
    const {TYPES, typing} = undo

    // WARNING!
    // get caret at before "element.innerHTML"
    const afterCaret = undo.caret.get()

    undo.save(TYPES.TEXT,
      typing.element,
      typing.before.value,
      typing.element.innerHTML,
      {
        caret: {
          before: typing.before.caret,
          after: afterCaret
        }
      }
    )

    typing.before.value = null
  }

  $('.tou>.tou-text')
    .on('blur', function () {
      $(this).removeAttr('contenteditable')
    })
    .on('dblclick', function () {
      const $this = $(this)

      if (!$this.is('[contenteditable]')) {
        $this
          .attr('contenteditable', true)
          .focus()

        document.execCommand('selectAll')
      }
    })
    .on('keydown', function () {
      undo.typing.element = this

      if (!undo.typing.before.value) {
        // WARNING!
        // do not change priority caret and value
        undo.typing.before = {
          caret: undo.caret.get(),
          value: this.innerHTML
        }
      }

      clearTimeout(undo.typing.timer)
      undo.typing.timer = setTimeout(save, 500)
    })
})()
