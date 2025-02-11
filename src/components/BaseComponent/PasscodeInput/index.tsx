import { KeyboardEvent, useEffect, useId, useRef, useState } from 'react'

export default function PasscodeInput({
  onPasscodeChange,
}: {
  //   passcode: string
  onPasscodeChange: (passcode: string) => void
}) {
  const id = useId()

  const [values, setValues] = useState<(number | string)[]>([
    '',
    '',
    '',
    '',
    '',
    '',
  ])

  const [focusIndex, setFocusIndex] = useState<number>(0)

  const setFocusIndexUp = () => {
    if (focusIndex !== values.length - 1) setFocusIndex(focusIndex + 1)
  }

  const setFocusIndexDown = () => {
    if (focusIndex !== 0) setFocusIndex(focusIndex - 1)
  }

  const inputRef = useRef<Array<HTMLInputElement> | []>([])

  const handleInputChange = (value: string, index: number) => {
    setValues((prev) => {
      const newValues = [...prev]
      newValues[index] = value
      return newValues
    })

    if (value.length === 1) setFocusIndexUp()
  }

  useEffect(() => {
    if (!inputRef.current.length) return
    const targetInput = inputRef.current.at(focusIndex)
    setTimeout(() => {
      targetInput?.focus()
      console.log('focus')
      targetInput?.setSelectionRange(
        targetInput.value.length,
        targetInput.value.length
      )
    }, 0)
  }, [focusIndex])

  useEffect(() => {
    const isFinished = values.every((value) => value)
    if (isFinished) onPasscodeChange(values.join(''))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values])

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Backspace' &&
      e.currentTarget.value.length === 0 &&
      focusIndex !== 0
    ) {
      setFocusIndexDown()
    }

    if (e.key === 'ArrowLeft') setFocusIndexDown()
    if (e.key === 'ArrowRight') setFocusIndexUp()
  }

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteText = e.clipboardData.getData('Text').slice(0, values.length)
    const newValues = [...values]
    let maxValue = focusIndex
    pasteText.split('').forEach((character, index) => {
      if (focusIndex + index <= values.length - 1) {
        maxValue = focusIndex + index
        newValues[focusIndex + index] = character
      }
    })
    setFocusIndex(maxValue)
    setValues(newValues)
  }

  return (
    <>
      <div className="flex gap-2">
        {values.map((value, index) => (
          <input
            key={id + index}
            value={String(value)}
            inputMode="numeric"
            ref={(el) => el && (inputRef.current[index] = el)}
            onChange={(e) => handleInputChange(e.target.value, index)}
            maxLength={1}
            onFocus={() => {
              setFocusIndex(index)
            }}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            className="border border-gray-400 w-10 h-12 rounded-md text-center dark:bg-slate-300 focus-visible:ring-0"
          />
        ))}
      </div>
    </>
  )
}
