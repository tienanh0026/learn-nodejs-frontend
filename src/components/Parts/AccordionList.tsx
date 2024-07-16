import { Fragment, ReactNode, useEffect, useRef, useState } from 'react'

type AccordionListProps<T> = {
  renderItem: (item: T) => ReactNode
  list: T[]
  title: string
  isDefaultOpen?: boolean
}

function AccordionList<T>({
  title,
  list,
  renderItem,
  isDefaultOpen,
}: AccordionListProps<T>) {
  const [toogle, setToggle] = useState(
    isDefaultOpen !== undefined ? isDefaultOpen : true
  )
  const listRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)

  const handleToogleList = () => {
    setToggle(!toogle)
  }
  useEffect(() => {
    if (!listRef.current) return
    console.log(listRef.current.scrollHeight)
    listRef.current.style.maxHeight = toogle
      ? `${listRef.current.scrollHeight}px`
      : '0px'
    if (!iconRef.current) return
    if (toogle) iconRef.current.classList.remove('rotate-90')
    else iconRef.current.classList.add('rotate-90')
  }, [toogle])
  return (
    <>
      <button
        type="button"
        onClick={handleToogleList}
        className="flex items-center"
      >
        <span className="relative size-4">
          <span className="block h-[3px] w-4 bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          <span
            ref={iconRef}
            className="block h-[3px] w-4 bg-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform rotate-90"
          />
        </span>
        <span className="ml-1">{title}</span>
      </button>
      <div
        ref={listRef}
        className="transition-all duration-300 overflow-hidden flex gap-2 flex-col"
      >
        {list.map((item, index) => (
          <Fragment key={index}>{renderItem(item)}</Fragment>
        ))}
      </div>
    </>
  )
}

export default AccordionList
