import { useClickAway, useWindowSize } from '@modules/funcs/hooks'
import clsx from 'clsx'
import {
  createContext,
  RefObject,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

const SelectContext = createContext<
  | {
      isOpen: boolean
      toggleOpen: () => void
      triggerElementRef: RefObject<HTMLButtonElement>
      onSelect: SelectProps['onSelect']
      selectValue: SelectProps['selectValue']
      disabled?: boolean
    }
  | undefined
>(undefined)

type SelectProps = {
  defaultOpenValue?: boolean
  children: React.ReactNode
  selectValue: string | number | undefined
  onSelect: (selectValue: string | number | undefined) => void
  disabled?: boolean
}

type SelectTriggerProps = {
  renderIcon?: React.ReactElement
  children?: React.ReactNode
  wrapperClass?: string
  iconPosition?: 'right' | 'left'
}

type SelectContentProps = {
  wrapperClass?: string
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
}

type SelectItemProps = {
  wrapperClass?: string
  children: React.ReactNode
  value: number | string | undefined
  disabled?: boolean
}

const useSelectContext = () => {
  const context = useContext(SelectContext)
  if (!context) {
    throw new Error('Select components must be used within a Select')
  }
  return context
}

function Select({
  defaultOpenValue = false,
  children,
  onSelect,
  selectValue,
  disabled,
}: SelectProps) {
  const [isOpenPopup, setIsOpenPopup] = useState(defaultOpenValue)
  const toggleOpen = () => {
    setIsOpenPopup(!isOpenPopup)
  }
  const triggerElementRef = useRef<HTMLButtonElement>(null)
  return (
    <SelectContext.Provider
      value={{
        isOpen: isOpenPopup,
        toggleOpen,
        triggerElementRef,
        onSelect,
        selectValue,
        disabled,
      }}
    >
      {children}
    </SelectContext.Provider>
  )
}

function SelectTrigger({
  renderIcon,
  iconPosition = 'right',
  children,
  wrapperClass,
}: SelectTriggerProps) {
  const { toggleOpen, triggerElementRef, disabled } = useSelectContext()
  const handleSelectToggle: React.MouseEventHandler = (e) => {
    if (disabled) return
    e.stopPropagation()
    toggleOpen()
  }
  return (
    <button
      type="button"
      onClick={handleSelectToggle}
      disabled={disabled}
      className={clsx(
        wrapperClass,
        'flex gap-2 justify-center items-center w-fit border border-gray-500 rounded-lg p-2'
      )}
      ref={triggerElementRef}
    >
      {children}
      <span
        className={clsx(
          iconPosition === 'right' ? 'order-last' : 'order-first'
        )}
      >
        {renderIcon}
      </span>
    </button>
  )
}

function SelectContent({
  children,
  wrapperClass,
  align = 'left',
}: SelectContentProps) {
  const { isOpen, triggerElementRef, toggleOpen } = useSelectContext()
  const contentContainerRef = useRef<HTMLDivElement>(null)
  const size = useWindowSize(isOpen)
  useLayoutEffect(() => {
    const { current: contentContainerElement } = contentContainerRef
    const { current: triggerElement } = triggerElementRef

    if (!isOpen || !contentContainerElement || !triggerElement) return
    contentContainerElement.style.position = 'fixed'
    const triggerClientRect = triggerElement.getBoundingClientRect()
    contentContainerElement.style.top = `${
      triggerClientRect.top + triggerClientRect.height
    }px`
    if (align === 'center')
      contentContainerElement.style.left = `${
        triggerClientRect.left +
        triggerClientRect.width / 2 -
        contentContainerElement.getBoundingClientRect().width / 2
      }px`

    if (align === 'left')
      contentContainerElement.style.left = `${triggerClientRect.left}px`
    if (align === 'right')
      contentContainerElement.style.left = `${
        triggerClientRect.left +
        triggerClientRect.width -
        contentContainerElement.getBoundingClientRect().width
      }px`
  }, [isOpen, triggerElementRef, size, align])

  useClickAway(contentContainerRef, () => {
    if (isOpen) toggleOpen()
  })

  if (!isOpen) return null

  const body = document.body
  if (!body) return null
  return (
    <>
      {createPortal(
        <div
          ref={contentContainerRef}
          className={clsx(
            wrapperClass,
            'my-2 flex flex-col border border-gray-400 rounded-md shadow-lg overflow-hidden'
          )}
        >
          {children}
        </div>,
        body
      )}
    </>
  )
}

function SelectItem({
  children,
  wrapperClass,
  value,
  disabled,
}: SelectItemProps) {
  const { onSelect, toggleOpen, selectValue } = useSelectContext()
  return (
    <button
      onClick={() => {
        if (disabled) return
        onSelect(value)
        toggleOpen()
      }}
      disabled={disabled}
      className={clsx(
        wrapperClass,
        'p-2 hover:bg-slate-100 bg-white',
        String(selectValue) === String(value) && 'bg-slate-300'
      )}
    >
      {children}
    </button>
  )
}

Select.Trigger = SelectTrigger
Select.Content = SelectContent
Select.Item = SelectItem

export default Select
