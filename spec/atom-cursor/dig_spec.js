import dig from '../../src/atom-cursor/dig'

describe('Dig', () => {
  it('returns the value at a key', () => {
    expect(dig({ nested: 'wow' }, ['nested'])).toEqual('wow')
  })

  it('returns the value at a key one level deep', () => {
    expect(dig({ nested: { bork: 'sup' } }, ['nested', 'bork'])).toEqual('sup')
  })

  it('returns null when the path does not exist', () => {
    expect(dig({ nested: 'wow' }, ['boop'])).toEqual(null)
  })

  it('returns the pile when the path is undefined', () => {
    expect(dig({ nested: 'wow' }, undefined)).toEqual({ nested: 'wow' })
  })

  it('returns the pile when the path is an empty array', () => {
    expect(dig({ nested: 'wow' }, [])).toEqual({ nested: 'wow' })
  })
})
