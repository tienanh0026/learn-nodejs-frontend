const formatQueryParams = (
  object: Record<string, string | number | undefined>
): string => {
  const newObj: Record<string, string> = Object.keys(object).reduce<
    Record<string, string>
  >((obj, key) => {
    if (object[key]) obj[key] = object[key].toString()
    return obj
  }, {})
  return `?${new URLSearchParams(newObj).toString()}`
}

export { formatQueryParams }
