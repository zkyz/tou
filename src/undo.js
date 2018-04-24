export const TYPES = {
  TEXT: 'TEXT',
  RESIZE: {
    X: 'RESIZE-X',
    Y: 'RESIZE-Y'
  }
}

export const typing = {
  element: null,
  timer:   null
}

const records = []
let index = -1

export function save (type, element, before, after, props) {
  if (before === after) {
    return
  }

  records.splice(index + 1)
  records.push({
    type,
    element,
    value: {
      before,
      after
    },
    ...props
  })

  index++

  console.log('execute save!', index)
}

const execute = function (record, redo) {
  if (!record) {
    return
  }

  console.log('execute', index)

  const {type, element, value} = record

  switch (type) {
  case TYPES.TEXT:
    element.innerHTML = value
    caret.set(element, record.caret)
    break
  case TYPES.RESIZE.X:
    element.setAttribute('data-width', value[redo ? 'after' : 'before'])
    break
  case TYPES.RESIZE.Y:
    const size = value[redo ? 'after' : 'before']

    element.style.height = size

    if (!size || size === 'auto') {
      element.parentNode.classList.remove('tou-fixed-height')
    }
    break
  }
}

const redo = function () {
  execute(records[index], true)

  if (++index > records.length - 1) {
    index = records.length - 1
  }
}

const undo = function () {
  execute(records[index])

  if (--index < 0) {
    index = 0
  }
}

const caret = {
  selection: window.getSelection(),
  range:     document.createRange(),
  set (element, info) {
    const caretElement = info.id === element.id ? element : element.querySelector(`#${info.id}`)

    this.range.setStart(caretElement.childNodes[info.childNo], info.offset)
    this.selection.removeAllRanges()
    this.selection.addRange(this.range)
  }
}

document.body.addEventListener('keydown', function (e) {
  if (e.ctrlKey && e.keyCode === 90) {
    e.preventDefault()
    e.stopPropagation()

    clearTimeout(typing.timer)

    if (e.shiftKey) {
      redo()
    }
    else {
      undo()
    }
  }
})
