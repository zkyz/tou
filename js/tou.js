function elementOffset(el) {
	let x = 0
	let y = 0
	while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
		x += el.offsetLeft - el.scrollLeft
		y += el.offsetTop - el.scrollTop
		el = el.offsetParent
	}
	return {top: y, left: x}
}

(function () {
	'use strict'

	const tou = document.querySelector('.tou')
	const event = {
		move(e) {
			target.style.top = (e.clientY - target.position.init) + 'px'

			console.log(e)
		}
	}

	let target = null
	let droper = null

	document.querySelectorAll('.tou-item').forEach(item => {
		item.addEventListener('dragstart', e => {
			target = e.target
			target.classList.add('tou-item-pseudo')
		})
		item.addEventListener('dragend', e => {
			if (droper == null) {
				return
			}
			else if (target.direction === 'top') {
				droper.parentNode.insertBefore(target, droper)
			}
			else if (droper.nextSibling) {
				droper.parentNode.insertBefore(target, droper.nextSibling)
			}
			else {
				droper.parentNode.appendChild(target)
			}

			target.classList.remove('tou-item-pseudo')
			target = null

			droper.classList.remove('tou-item-drop-top', 'tou-item-drop-bottom')
			droper = null
		})
		item.addEventListener('dragover', e => {
			droper && droper.classList.remove('tou-item-drop-top', 'tou-item-drop-bottom')

			let _item = e.target
			while (_item && !_item.classList.contains('tou-item')) {
				_item = _item.parentNode
			}

			if (_item && _item !== target) {
				droper = _item

				const offset = elementOffset(droper)
				const middle = offset.top + droper.offsetHeight / 2

				if (middle > e.clientY) {
					target.direction = 'top'
					droper.classList.add('tou-item-drop-top')
				}
				else {
					target.direction = 'bottom'
					droper.classList.add('tou-item-drop-bottom')
				}
			}
		})
	})
})()