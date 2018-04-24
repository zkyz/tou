export const TYPES = {
  TEXT: 'TEXT'
}

export const typing = {
  element: null,
  timer:   null
}

const records = []
let index = -1

export function save (type, element, props) {
  records.splice(index + 1)

  const record = records[index]
  if (record) {
    // type "TEXT" check by length
    if (type === TYPES.TEXT &&
      record.element === element &&
      record.value.length === props.value.length
    ) {
      return
    }
    else if (record.type === type &&
      record.element === element &&
      record.value === props.value
    ) {
      return
    }
  }

  console.log('execute save!')

  records.push({
    type,
    element,
    ...props
  })

  index++
}

const redo = function () {
  const record = records[++index]

  if (record) {
    switch (record.type) {
    case TYPES.TEXT:
      record.element.innerHTML = record.value
    }
  }

  if (index > records.length - 1) {
    index = records.length - 1
  }
}

const undo = function () {
  if (index === records.length) {
    index--
  }

  const record = records[--index]

  if (record) {
    switch (record.type) {
    case TYPES.TEXT:
      record.element.innerHTML = record.value

      if (record.caret && record.caret.path) {
        const range = document.createRange()
      }
      break
    }
  }

  if (index < 0) {
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
