export function taskValidator(props) {
  const keys = Object.keys(props)

  const keysUndefined = keys.filter(key => props[key] === undefined)

  return keysUndefined
}