import Atom from '../../src/atom-cursor/atom'
import Cursor from '../../src/atom-cursor/cursor'

describe('Cursor', () => {
  let atom, cursor, content

  beforeEach(() => {
    content = {nested: {eggs: 'delicious'}}
    atom = new Atom(content)
    cursor = new Cursor(atom)
  })

  describe('#get', () => {
    it('returns the content of the atom', () => {
      expect(cursor.get()).toBe(content)
    })
  })
})
