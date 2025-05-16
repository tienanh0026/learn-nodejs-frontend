import { useRef, useEffect, useCallback } from 'react'
import {
  VariableSizeList as List,
  ListChildComponentProps,
  ListOnScrollProps,
} from 'react-window'
import { Message } from '@modules/models/message'
import MessageCard from './MessageCard'

const VirtualChatBox = ({
  messages,
  onLoadMessage,
}: {
  messages: Message[]
  onLoadMessage: () => void
  isLoading: boolean
}) => {
  const listRef = useRef<List<Message[]>>(null)
  const sizeMap = useRef<Map<number, number>>(new Map())
  const userScrolledUp = useRef(false)

  const getItemSize = useCallback((index: number) => {
    return sizeMap.current.get(index) ?? 60
  }, [])

  const Row = ({ index, style, data }: ListChildComponentProps<Message[]>) => {
    const rowRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      const el = rowRef.current
      if (!el) return

      const observer = new ResizeObserver(() => {
        const height = el.getBoundingClientRect().height
        if (sizeMap.current.get(index) !== height) {
          sizeMap.current.set(index, height)
          listRef.current?.resetAfterIndex(index)
        }
      })

      observer.observe(el)
      return () => observer.disconnect()
    }, [index])

    return (
      <div style={style}>
        <div ref={rowRef} className="py-2">
          <MessageCard message={data[index]} />
        </div>
      </div>
    )
  }

  const scrollToBottom = useCallback(() => {
    listRef.current?.scrollToItem(messages.length - 1, 'end')
  }, [messages.length])

  useEffect(() => {
    if (!userScrolledUp.current) {
      scrollToBottom()
    }
  }, [messages, scrollToBottom])

  const handleScroll = ({
    scrollOffset,
    scrollDirection,
  }: ListOnScrollProps) => {
    const list = listRef.current
    if (!list) return

    const estimatedTotalHeight = Array.from(sizeMap.current.values()).reduce(
      (a, b) => a + b,
      0
    )
    const viewHeight = list.props.height as number

    const scrolledToBottom =
      scrollOffset + viewHeight >= estimatedTotalHeight - 100
    userScrolledUp.current = !scrolledToBottom

    // Load older messages when scrolling to the top
    if (scrollOffset < 10 && scrollDirection === 'backward') {
      console.log('asmvasl;mv;alsmvl;')

      onLoadMessage()
    }

    // Load newer messages when scrolling to the bottom

    // Calculate total content height
    // let totalHeight = 0
    // for (let i = 0; i < messages.length; i++) {
    //   totalHeight += getItemSize(i)
    // }

    // if (
    //   totalHeight - scrollOffset - listHeight < 100 &&
    //   scrollDirection === 'forward'
    // ) {
    //   loadNewerMessages()
    // }
  }

  const prevMessagesLengthRef = useRef<number>(0)
  // After loading older messages, adjust scroll position
  useEffect(() => {
    if (
      prevMessagesLengthRef.current > 0 &&
      messages.length > prevMessagesLengthRef.current
    ) {
      // Calculate total height of new messages
      let newMessagesHeight = 0
      const newMessagesCount = messages.length - prevMessagesLengthRef.current

      for (let i = 0; i < newMessagesCount; i++) {
        newMessagesHeight += getItemSize(i)
      }

      // Scroll to maintain position after new messages are added
      if (listRef.current && newMessagesHeight > 0) {
        setTimeout(() => {
          listRef.current?.scrollTo(newMessagesHeight)
        }, 0)
      }

      prevMessagesLengthRef.current = 0
    }
  }, [messages, getItemSize])

  return (
    <List
      height={400}
      width={'100%'}
      itemCount={messages.length}
      itemSize={getItemSize}
      ref={listRef}
      onScroll={handleScroll}
      itemData={messages}
    >
      {Row}
    </List>
  )
}

export default VirtualChatBox
