import $ from 'jquery'

export const resizeProps = {}

const resize = {
  toLeft: function (e) {
    resizeProps.target = $(this)
    resizeProps.tou = resizeProps.target.closest('.tou')
    resizeProps.list = resizeProps.target.closest('.tou-list')
    resizeProps.container = resizeProps.target.closest('.tou-group')
    resizeProps.width = parseInt(resizeProps.tou.attr('data-width')) || 12
    resizeProps.startX = e.pageX
    resizeProps.grid = resizeProps.container.width() / 12
    resizeProps.gap = resizeProps.tou.prev('.tou-gap')
    resizeProps.gapWidth = parseInt(resizeProps.gap.attr('data-width')) || 0

    resizeProps.list.addClass('tou-resizing')
    resizeProps.container.on('mousemove', resize.dragLeft)

    $(document.body).on('mouseup', resize.end).disableSelection()
  },
  dragLeft: function (e) {
    const moveWidth = Math.round((e.pageX - resizeProps.startX) / resizeProps.grid)
    resizeProps.tou.attr('data-width', resizeProps.width - moveWidth)
    resizeProps.gap.attr('data-width', resizeProps.gapWidth + moveWidth)
  },
  toRight: function (e) {
    resizeProps.target = $(this)
    resizeProps.tou = resizeProps.target.closest('.tou')
    resizeProps.list = resizeProps.target.closest('.tou-list')
    resizeProps.container = resizeProps.target.closest('.tou-group')
    resizeProps.width = parseInt(resizeProps.tou.attr('data-width')) || 12
    resizeProps.startX = e.pageX
    resizeProps.grid = resizeProps.container.width() / 12
    resizeProps.gap = resizeProps.tou.next('.tou-gap')
    resizeProps.gapWidth = parseInt(resizeProps.gap.attr('data-width')) || 0

    resizeProps.list.addClass('tou-resizing')
    resizeProps.container.on('mousemove', resize.dragRight)

    $(document.body).on('mouseup', resize.end).disableSelection()
  },
  dragRight: function (e) {
    const moveWidth = Math.round((e.pageX - resizeProps.startX) / resizeProps.grid)
    resizeProps.tou.attr('data-width', resizeProps.width + moveWidth)
    resizeProps.gap.attr('data-width', resizeProps.gapWidth - moveWidth)
  },
  end: function () {
    resizeProps.list.removeClass('tou-resizing')
    resizeProps.container.off('mousemove')

    $(document.body).off('mouseup', resize.end).enableSelection()
  }
}

export default resize
