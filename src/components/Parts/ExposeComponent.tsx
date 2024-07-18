import { forwardRef, useImperativeHandle } from 'react'

type ExposeProps = {
  title: string
}

const ExposeFunction = forwardRef<
  {
    a: string
    logA: () => void
  },
  ExposeProps
>(function Test({ title }: ExposeProps, ref) {
  const a = 'test inside1'
  const logA = () => {
    console.log(a)
  }
  useImperativeHandle(ref, () => {
    return {
      a,
      logA,
    }
  })
  return <div>{title}</div>
})

export default ExposeFunction
