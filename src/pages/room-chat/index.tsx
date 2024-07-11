import MessageCard from '@components/Parts/MessageCard'
import { getMessageList } from '@modules/api/message-list'
import { getRoomDetail } from '@modules/api/room'
import { sendMessage } from '@modules/api/send-message'
import { socket } from '@modules/libs/socket'
import { Message } from '@modules/models/message'
import { RoomDetail } from '@modules/models/room'
import { SocketMessage } from '@modules/models/socket'
import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ChevronLeftIcon,
  PaperClipIcon,
  FilmIcon,
} from '@heroicons/react/24/solid'
import { BellIcon } from '@heroicons/react/24/outline'
import { getPushNoti } from '@modules/api/push-notification'
import usePushNotifications from '@modules/libs/service-worker/hooks'
import {
  useKeepScrollPosition,
  useLoadMore,
} from '@components/PartsCollection/InfiniteScroll/hooks'

function RoomChat() {
  const [content, setContent] = useState('')
  const [messageList, setMessageList] = useState<Message[]>()
  const messageListDefered = useDeferredValue(messageList)
  const [roomDetail, setRoomDetail] = useState<RoomDetail>()
  const { onClickSusbribeToPushNotification } = usePushNotifications()
  const { roomId } = useParams()
  const [isLoadMore, setIsLoadMore] = useState(false)
  const topPanelId = useId()
  const [currentPage, setCurrentPage] = useState<{
    page: number
    totalPage: number | undefined
  }>({
    page: 1,
    totalPage: undefined,
  })

  const [file, setFile] = useState<File>()
  const [filePreview, setFilePreview] = useState<
    { data: string | undefined; type: 'image' | 'video' } | undefined
  >()

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!roomId) return
    if (!content && !file) return
    try {
      const form = new FormData()
      if (file) form.append('file', file)
      form.append('content', content)
      await sendMessage({
        roomId,
        formData: form,
      })
      setContent('')
      setFile(undefined)
    } catch {
      //
    }
  }

  const topPanelRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isNew = useRef<boolean>(false)
  const prevScroll = useRef<number | undefined>()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputFileRef = useRef<HTMLInputElement>(null)

  const handleLoadMoreMessage = useCallback(() => {
    if (!roomId) return
    if (currentPage.totalPage && currentPage.page < currentPage.totalPage) {
      setIsLoadMore(true)
      prevScroll.current = containerRef.current?.scrollHeight
      getMessageList({ roomId, page: currentPage.page + 1 })
        .then((res) => {
          setCurrentPage({
            page: res.data.data.currentPage,
            totalPage: res.data.data.totalPages,
          })
          isNew.current = false
          setMessageList((prevList) => {
            if (!prevList) return res.data.data.list.reverse()
            return [...res.data.data.list.reverse(), ...prevList]
          })
        })
        .finally(() => {
          setIsLoadMore(false)
        })
    }
  }, [currentPage, roomId])

  const scrollToBottom = () => {
    const scrollTop = containerRef.current?.scrollHeight
    containerRef.current?.scrollTo({
      top: scrollTop,
    })
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      setFile(e.target.files[0])
      e.target.value = ''
    }
  }

  useEffect(() => {
    if (!file) return setFilePreview(undefined)
    const imageRegex = /^image\/(jpeg|png|gif|webp|bmp|svg\+xml)$/
    const isImage = imageRegex.test(file.type)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      setFilePreview({
        data: reader.result?.toString(),
        type: isImage ? 'image' : 'video',
      })
      return
    }
    reader.onerror = function (error) {
      console.log('Error: ', error)
      setFilePreview(undefined)
      return
    }
  }, [file])

  useEffect(() => {
    if (!messageListDefered) {
      scrollToBottom()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageList])

  useEffect(() => {
    if (!roomId) return
    getMessageList({ roomId, page: 1 }).then((response) => {
      setCurrentPage({
        page: response.data.data.currentPage,
        totalPage: response.data.data.totalPages,
      })
      setMessageList(() => response.data.data.list.reverse())
    })
    getRoomDetail(roomId).then((response) => {
      setRoomDetail(response.data.data)
    })
  }, [roomId])

  useEffect(() => {
    if (roomId && socket.active)
      socket.connect().on(`${roomId}-message`, (e: SocketMessage) => {
        console.log(e)
        isNew.current = true

        setMessageList((prev) => {
          if (!prev) return [e]
          return [...prev, e]
        })
      })

    return () => {
      socket.off(`${roomId}-message`)
    }
  }, [roomId])

  useLoadMore({
    loadMoreElement: topPanelRef.current,
    onLoadMore: handleLoadMoreMessage,
    skip: isLoadMore && !!messageList,
    observerOption: {
      root: containerRef.current,
      threshold: 1,
      rootMargin: '0px',
    },
  })

  useKeepScrollPosition({
    deps: [messageList?.length],
    isKeep: !isNew.current,
    container: containerRef.current,
  })

  useLayoutEffect(() => {
    if (isNew.current) scrollToBottom()
  }, [messageList?.length])

  return (
    <>
      <div className="size-full flex flex-col">
        <div className="w-full p-2 px-4 border-b border-gray-300 flex justify-between gap-2">
          <div className="flex gap-2 items-center">
            <Link to={'/room-list'} className="hover:underline p-1">
              <ChevronLeftIcon className="size-5" />
            </Link>
            <h2 className="font-semibold">{roomDetail?.name}</h2>
          </div>
          <button
            type="button"
            onClick={async () => {
              const subscription =
                await onClickSusbribeToPushNotification().then()
              if (!subscription || !roomId) return
              const key = subscription.toJSON().keys
              if (!key) return
              getPushNoti({
                roomId: roomId,
                endpoint: subscription.endpoint,
                key: key,
              })
            }}
          >
            <BellIcon className="size-5" />
          </button>
        </div>
        <div
          className="flex-1 flex flex-col gap-2 px-4 overflow-y-auto w-full"
          ref={containerRef}
        >
          <div id={topPanelId} ref={topPanelRef}></div>
          {isLoadMore && 'Loading'}
          {messageList &&
            messageList.map((message) => (
              <MessageCard message={message} key={message.id} />
            ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex flex-col p-4">
          <form className="flex gap-2" onSubmit={handleSendMessage}>
            <input
              placeholder="Enter message"
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
              }}
              className="flex-1 focus:outline-none focus:ring-1 focus:ring-gray-600 rounded-md p-2 border border-gray-500"
            />
            <button
              type="button"
              className="bg-gray-200 p-2 border border-black rounded-md hover:opacity-60"
              onClick={() => {
                inputFileRef.current?.click()
              }}
            >
              <PaperClipIcon className="size-5" />
            </button>
            <button className="p-2 bg-blue-600 font-medium text-white rounded-md border border-black">
              Send
            </button>
            <input
              type="file"
              className="hidden"
              multiple={false}
              ref={inputFileRef}
              onChange={handleChangeFile}
            />
          </form>
          {filePreview && (
            <div className="h-32 mt-2 p-2 w-fit flex items-center justify-center gap-1 flex-col group relative border border-gray-300 rounded-md">
              <button
                type="button"
                onClick={() => {
                  setFile(undefined)
                  setFilePreview(undefined)
                }}
                className="absolute -top-[2px] -right-[2px] bg-slate-400 text-white font-semibold p-1 size-5  items-center justify-center rounded-full hidden group-hover:flex"
              >
                x
              </button>
              {filePreview.type === 'image' ? (
                <img
                  src={filePreview.data}
                  className="max-w-40 h-full object-contain"
                />
              ) : (
                <FilmIcon className="h-full flex-1 w-fit" />
              )}
              <p className="text-sm pt-1/2 text-gray-600 truncate text-medium shrink-0">
                {file?.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default RoomChat
