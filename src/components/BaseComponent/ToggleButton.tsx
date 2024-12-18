import clsx from 'clsx'
import { useEffect, useRef } from 'react'
import Ripple, { RippleRef } from './Ripple'

type ToggleButtonProps = {
  isActive: boolean
  activeClass?: string
  wrapperClass?: string
  toggleClass?: string
  onToggle?: () => void
  renderActiveIcon?: React.ReactElement
  renderInactiveIcon?: React.ReactElement
}

function ToggleButton({
  isActive,
  activeClass = 'bg-blue-600',
  wrapperClass,
  toggleClass,
  renderActiveIcon,
  renderInactiveIcon,
  onToggle,
}: ToggleButtonProps) {
  const toogleRef = useRef<HTMLSpanElement>(null)
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const rippleRef = useRef<RippleRef>(null)
  useEffect(() => {
    const { current: toggleElement } = toogleRef
    if (!toggleElement) return
    const wrapperWidth = wrapperRef.current?.offsetWidth
    const toggleWidth = toggleElement.offsetWidth

    if (!wrapperWidth || !toggleWidth) return
    if (isActive) {
      toggleElement.style.transform = `translateX(${
        wrapperWidth - toggleWidth
      }px)`
    } else {
      toggleElement.style.transform = `translateX(0px)`
    }
  }, [isActive])
  return (
    <button
      onMouseDown={(e) => {
        if (!rippleRef.current) return
        rippleRef.current.addRipple(e)
      }}
      onClick={onToggle}
      className={clsx(
        'p-1 border border-gray-600 rounded-full transition-all size-fit relative',
        isActive && activeClass,
        wrapperClass
      )}
    >
      <Ripple duration={2000} ref={rippleRef} wrapperClass="rounded-full" />
      <span
        className={clsx('flex gap-3 items-center relative')}
        ref={wrapperRef}
      >
        {renderActiveIcon}
        {renderInactiveIcon}
        <span
          ref={toogleRef}
          className={clsx(
            'absolute bg-black dark:bg-white inset-y-0 aspect-square rounded-full transition-all',
            toggleClass
          )}
        />
      </span>
    </button>
  )
}

export default ToggleButton
