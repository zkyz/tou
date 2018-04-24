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

  const getSelectorPath = function (element) {
    const path = []

    if (undo.typing.element) {
      let current = element
      while ((current = current.parentNode) !== undo.typing.element) {
        path.push(current.nodeName)

        console.log(path)

        if (!current) {
          return ''
        }
      }
    }

    return path.reverse().join('>')
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
      value: undo.typing.element.innerHTML,
      caret: {
        offset:  selection.focusOffset,
        path:    getSelectorPath(selection.focusNode),
        childNo: getChildNo(selection.focusNode)
      }
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
