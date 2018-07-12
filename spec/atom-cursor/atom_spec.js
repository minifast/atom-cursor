import Atom from '../../src/atom-cursor/atom'
import Cursor from '../../src/atom-cursor/cursor'

describe('Atom', () => {
  let atom, data

  beforeEach(() => {
    data = {nested: {eggs: 'delicious'}}
    atom = new Atom(data)
  })

  describe('#get', () => {
    it('returns the data in the atom', () => {
      expect(atom.get()).toBe(data)
    })

    describe('when a command has been enqueued', () => {
      let command, value

      beforeEach(() => {
        value = {ham: 'gross'}
        command = {$set: value}
        atom.update(command)
      })

      it('returns the result of running the command', () => {
        expect(atom.get()).toBe(value)
      })

      it('does not clear the log', () => {
        expect(atom.log()).toEqual([command])
      })
    })
  })

  describe('#toCursor', () => {
    it('returns a cursor', () => {
      expect(atom.toCursor()).toEqual(jasmine.any(Cursor))
    })
  })

  describe('#log', () => {
    describe('when no commands have been enqueued', () => {
      it('returns an empty log', () => {
        expect(atom.log()).toEqual([])
      })
    })

    describe('when a command has been enqueued', () => {
      let command

      beforeEach(() => {
        command = {$set: true}
        atom.update(command)
      })

      it('returns the command', () => {
        expect(atom.log()).toEqual([command])
      })

      describe('when a later command has been enqueued', () => {
        let otherCommand

        beforeEach(() => {
          otherCommand = {$set: false}
          atom.update(otherCommand)
        })

        it('returns the commands in order', () => {
          expect(atom.log()).toEqual([command, otherCommand])
        })
      })
    })
  })

  describe('#update', () => {
    let command

    beforeEach(() => {
      command = {$set: true}
    })

    it('enqueues a command in the log', () => {
      atom.update(command)
      expect(atom.log()).toEqual([command])
    })

    it('eventually compacts the log', (done) => {
      atom.update(command)
      setImmediate(() => {
        expect(atom.log()).toEqual([])
        done()
      })
    })

    it('eventually sets the data in the atom', (done) => {
      atom.update(command)
      setImmediate(() => {
        expect(atom.get()).toEqual(true)
        done()
      })
    })

    it('returns a promise that resolves when the command is compacted', (done) => {
      atom.update(command).then(() => {
        expect(atom.log()).toEqual([])
        done()
      })
    })
  })

  describe('#attach', () => {
    let subscription

    beforeEach(() => {
      subscription = {notify: jasmine.createSpy('notify')}
      atom.attach(subscription)
    })

    it('notifies the subscription on compaction', () => {
      atom.update({$set: true})
      expect(subscription.notify).not.toHaveBeenCalled()
      atom.compact()
      expect(subscription.notify).toHaveBeenCalledWith(true, data)
    })
  })

  describe('#detach', () => {
    let subscription

    beforeEach(() => {
      subscription = {notify: jasmine.createSpy('notify')}
      atom.attach(subscription)
    })

    it('does not notify the subscription on compaction', () => {
      atom.update({$set: true})
      atom.detach(subscription)
      expect(subscription.notify).not.toHaveBeenCalled()
      atom.compact()
      expect(subscription.notify).not.toHaveBeenCalled()
    })
  })
})
