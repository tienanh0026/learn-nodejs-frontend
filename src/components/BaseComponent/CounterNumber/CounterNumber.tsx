import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

type CounterNumberProps = {
  num: number
  time?: number
  numberClass?: string
}

export type ExposeRef = {
  resetCounter: () => void
}

const CounterNumber = forwardRef<ExposeRef, CounterNumberProps>(
  function CounterNumber(
    { num, time = 1000, numberClass }: CounterNumberProps,
    ref
  ) {
    const [trigger, setTrigger] = useState(0)
    const [countNum, setCountNum] = useState(0)
    const [_startTime, setStartTime] = useState<number | null>(null)
    useEffect(() => {
      if (num === 0 || time === 0) return

      const start = Date.now()
      setStartTime(start)
      const updateCounter = () => {
        const now = Date.now()
        const elapsedTime = now - start
        const nextValue = Math.min(Math.floor((elapsedTime / time) * num), num)
        setCountNum(nextValue)

        if (nextValue < num) {
          requestAnimationFrame(updateCounter)
        }
      }

      requestAnimationFrame(updateCounter)

      return () => setStartTime(null)
    }, [num, time, trigger])
    const resetCounter = () => {
      setTrigger((prev) => prev + 1) // Update trigger to re-run useEffect
    }

    useImperativeHandle(ref, () => ({
      resetCounter,
    }))

    return <span className={numberClass}>{countNum}</span>
  }
)

export default CounterNumber
