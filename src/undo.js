export const TYPES = {
  TEXT: 'TEXT'
}

const records = []
let index = 0

export function save (type, props) {
  records.splice(index)

  const record = records[index - 1]

  if (record &&
    record.type === type &&
    record.value === props.value) {
    return
  }

  records.push({
    type,
    ...props
  })

  index++
}

const redo = function () {
  if (index === 0) {
    index++
  }

  const record = records[index++]

  if (record) {
    switch (record.type) {
    case TYPES.TEXT:
      console.log(record)
      // record.element.innerHTML = record.after
    }
  }

  if (index > records.length) {
    index = records.length
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
      console.log(record)
      // record.element.innerHTML = record.before
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

    if (e.shiftKey) {
      redo()
    }
    else {
      undo()
    }
  }
})

document.body.addEventListener('keypress', function (e) {
  save(TYPES.TEXT, {
    value: e.keyCode
  })
})
