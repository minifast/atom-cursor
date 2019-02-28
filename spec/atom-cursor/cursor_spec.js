import Atom from '../../src/atom-cursor/atom'
import Cursor from '../../src/atom-cursor/cursor'

describe('Cursor', () => {
  let atom, cursor, content

  beforeEach(() => {
    content = {nested: {eggs: 'delicious'}}
    atom = new Atom(content)
    cursor = new Cursor(atom)
    spyOn(console, 'warn').and.stub()
  })

  describe('#get', () => {
    describe('when the path is not set', () => {
      it('returns the content of the atom', () => {
        expect(cursor.get()).toBe(content)
      })
    })

    describe('when supplied with an existing path', () => {
      it('returns the value', () => {
        expect(cursor.get('nested', 'eggs')).toEqual('delicious')
      })
    })

    describe('when supplied with a nonexistent path', () => {
      it('returns null', () => {
        expect(cursor.get('nested', 'data', 'structures')).toBeNull()
      })
    })
  })

  describe('#select', () => {
    describe('when not supplied with a path', () => {
      it('returns a cursor at the same path', () => {
        expect(cursor.select().get()).toEqual(content)
      })
    })

    describe('when supplied with an existing path', () => {
      it('returns a cursor at that path', () => {
        expect(cursor.select('nested', 'eggs').get()).toEqual('delicious')
      })
    })

    describe('when selected twice', () => {
      it('returns a cursor at that path', () => {
        expect(cursor.select('nested').select('eggs').get()).toEqual('delicious')
      })
    })

    describe('when supplied with a nonexistent path', () => {
      it('returns a cursor at that path', () => {
        expect(cursor.select('nested', 'data', 'structures').get()).toBeNull()
      })
    })
  })

  describe('#update', () => {
    describe('when not supplied with a path', () => {
      it('enqueues the command in the atom', () => {
        expect(atom.log()).toEqual([])
        const command = {$set: true}
        cursor.update(command)
        expect(atom.log()).toEqual([command])
      })

      it('evaluates the atom to derive the new value', () => {
        cursor.update({$set: true})
        expect(cursor.get()).toBe(true)
      })
    })

    describe('when supplied with a valid path', () => {
      it('enqueues the command in the atom at the path', () => {
        expect(atom.log()).toEqual([])
        const command = {$set: true}
        cursor.select('nested').update(command)
        expect(atom.log()).toEqual([{nested: {$set: true}}])
      })
    })

    describe('when supplied with an invalid path', () => {
      it('enqueues the command in the atom at the path', (done) => {
        expect(atom.log()).toEqual([])
        cursor.select('nonsense', 'path').update({$set: true}).catch(() => {
          expect(atom.log()).toEqual([{nonsense: {path: {$set: true}}}])
          done()
        })
      })

      it('does not change the derived data in the atom', (done) => {
        cursor.select('nonsense', 'path').update({$set: true}).catch(() => {
          expect(cursor.get()).toBe(content)
          done()
        })
      })

      it('prints a warning', (done) => {
        cursor.select('nonsense', 'path').update({$set: true}).catch(() => {
          expect(console.warn).toHaveBeenCalled()
          done()
        })
      })
    })
  })

  describe('#subscribe', () => {
    let subscriber

    beforeEach(() => {
      subscriber = jasmine.createSpy('subscriber')
    })

    describe('when the data in the context of the cursor is not changed', () => {
      beforeEach(() => {
        cursor.select('nested').subscribe(subscriber)
      })

      it('does not notify the subscriber', (done) => {
        cursor.update(({ham: {$set: 'gross'}})).then(() => {
          expect(subscriber).not.toHaveBeenCalled()
          done()
        })
      })
    })

    describe('when the data in the context of the cursor changes', () => {
      beforeEach(() => {
        cursor.select('nested').subscribe(subscriber)
      })

      it('notifies the subscriber', (done) => {
        cursor.update(({nested: {eggs: {$set: 'just okay'}}})).then(() => {
          expect(subscriber).toHaveBeenCalled()
          done()
        })
      })
    })
  })

  describe('#unsubscribe', () => {
    let subscriber, subscription

    beforeEach(() => {
      subscriber = jasmine.createSpy('subscriber')
      subscription = cursor.subscribe(subscriber)
    })

    describe('when the subscription has been unsubscribed', () => {
      beforeEach(() => {
        cursor.unsubscribe(subscription)
      })

      it('does not notify the subscriber', () => {
        cursor.update(({ham: {$set: 'gross'}}))
        expect(subscriber).not.toHaveBeenCalled()
      })
    })
  })

  describe('#set', () => {
    it('sets the value at the cursor', (done) => {
      cursor.set(true).then(() => {
        expect(cursor.get()).toEqual(true)
        done()
      })
    })
  })
})
