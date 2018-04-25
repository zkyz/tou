const records = []
let index = -1

export function save (type, element, before, after, props) {
  if (typeof (before) !== 'function' &&
    before && after &&
    before === after) {
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
    element.innerHTML = value[redo ? 'after' : 'before']
    caret.set(element, record.caret[redo ? 'after' : 'before'])
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
  case TYPES.GROUP.COPY:
    if (redo) value.before['after'](element)
    else recyclebin(element)
    break
  case TYPES.GROUP.DELETE:
    if (redo) recyclebin(element)
    else {
      if (value.before.length) value.before['after'](element)
      else value.after['before'](element)
    }
    break
  case TYPES.GROUP.MIGRATE:
    const fn = value[redo ? 'after' : 'before']
    const name = fn[0]

    fn[1][name](element)
    break
  }
}

export const TYPES = {
  TEXT:   'TEXT',
  RESIZE: {
    X: 'RESIZE-X',
    Y: 'RESIZE-Y'
  },
  GROUP:  {
    COPY:    'GROUP-COPY',
    DELETE:  'GROUP-DELETE',
    MIGRATE: 'GROUP-MIGRATE'
  }
}
export const recyclebin = (function () {
  const trash = document.createElement('recyclebin')

  return function (element) {
    trash.appendChild(element.jquery ? element[0] : element)
  }
})()

export const typing = {
  before: {}
}
export const caret = {
  selection: window.getSelection(),
  range:     document.createRange(),
  set (element, info) {
    const caretElement = info.caretId === element.id ? element : element.querySelector(`#${info.caretId}`)

    this.range.setStart(caretElement.childNodes[info.childNo], info.offset)
    this.selection.removeAllRanges()
    this.selection.addRange(this.range)
  },
  get () {
    return {
      offset:  this.selection.focusOffset,
      caretId: this.setFocusId(this.selection.focusNode),
      childNo: this.getChildNo(this.selection.focusNode)
    }
  },
  setFocusId (element) {
    if (element.parentNode.id) {
      return element.parentNode.id
    }
    else {
      const id = new Date().getTime().toString(36)

      element.parentNode.id = id
      return id
    }
  },
  getChildNo (element) {
    let no = 0
    element.parentNode.childNodes.forEach((el, i) => {
      if (el === element) {
        no = i
      }
    })

    return no
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
