import { useLoadMore } from '@components/PartsCollection/InfiniteScroll/hooks'
import {
  forwardRef,
  PropsWithChildren,
  useId,
  useImperativeHandle,
  useRef,
} from 'react'

export type ExposeInfiniteChatScrollRef = {
  scrollToBottom: () => void
  containerElement: HTMLDivElement | null
}

const InfiniteChatScroll = forwardRef<
  ExposeInfiniteChatScrollRef,
  PropsWithChildren<{
    onLoadMoreMessage: () => void
    disabledLoadMore: boolean
  }>
>(({ children, onLoadMoreMessage, disabledLoadMore }, ref) => {
  const topPanelId = useId()
  const topPanelRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useImperativeHandle(ref, () => ({
    scrollToBottom,
    containerElement: containerRef.current,
  }))

  useLoadMore({
    loadMoreElement: topPanelRef.current,
    onLoadMore: onLoadMoreMessage,
    skip: disabledLoadMore,
    observerOption: {
      root: containerRef.current,
      threshold: 1,
      rootMargin: '0px',
    },
  })

  return (
    <div
      className="flex-1 flex flex-col gap-2 px-4 overflow-y-auto w-full"
      ref={containerRef}
    >
      <div id={topPanelId} ref={topPanelRef}></div>
      {children}
      <div ref={messagesEndRef} />
    </div>
  )
})

export default InfiniteChatScroll
