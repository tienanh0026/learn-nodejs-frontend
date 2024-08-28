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

export { formatQueryParams }
