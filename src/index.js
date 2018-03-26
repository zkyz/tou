import $ from 'jquery'
import 'jquery-ui/ui/widgets/sortable'
import './tou.scss'

(function () {
  $('.tou-list')
    .each((i, list) => {
      $(list).find('.tou').append('<div class="tou-move-handle"/>')
      $(list).sortable({
        revert: true,
        handle: '.tou-move-handle'
      })
    })
})()
