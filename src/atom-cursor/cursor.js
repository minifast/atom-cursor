const _private = new WeakMap()

export default class Cursor {
  constructor (atom) {
    _private.set(this, {atom})
  }

  get () {
    const {atom} = _private.get(this)
    return atom.get()
  }
}
