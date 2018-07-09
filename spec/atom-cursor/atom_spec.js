import Atom from '../../src/atom-cursor/atom'
import Cursor from '../../src/atom-cursor/cursor'

describe('Atom', () => {
  let atom, content

  beforeEach(() => {
    content = {nested: {eggs: 'delicious'}}
    atom = new Atom(content)
  })

  describe('#get', () => {
    it('returns the content of the atom', () => {
      expect(atom.get()).toBe(content)
    })
  })

  describe('#toCursor', () => {
    it('returns a cursor', () => {
      expect(atom.toCursor()).toEqual(jasmine.any(Cursor))
    })
  })
})
