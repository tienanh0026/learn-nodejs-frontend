import clsx from 'clsx'
import { useCallback, useEffect, useId, useRef } from 'react'

type InfiniteScrollWrapperProps<T> = {
  children: React.ReactNode
  onLoadMore: () => void
  wrapperClass?: string
  isLoadMore: boolean
  data: T[]
}
function InfiniteScrollWrapper<T>({
  children,
  onLoadMore,
  wrapperClass,
  isLoadMore,
  data,
}: InfiniteScrollWrapperProps<T>) {
  const topPanelId = useId()
  const topPanelRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const callbackFunction = useCallback(() => {
    if (!isLoadMore) onLoadMore()
  }, [isLoadMore, onLoadMore])
  useEffect(() => {
    if (!containerRef.current || !topPanelRef.current) return
    const observer = new IntersectionObserver(callbackFunction, {
      root: containerRef.current,
      threshold: 1,
      rootMargin: '0px',
    })
    observer.observe(topPanelRef.current)
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (topPanelRef.current) observer.unobserve(topPanelRef.current)
    }
  }, [callbackFunction])
  return (
    <div
      className="flex-1 flex flex-col gap-2 p-4 overflow-auto"
      ref={containerRef}
    >
      <div className={clsx('flex flex-col gap-2', wrapperClass)}>
        <div id={topPanelId} ref={topPanelRef}></div>
        {children}
      </div>
    </div>
  )
}

export default InfiniteScrollWrapper
