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
  const selection = window.getSelection()

  const isIgnore = function (e) {
    return e.ctrlKey || e.metaKey || e.altKey
  }

  const setFocusId = function (element) {
    if (element.parentNode.id) {
      return element.parentNode.id
    }
    else {
      const id = new Date().getTime().toString(36)

      element.parentNode.id = id
      return id
    }
  }

  const getChildNo = function (element) {
    let no = 0
    element.parentNode.childNodes.forEach((el, i) => {
      if (el === element) {
        no = i
      }
    })

    return no
  }

  const save = function () {
    undo.save(undo.TYPES.TEXT, undo.typing.element, {
      caret: {
        offset:  selection.focusOffset,
        id:      setFocusId(selection.focusNode),
        childNo: getChildNo(selection.focusNode)
      },
      value: undo.typing.element.innerHTML
    })
  }

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
    .on('keydown', function (e) {
      if (!isIgnore(e)) {
        // when first touch then save before execute
        if (undo.typing.element !== this) {
          undo.typing.element = this
          save()
        }

        clearTimeout(undo.typing.timer)
        undo.typing.timer = setTimeout(save, 500)
      }
    })
})()
