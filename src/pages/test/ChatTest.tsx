import { useState, useRef, useEffect, useCallback } from 'react'
import {
  VariableSizeList as List,
  ListChildComponentProps,
  ListOnScrollProps,
} from 'react-window'
import './VirtualChatBox.css'
import { twMerge } from 'tailwind-merge'

type Message = {
  id: number
  text: string
}

const VirtualChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const listRef = useRef<List<Message[]>>(null)
  const sizeMap = useRef<Map<number, number>>(new Map())
  const userScrolledUp = useRef(false)

  const addMessage = (text: string, sender: 'me' | 'them' = 'me') => {
    setMessages((prev) => [
      ...prev,
      { id: prev.length, text: sender === 'me' ? text : `Bot: ${text}` },
    ])
  }

  const handleSend = () => {
    if (!input.trim()) return
    addMessage(input)
    setInput('')

    setTimeout(() => {
      addMessage('This is a simulated reply.', 'them')
    }, 1000)
  }

  const getItemSize = (index: number) => {
    return sizeMap.current.get(index) ?? 60
  }

  const Row = ({
    index,
    style,
    data,
    isScrolling,
  }: ListChildComponentProps<Message[]>) => {
    const rowRef = useRef<HTMLDivElement | null>(null)
    console.log('data', {
      index,
      style,
      data,
      isScrolling,
    })

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
        <div ref={rowRef} className="message-row">
          <div
            className={twMerge(
              'message-bubble',
              data[index].text.includes('Bot') ? 'ml-auto' : 'mr-auto'
            )}
          >
            {data[index].text}
          </div>
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

  const handleScroll = ({ scrollOffset }: ListOnScrollProps) => {
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
  }

  return (
    <div className="chat-wrapper">
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

      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message"
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default VirtualChatBox
