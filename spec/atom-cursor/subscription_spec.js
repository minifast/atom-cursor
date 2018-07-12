import update from 'immutability-helper'
import Subscription from '../../src/atom-cursor/subscription'

describe('Subscription', () => {
  let subscription, path, handler

  beforeEach(() => {
    path = ['nested', 'eggs']
    handler = jasmine.createSpy('handler')
    subscription = new Subscription(path, handler)
  })

  describe('#notify', () => {
    let data

    beforeEach(() => {
      data = {nested: {eggs: 'delicious'}}
    })

    describe('when the data at the path has not changed', () => {
      it('does not notify the handler', () => {
        subscription.notify(data, data)
        expect(handler).not.toHaveBeenCalled()
      })
    })

    describe('when the data at the path has changed', () => {
      let newData

      beforeEach(() => {
        newData = update(data, {nested: {eggs: {$set: 'just okay'}}})
      })

      it('notifies the handler', () => {
        subscription.notify(newData, data)
        expect(handler).toHaveBeenCalledWith(newData.nested.eggs, data.nested.eggs)
      })
    })
  })
})
