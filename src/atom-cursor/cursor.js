import dig from './lib/dig'
import Subscription from './Subscription'

const _private = new WeakMap()

export default class Cursor {
  constructor (atom, path = []) {
    _private.set(this, {atom, path})
  }

  get (...localPath) {
    const {path, atom} = _private.get(this)
    const fullPath = path.concat(localPath)
    const value = dig(atom.get(), fullPath)
    return value
  }

  select (...path) {
    const {atom} = _private.get(this)
    const cursor = new Cursor(atom, path)
    return cursor
  }

  update (command) {
    const {path, atom} = _private.get(this)
    const nestedCommand = path.reduceRight((nestedCommand, key) => ({[key]: nestedCommand}), command)
    return atom.update(nestedCommand)
  }

  subscribe (subscriber) {
    const {atom, path} = _private.get(this)
    const subscription = new Subscription(path, subscriber)
    atom.attach(subscription)
    return subscription
  }

  unsubscribe (subscription) {
    const {atom} = _private.get(this)
    atom.detach(subscription)
  }

  set (value) {
    return this.update({$set: value})
  }
}
