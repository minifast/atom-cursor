import Cursor from './cursor'

const _private = new WeakMap()

export default class Atom {
  constructor (data) {
    _private.set(this, {data})
  }

  get () {
    const {data} = _private.get(this)
    return data
  }

  toCursor () {
    const cursor = new Cursor(this)
    return cursor
  }
}
