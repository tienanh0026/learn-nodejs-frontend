import { useWindowSize } from '@modules/funcs/hooks'
import clsx from 'clsx'
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type BaseModalProps = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  wrapperClass?: string
  bodyClass?: string
  openAnimationName?: string
  closeAnimationName?: string
  animationDuration?: number
  isOptionList?: boolean
  buttonRef?: RefObject<HTMLElement>
}

function BaseModal({
  isOpen,
  onClose,
  children,
  openAnimationName,
  closeAnimationName,
  animationDuration = 1000,
  wrapperClass,
  bodyClass,
  isOptionList = false,
  buttonRef,
}: BaseModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const modalBodyRef = useRef<HTMLDivElement>(null)

  const body = document.body
  const [open, setOpen] = useState(isOpen)
  const [width] = useWindowSize(isOptionList)

  useEffect(() => {
    if (isOpen) {
      setOpen(isOpen)
    } else if (modalRef.current && closeAnimationName) {
      modalRef.current.style.animationName = closeAnimationName
      modalRef.current.style.animationDuration = `${animationDuration}ms`
      setTimeout(() => {
        setOpen(isOpen)
      }, animationDuration - 50)
    } else setOpen(isOpen)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])
  useLayoutEffect(() => {
    if (open && modalRef.current && openAnimationName) {
      modalRef.current.style.animationName = openAnimationName
      modalRef.current.style.animationDuration = `${animationDuration}ms`
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])
  useEffect(() => {
    if (open) {
      body.style.overflow = 'hidden'
    } else body.style.removeProperty('overflow')
    return () => {
      if (open) body.style.removeProperty('overflow')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useLayoutEffect(() => {
    if (
      !isOptionList ||
      !(buttonRef && buttonRef.current) ||
      !open ||
      !modalBodyRef.current
    )
      return
    const boundingBtnObject = buttonRef.current.getBoundingClientRect()
    modalBodyRef.current.style.inset = 'unset'
    modalBodyRef.current.style.marginTop = '5px'
    modalBodyRef.current.style.top = `${
      boundingBtnObject.top + boundingBtnObject.height
    }px`
    modalBodyRef.current.style.left = `${boundingBtnObject.left}px`
    if (
      modalBodyRef.current.offsetWidth + boundingBtnObject.left >
      width - 50
    ) {
      modalBodyRef.current.style.left = `${
        boundingBtnObject.left -
        modalBodyRef.current.offsetWidth +
        boundingBtnObject.width
      }px`
    }
  }, [buttonRef, isOptionList, open, width])

  if (!open) return null
  return (
    <>
      {createPortal(
        <div
          role="presentation"
          ref={modalRef}
          className={clsx('fixed inset-0 z-50 dark:text-white', wrapperClass)}
        >
          <div className="absolute size-full z-0" onClick={onClose}></div>
          <div
            ref={modalBodyRef}
            className={clsx(
              bodyClass,
              'absolute inset-0 size-fit m-auto bg-white dark:bg-gray-400 p-4 rounded-md shadow-[rgba(0,0,0,0.24)_0px_3px_8px]',
              'z-10'
            )}
          >
            {children}
          </div>
        </div>,
        body
      )}
    </>
  )
}

export default BaseModal
