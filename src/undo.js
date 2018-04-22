export const records = []
export let recordIndex = 0

const redo = function () {
  const record = records[recordIndex]
  recordIndex ++

  if (recordIndex >= records.length) {
    recordIndex = records.length - 1
    return
  }

  if (record.type === 'INPUT') {
    record.element.innerHTML = record.value[1]
  }
}

const undo = function () {
  const record = records[recordIndex]
  recordIndex --

  if (recordIndex < 1) {
    recordIndex = 0
    return
  }

  if (record.type === 'INPUT') {
    record.element.innerHTML = record.value[0]
  }
}

document.body.addEventListener('keydown', function (e) {
  if (e.keyCode === 90) {
    e.preventDefault()

    if (e.shiftKey) {
      redo()
    }
    else {
      undo()
    }
  }
})

let keyupTimer,
  beforeValue

document.body.addEventListener('keyup', function (e) {
  clearTimeout(keyupTimer)
  keyupTimer = setTimeout(function () {
    records.push({
      type: 'INPUT',
      element: e.target,
      value: [beforeValue, e.target.innerHTML]
    })

    beforeValue = e.target.innerHTML
  }, 1000)
})
