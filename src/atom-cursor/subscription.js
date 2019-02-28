import isEqual from 'fast-deep-equal'
import dig from './dig'

const _private = new WeakMap()

export default class Subscription {
  constructor (path, notify) {
    _private.set(this, {path, notify})
  }

  notify (newData, oldData) {
    const {path, notify} = _private.get(this)
    const newValue = dig(newData, path)
    const oldValue = dig(oldData, path)
    if (!isEqual(newValue, oldValue)) {
      notify(newValue, oldValue)
    }
  }
}
