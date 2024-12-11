const formatQueryParams = (
  object: Record<string, string | number | undefined>
): string => {
  const newObj: Record<string, string> = Object.keys(object).reduce<
    Record<string, string>
  >((obj, key) => {
    const value = object[key]
    if (value) obj[key] = value.toString()
    return obj
  }, {})
  return `?${new URLSearchParams(newObj).toString()}`
}

const addLeadingZero = (num: number): string => {
  return num < 10 ? `0${num}` : `${num}`
}

export { formatQueryParams, addLeadingZero }
