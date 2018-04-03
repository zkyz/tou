import $ from 'jquery'
import 'jquery-ui/ui/widgets/draggable'
import 'jquery-ui/ui/widgets/sortable'
import 'jquery-ui/ui/disable-selection'
import './tou.scss'

(function () {
  const selected = $(`
    <div class="tou-selected">
      <div class="tou-size-handle tou-size-handle-left"/>
      <div class="tou-size-handle tou-size-handle-right"/>
    </div>
  `)

  const leftSizeHandle = $('.tou-size-handle-left', selected)
  leftSizeHandle.on('mousedown', function (e) {
    const $this = $(this)

    $this.container = $this.closest('.tou-group')
    $this.size = $this.parent().width()
    $this.startX = e.pageX
    $this.grid = $this.container.width() / 12

    $('body').disableSelection()

    $this.container
      .on('mousemove', function (e) {
        const length = Math.round((e.pageX - $this.startX) / $this.grid)

        $this.parent().css({
          left: 'calc(8.3333333333% * ' + length + ')'
        })
      })
      .on('mouseup', function () {
        $this.container.off()
        $('body').enableSelection()
      })
  })

  const rightSizeHandle = $('.tou-size-handle-right', selected)
  rightSizeHandle.on('mousedown', function (e) {
    const $this = $(this)

    $this.list = $this.closest('.tou-list')
    $this.container = $this.closest('.tou-group')
    $this.tou = $this.closest('.tou')
    $this.width = parseInt($this.tou.attr('data-width')) || 12
    $this.size = $this.parent().width()
    $this.startX = e.pageX
    $this.grid = $this.container.width() / 12

    $('body').disableSelection()
    $this.list.addClass('tou-movement')

    $this.container
      .on('mousemove', function (e) {
        const length = $this.width + Math.round((e.pageX - $this.startX) / $this.grid)
        $this.tou.attr('data-width', length)
      })
      .on('mouseup', function () {
        $this.container.off('mousemove mouseup')
        $this.list.removeClass('tou-movement')
        $('body').enableSelection()
      })
  })

  $('.tou')
    .on('click', function () {
      $(this).append(selected)
    })
    .find('.tou-text')
    .attr('contenteditable', true)

  const itemMoveHandler = $('<div class="tou-group-move-handle"/>')
  $('.tou-group')
    .on('mouseenter', function () {
      $(this).append(itemMoveHandler)
    })

  $('.tou-list')
    .sortable({
      revert: true,
      axis: 'y',
      handle: '.tou-group-move-handle'
    })
})()
