const _utils = {
	position: (el) => {
		let x = 0
		let y = 0
		while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
			x += el.offsetLeft - el.scrollLeft
			y += el.offsetTop - el.scrollTop
			el = el.offsetParent
		}
		return {top: y, left: x}
	},
	prev: (el) => {
		let elem = el.previousSibling
		while (elem && elem.nodeType !== 1) {
			elem = elem.previousSibling
		}

		return elem
	},
	next: (el) => {
		let elem = el.nextSibling
		while (elem && elem.nodeType !== 1) {
			elem = elem.nextSibling
		}

		return elem
	}
}
;

(function () {
	'use strict'

	let target = null

	const tou = document.querySelector('.tou')
	const dropPoint = {
		guide: document.createElement('div'),
		target: null
	}
	dropPoint.guide.classList.add('tou-item-drop-point')
	tou.appendChild(dropPoint.guide)

	tou.addEventListener('mousemove', e => {
		if (target) {
			target.style.transform = `translate(10px,${e.pageY - target.y}px)`
		}
	})

	const pseudo = document.createElement('div')
	pseudo.classList.add('tou-item-pseudo')
	tou.appendChild(pseudo)

	tou.addEventListener('mouseup', () => {
		if (target) {
			if (dropPoint.target && dropPoint.target.result) {
				dropPoint.guide.style.display = 'none'

				if (dropPoint.target.result === 'before') {
					dropPoint.target.parentNode.insertBefore(target, dropPoint.target)
				}
				else {
					dropPoint.target.parentNode.insertBefore(target, _utils.next(dropPoint.target))
				}
			}


			target.classList.remove('tou-item-moving')
			target.style.transform = 'translate(0)'
			target = null

			pseudo.style.display = 'none'
		}
	})

	const handle = document.createElement('div')
	handle.classList.add('tou-item-move-handle')


	document.querySelectorAll('.tou-item').forEach(item => {
		let _handle = handle.cloneNode(true)
		_handle.addEventListener('mousedown', e => {
			e.preventDefault()

			target = e.target.parentNode
			target.y = e.pageY - 20
			target.classList.add('tou-item-moving')

			target.parentNode.insertBefore(pseudo, target)
			pseudo.style.display = 'block'
			pseudo.style.width = target.offsetWidth + 'px'
			pseudo.style.height = target.offsetHeight + 'px'

			tou.top = _utils.position(tou).top
		})
		item.appendChild(_handle)

		item.addEventListener('mousemove', e => {
			if (target && target !== e.target
					&& e.target.classList.contains('tou-item')) {

				if (dropPoint.target !== e.target) {
					dropPoint.target = e.target
					dropPoint.target.top = _utils.position(dropPoint.target).top
					dropPoint.target.middle = dropPoint.target.top + (dropPoint.target.offsetHeight / 2)
					dropPoint.target.bottom = dropPoint.target.top + dropPoint.target.offsetHeight
					dropPoint.target.prev = _utils.prev(dropPoint.target)
					dropPoint.target.next = _utils.next(dropPoint.target)
					dropPoint.target.result = ''

					dropPoint.guide.style.display = 'none'
				}

				if (dropPoint.target.middle > e.pageY
						&& (!dropPoint.target.prev || !dropPoint.target.prev.classList.contains('tou-item-moving'))) {
					dropPoint.guide.style.display = 'block'
					dropPoint.guide.style.top = (dropPoint.target.top - tou.top) + 'px'

					dropPoint.target.result = 'before'
				}
				else if (dropPoint.target.middle < e.pageY
						&& (!dropPoint.target.next || !dropPoint.target.next.classList.contains('tou-item-pseudo'))) {
					dropPoint.guide.style.display = 'block'
					dropPoint.guide.style.top = (dropPoint.target.bottom - tou.top) + 'px'

					dropPoint.target.result = 'after'
				}
			}
		})
	})

})()