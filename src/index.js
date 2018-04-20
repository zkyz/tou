import $ from 'jquery'

import resize from './resize'
import migrate from './migrate'
import groupMigrate from './group-migrate'

import './tou.scss'

window.$ = $

resize()
migrate()
groupMigrate()
