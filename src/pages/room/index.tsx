import MessageCard from '@components/Parts/MessageCard'
import { getMessageList } from '@modules/api/message-list'
import { getRoomUserList } from '@modules/api/room'
import { scheduleMessage, useSendMessage } from '@modules/api/send-message'
import { socket } from '@modules/libs/socket'
import { Message } from '@modules/models/message'
import { RoomUser } from '@modules/models/room'
import { SocketMessage, TypingStatusMessage } from '@modules/models/socket'
import React, {
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ChevronDownIcon,
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
import { usePreviewMediaFile } from '@modules/funcs/hooks'
import { useSelector } from 'react-redux'
import { authState } from '@modules/redux/AuthSlice/AuthSlice'
import BaseAvatar from '@components/Parts/BaseAvatar'
import { useGetRoomDetailQuery } from '@modules/redux/api/room'
import { useGetMessageListQuery } from '@modules/redux/api/message'
import Select from '@components/BaseComponent/Select'
import ScheduleMessageModal from '@app/features/Chat/ScheduleMessageModal/ScheduleMessageModal'
import clsx from 'clsx'

function RoomChat() {
  const [content, setContent] = useState('')
  const [messageList, setMessageList] = useState<Message[]>()
  const messageListDefered = useDeferredValue(messageList)
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
  const [typingUser, setTypingUser] = useState<TypingStatusMessage['user'][]>(
    []
  )
  const [userList, setUserList] = useState<RoomUser[]>()

  const userReadList = useMemo(() => {
    return userList && userList.filter((user) => user.readAt)
  }, [userList])

  const { data: roomDetailData } = useGetRoomDetailQuery(roomId || '', {
    skip: !roomId,
  })

  const { data: _messageListData, refetch: _refetch } = useGetMessageListQuery(
    roomId
      ? {
          roomId: roomId,
          params: {
            page: currentPage.page + 1,
          },
        }
      : {
          roomId: '',
          params: {
            page: currentPage.page + 1,
          },
        },
    {
      skip: true,
    }
  )

  const { user } = useSelector(authState)
  const { previewFile, setPreviewFile } = usePreviewMediaFile(file)

  const { execute, isLoading } = useSendMessage(roomId || '', {
    content: content,
    file: file,
  })

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!roomId) return
    if (!content && !file) return
    try {
      await execute()
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

  const isOwner =
    user && roomDetailData && user.id === roomDetailData.data.ownerId

  useEffect(() => {
    if (!messageListDefered) {
      scrollToBottom()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageList])

  useEffect(() => {
    if (!roomId) return
    getRoomUserList({ roomId }).then((res) => {
      setUserList(res.data.data)
    })
    getMessageList({ roomId, page: 1 }).then((response) => {
      setCurrentPage({
        page: response.data.data.currentPage,
        totalPage: response.data.data.totalPages,
      })
      setMessageList(() => response.data.data.list.reverse())
    })
  }, [roomId])

  useEffect(() => {
    if (!roomId) return

    // Establish connection if it's not already connected
    if (!socket.connected) {
      socket.connect()
    }
    const handleNewMessage = (e: SocketMessage) => {
      isNew.current = true
      setMessageList((prev) => {
        if (!prev) return [e]
        return [...prev, e]
      })
    }
    const handleTypingStatus = (data: TypingStatusMessage) => {
      if (data.user.id === user?.id) return
      const existedUser = typingUser?.find(
        (typingUser) => typingUser.id === user?.id
      )
      if (data.isTyping && !existedUser)
        setTypingUser([...typingUser, data.user])
      if (!data.isTyping) {
        const newTypingUser = [...typingUser].filter(
          (userItem) => userItem.id !== data.user.id
        )
        setTypingUser(newTypingUser)
      }
    }

    // Attach event listeners
    socket.on(`${roomId}-message`, handleNewMessage)
    socket.on(`${roomId}-typing`, handleTypingStatus)
    // Clean up event listeners when roomId or component changes
    return () => {
      socket.off(`${roomId}-message`, handleNewMessage)
      socket.off(`${roomId}-typing`, handleTypingStatus)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, socket])

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

  const isTyping = useRef<boolean>(false)
  useEffect(() => {
    if (!user || !roomId) return
    if (!isTyping.current && content) {
      isTyping.current = true
      socket.emit('on-typing-message', {
        user,
        roomId: roomId,
      })
    }
    const typingTimeout = setTimeout(() => {
      isTyping.current = false
      socket.emit('on-stop-typing-message', {
        user,
        roomId: roomId,
      })
    }, 3000)
    return () => clearTimeout(typingTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  const [openScheduleModal, setOpenScheduleModal] = useState(false)
  const handleSubmitScheduleMessage = async (value: Date) => {
    if (!roomId) return
    if (!content && !file) return
    try {
      await scheduleMessage({
        roomId,
        message: {
          content,
          file,
        },
        time: value,
      })
      setContent('')
      setFile(undefined)
      setOpenScheduleModal(false)
    } catch {
      //
    }
  }

  return (
    <>
      {openScheduleModal && (
        <ScheduleMessageModal
          isOpen={openScheduleModal}
          onClose={() => setOpenScheduleModal(false)}
          onSubmitScheduleMessage={handleSubmitScheduleMessage}
          key={`${openScheduleModal}`}
        />
      )}
      <div className="size-full flex flex-col">
        <div className="w-full p-2 px-4 border-b border-gray-300 flex justify-between gap-2">
          <div className="flex gap-2 items-center">
            <Link to={'/room-list'} className="hover:underline p-1">
              <ChevronLeftIcon className="size-5" />
            </Link>
            <h2 className="font-semibold">{roomDetailData?.data?.name}</h2>
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
            {isOwner && (
              <Link to={`/room/${roomId}/livestream`}>Livestream</Link>
            )}
          </div>
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
          {userReadList && (
            <div className="ml-auto flex gap-1">
              {userReadList.map((readUser) => (
                <BaseAvatar
                  key={readUser.id + '-read'}
                  name={readUser.id}
                  wrapperClass="w-fit size-5 text-xs"
                />
              ))}
            </div>
          )}
          <div ref={messagesEndRef} />
          {typingUser.length !== 0 && (
            <div className="flex items-center">
              {typingUser.length === 1 ? (
                <p key={typingUser[0].id + '-typing'}>
                  {typingUser[0].name} is Typing
                </p>
              ) : (
                <p> Several people are typing</p>
              )}
              <span className="bg-gray-300 rounded-2xl flex items-center w-fit px-2 py-3 gap-2 h-full ml-2">
                <span className="size-[5px] rounded-full bg-black overflow-hidden animate-[fly-around_800ms_linear_infinite]"></span>
                <span className="size-[5px] rounded-full bg-black overflow-hidden animate-[fly-around_800ms_linear_infinite_200ms]"></span>
                <span className="size-[5px] rounded-full bg-black overflow-hidden animate-[fly-around_800ms_linear_infinite_400ms]"></span>
              </span>
            </div>
          )}
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
            <div className="flex rounded-md border border-black overflow-hidden">
              <button
                disabled={(!content && !file) || isLoading}
                className="p-2 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-black bg-blue-600 font-medium text-white border-r border-black flex gap-1 items-center"
              >
                Send
                {isLoading && (
                  <svg
                    className="animate-spin size-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                )}
              </button>
              <Select
                selectValue={undefined}
                onSelect={(value) => {
                  if (value === 'schedule-message') setOpenScheduleModal(true)
                }}
                disabled={!content && !file}
              >
                <Select.Trigger
                  wrapperClass="border-none px-1 bg-blue-600 rounded-none disabled:bg-gray-200 disabled:cursor-not-allowed"
                  renderIcon={
                    <ChevronDownIcon
                      className={clsx('size-4')}
                      color={!content && !file ? 'black' : 'white'}
                    />
                  }
                ></Select.Trigger>
                <Select.Content align="right">
                  <Select.Item value={'schedule-message'}>
                    Schedule Message
                  </Select.Item>
                </Select.Content>
              </Select>
            </div>
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
