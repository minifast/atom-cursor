import update from 'immutability-helper'
import Cursor from './cursor'

const _private = new WeakMap()

export default class Atom {
  constructor (data, log = [], subscriptions = []) {
    _private.set(this, {data, log, subscriptions})
  }

  log () {
    const {log} = _private.get(this)
    return log
  }

  compact () {
    const {data, log, subscriptions} = _private.get(this)
    const newData = log.reduce(update, data)
    _private.set(this, {subscriptions, data: newData, log: []})
    subscriptions.forEach(subscription => subscription.notify(newData, data))
  }

  update (command) {
    const {data, log, subscriptions} = _private.get(this)
    _private.set(this, {data, subscriptions, log: log.concat([command])})
    return Promise.resolve().then(this.compact.bind(this)).catch((message) => {
      console.warn(message)
      return Promise.reject(message)
    })
  }

  get () {
    const {data, log} = _private.get(this)
    return log.reduce((currentData, command) => {
      try {
        return update(currentData, command)
      } catch (exception) {
        console.warn(exception)
        return currentData
      }
    }, data)
  }

  toCursor () {
    const cursor = new Cursor(this)
    return cursor
  }

  attach (subscription) {
    const {data, log, subscriptions} = _private.get(this)
    _private.set(this, {data, log, subscriptions: subscriptions.concat([subscription])})
  }

  detach (subscription) {
    const {data, log, subscriptions} = _private.get(this)
    const newSubscriptions = subscriptions.filter(s => s !== subscription)
    _private.set(this, {data, log, subscriptions: newSubscriptions})
  }
}
