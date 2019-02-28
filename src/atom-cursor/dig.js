const dig = (pile, path) => {
  if (path === undefined || path.length === 0) {
    return pile
  }

  const [head, ...tail] = path

  if (typeof pile[head] === 'object') {
    return dig(pile[head], tail)
  } else if (pile[head] === undefined) {
    return null
  } else {
    return pile[head]
  }
}

export default dig
