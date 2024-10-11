import clsx from 'clsx'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

type RippleComponent = {
  color?: string
  duration?: number
  wrapperClass?: string
}

type RippleItem = {
  x: number
  y: number
  size: number
  id: number
}

export type RippleRef = {
  addRipple: (e: React.MouseEvent<HTMLElement>) => void
}

const Ripple = forwardRef<RippleRef, RippleComponent>(
  (
    { color = '#e0e0e0', duration = 2000, wrapperClass }: RippleComponent,
    ref
  ) => {
    const [rippleArr, setRippleArr] = useState<RippleItem[]>([])
    const rippleContainerRef = useRef<HTMLSpanElement>(null)
    const addRipple = (e: React.MouseEvent<HTMLElement>) => {
      e.stopPropagation()
      if (!rippleContainerRef.current) return
      const targetBoundObj = rippleContainerRef.current.getBoundingClientRect()
      const size =
        targetBoundObj.width > targetBoundObj.height
          ? targetBoundObj.width * 2
          : targetBoundObj.height * 2
      const newRiple: RippleItem = {
        x: e.pageX - targetBoundObj.x - size / 2,
        y: e.pageY - targetBoundObj.y - size / 2,
        size: size,
        id: Date.now(),
      }
      setRippleArr([...rippleArr, newRiple])
    }
    useImperativeHandle(ref, () => {
      return {
        addRipple: addRipple,
      }
    })
    useEffect(() => {
      let bounce: number = 1
      if (rippleArr.length > 0) {
        clearTimeout(bounce)

        bounce = setTimeout(() => {
          //   setRippleArr([])
          clearTimeout(bounce)
        }, duration)
      }
      return () => clearTimeout(bounce)
    }, [duration, rippleArr])
    return (
      <span
        ref={rippleContainerRef}
        className={clsx('absolute inset-0 overflow-hidden', wrapperClass)}
      >
        {rippleArr?.map((item) => (
          <span
            key={item.id}
            className="bg-gray-500 absolute pointer-events-none"
            style={{
              top: item.y,
              left: item.x,
              width: item.size,
              height: item.size,
              animationName: 'ripple',
              animationDuration: `${duration}ms`,
              backgroundColor: `${color}`,
              borderRadius: '100%',
              transform: 'scale(0)',
              opacity: 0.75,
            }}
          />
        ))}
      </span>
    )
  }
)

export default Ripple
