import $ from 'jquery'
import 'jquery-ui/ui/widgets/draggable'
import 'jquery-ui/ui/widgets/sortable'
import 'jquery-ui/ui/disable-selection'
import './tou.scss'

(function () {
  const handle = {
    move: $('<div class="tou-item-move-handle"/>'),
    size: {
      left: $('<div class="tou-size-handle tou-size-handle-left"/>'),
      right: $('<div class="tou-size-handle tou-size-handle-right"/>')
    }
  }

  handle.size.left.on('mousedown', function (e) {
    const $this = $(this)

    $this.container = $this.closest('.tou-item')
    $this.size = $this.parent().width()
    $this.startX = e.pageX
    $this.grid = $this.container.width() / 12

    $('body').disableSelection()

    $this.container
      .on('mousemove', function (e) {
        const length = Math.round((e.pageX - $this.startX) / $this.grid)
        const width = $this.size - $this.grid * length

        $this.parent().css({
          left: $this.grid * length,
          width: width < $this.grid ? $this.grid : width
        })
      })
      .on('mouseup', function () {
        $this.container.off()
        $('body').enableSelection()
      })
  })

  handle.size.right.on('mousedown', function (e) {
    const $this = $(this)

    $this.container = $this.closest('.tou-item')
    $this.size = $this.parent().width()
    $this.startX = e.pageX
    $this.grid = $this.container.width() / 12

    $('body').disableSelection()

    $this.container
      .on('mousemove', function (e) {
        const length = $this.size + $this.grid * Math.round((e.pageX - $this.startX) / $this.grid)
        $this.parent().width(length < $this.grid ? $this.grid : length)
      })
      .on('mouseup', function () {
        $this.container.off()
        $('body').enableSelection()
      })
  })

  $('.tou')
    .prop('contenteditable', 'true')
    .on('click', function () {
      $('.tou-selected').removeClass('tou-selected')

      $(this)
        .addClass('tou-selected')
        .append(handle.size.left)
        .append(handle.size.right)
    })

  $('.tou-item')
    .append(handle.move.clone())

  $('.tou-list')
    .sortable({
      revert: true,
      axis: 'y',
      handle: '.tou-item-move-handle'
    })
})()
