import MessageCard from '@components/Parts/MessageCard'
import { getMessageList } from '@modules/api/message-list'
import { getRoomDetail } from '@modules/api/room'
import { sendMessage } from '@modules/api/send-message'
import { socket } from '@modules/libs/socket'
import { Message } from '@modules/models/message'
import { RoomDetail } from '@modules/models/room'
import { SocketMessage } from '@modules/models/socket'
import React, {
  RefObject,
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
import usePreviewMediaFile from '@modules/funcs/hooks'
import { useSelector } from 'react-redux'
import { authState } from '@modules/redux/AuthSlice/AuthSlice'
import List from 'react-virtualized/dist/commonjs/List'
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  ListRowProps,
} from 'react-virtualized'
import 'react-virtualized/styles.css'
const cache = new CellMeasurerCache({
  // fixedWidth: true,
  minHeight: 20,
})

type MessageRenderer = ListRowProps & {
  item: Message | undefined
  messagesEndRef: RefObject<HTMLDivElement>
  topPanelRef: RefObject<HTMLDivElement>
  topPanelId: string
}

function messageRowRenderer({
  item,
  messagesEndRef,
  topPanelRef,
  topPanelId,
  ...listProps
}: MessageRenderer) {
  return (
    <CellMeasurer
      cache={cache}
      columnIndex={0}
      key={listProps.key}
      parent={listProps.parent}
      rowIndex={listProps.index}
      // style={listProps.style}
    >
      {({ registerChild }) => (
        <>
          {item && (
            <div
              style={listProps.style}
              ref={
                listProps.index === 0
                  ? topPanelRef
                  : listProps.index === listProps.parent.props.rowCount - 1
                  ? messagesEndRef
                  : undefined
              }
            >
              {listProps.index === 0
                ? 'topPanelRef'
                : listProps.index === listProps.parent.props.rowCount - 1
                ? 'messagesEndRef'
                : undefined}
              {/* {listProps.index === 0 && (
              <div id={topPanelId} ref={topPanelRef}></div>
            )} */}
              <MessageCard
                message={item}
                // styles={listProps.style}
              />
              {/* {listProps.index === listProps.parent.props.rowCount - 1 && (
              <div ref={messagesEndRef} />
            )} */}
            </div>
          )}
        </>
      )}
    </CellMeasurer>
  )
}

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
  const { user } = useSelector(authState)
  const { previewFile, setPreviewFile } = usePreviewMediaFile(file)

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
  const containerRef = useRef<List>(null)
  const isNew = useRef<boolean>(false)
  const prevScroll = useRef<number | undefined>()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputFileRef = useRef<HTMLInputElement>(null)

  const handleLoadMoreMessage = useCallback(() => {
    if (!roomId) return
    if (currentPage.totalPage && currentPage.page < currentPage.totalPage) {
      console.log('asdm;adkasdasdasd')

      setIsLoadMore(true)
      // prevScroll.current = containerRef.current?.scrollHeight
      // containerRef.current?.scrollToRow(9)
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
    // const scrollTop = containerRef.current?.scrollHeight
    // containerRef.current?.scrollTo({
    //   top: scrollTop,
    // })
    containerRef.current?.scrollToRow(
      messageList?.length ? messageList?.length : 0
    )
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      setFile(e.target.files[0])
      e.target.value = ''
    }
  }

  const isOwner = user && roomDetail && user.id === roomDetail.ownerId

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
      root: document.getElementById('test'),
      threshold: 1,
      rootMargin: '0px',
    },
  })

  useKeepScrollPosition({
    deps: [messageList?.length],
    isKeep: !isNew.current,
    container: document.getElementById('test'),
  })

  useLayoutEffect(() => {
    if (isNew.current) scrollToBottom()
  }, [messageList?.length])
  const [render, setRender] = useState(false)
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
          <div className="flex gap-2">
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
            {isOwner && <Link to={`/room/${roomId}/setting`}>Setting</Link>}
          </div>
        </div>
        {/* <div
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
        </div> */}
        <div className="flex-1 px-4 overflow-y-auto w-full">
          <AutoSizer>
            {({ width, height }) => (
              <>
                <List
                  id="test"
                  ref={containerRef}
                  rowCount={messageList?.length || 0}
                  width={width}
                  height={height}
                  // isScrolling={() => {
                  //   setRender(!render)
                  // }}
                  deferredMeasurementCache={cache}
                  rowHeight={cache.rowHeight}
                  onRowsRendered={() => {
                    setRender(!render)
                  }}
                  rowRenderer={(props) =>
                    messageRowRenderer({
                      ...props,
                      item: messageList ? messageList[props.index] : undefined,
                      messagesEndRef: messagesEndRef,
                      topPanelId: topPanelId,
                      topPanelRef: topPanelRef,
                    })
                  }
                />
              </>
            )}
          </AutoSizer>
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
          {previewFile && (
            <div className="h-32 mt-2 p-2 w-fit flex items-center justify-center gap-1 flex-col group relative border border-gray-300 rounded-md">
              <button
                type="button"
                onClick={() => {
                  setFile(undefined)
                  setPreviewFile(undefined)
                }}
                className="absolute -top-[2px] -right-[2px] bg-slate-400 text-white font-semibold p-1 size-5  items-center justify-center rounded-full hidden group-hover:flex"
              >
                x
              </button>
              {previewFile.type === 'image' ? (
                <img
                  src={previewFile.data}
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
