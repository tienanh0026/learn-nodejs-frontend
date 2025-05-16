import { getMessageList } from '@modules/api/message-list'
import { getRoomUserList } from '@modules/api/room'
import { socket } from '@modules/libs/socket'
import { Message } from '@modules/models/message'
import { RoomUser } from '@modules/models/room'
import { SocketMessage, TypingStatusMessage } from '@modules/models/socket'
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronLeftIcon } from '@heroicons/react/24/solid'
import { BellIcon } from '@heroicons/react/24/outline'
import { getPushNoti } from '@modules/api/push-notification'
import usePushNotifications from '@modules/libs/service-worker/hooks'
import { useSelector } from 'react-redux'
import { authState } from '@modules/redux/AuthSlice/AuthSlice'
import BaseAvatar from '@components/Parts/BaseAvatar'
import { useGetRoomDetailQuery } from '@modules/redux/api/room'
import SendMessageInput from '@app/features/Chat/SendMessageInput/SendMessageInput'
import TypingSection from '@app/features/Chat/TypingSection/TypingSection'
import { ExposeInfiniteChatScrollRef } from '@app/features/Chat/ChatSection/ChatSection'
import { useKeepScrollPosition } from '@components/PartsCollection/InfiniteScroll/hooks'
import VirtualChatBox from '@components/Parts/VirtualChat'

function RoomChat() {
  // State management
  const [messageList, setMessageList] = useState<Message[]>()
  const messageListDefered = useDeferredValue(messageList)
  const [isLoadMore, setIsLoadMore] = useState(false)
  const [currentPage, setCurrentPage] = useState<{
    page: number
    totalPage: number | undefined
  }>({
    page: 1,
    totalPage: undefined,
  })
  const [typingUser, setTypingUser] = useState<TypingStatusMessage['user'][]>(
    []
  )
  const [userList, setUserList] = useState<RoomUser[]>()

  // Refs
  const isNew = useRef<boolean>(false)
  const infiniteChatScrollRef = useRef<ExposeInfiniteChatScrollRef>(null)

  // Hooks
  const { onClickSusbribeToPushNotification } = usePushNotifications()
  const { roomId } = useParams()
  const { user } = useSelector(authState)
  const { data: roomDetailData } = useGetRoomDetailQuery(roomId || '', {
    skip: !roomId,
  })

  // Derived state
  const userReadList = useMemo(() => {
    return userList?.filter((user) => user.readAt)
  }, [userList])

  const isOwner =
    user && roomDetailData && user.id === roomDetailData.data.ownerId

  // Handlers
  const handleLoadMoreMessage = useCallback(() => {
    if (!roomId) return
    if (currentPage.totalPage && currentPage.page < currentPage.totalPage) {
      setIsLoadMore(true)
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

  // Effects
  useLayoutEffect(() => {
    if (!messageListDefered && infiniteChatScrollRef.current) {
      infiniteChatScrollRef.current.scrollToBottom()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageList])

  useEffect(() => {
    if (!roomId) return
    // Initial data loading
    Promise.all([
      getRoomUserList({ roomId }),
      getMessageList({ roomId, page: 1 }),
    ]).then(([userListRes, messageListRes]) => {
      setUserList(userListRes.data.data)
      setCurrentPage({
        page: messageListRes.data.data.currentPage,
        totalPage: messageListRes.data.data.totalPages,
      })
      setMessageList(() => messageListRes.data.data.list.reverse())
    })
  }, [roomId])

  useEffect(() => {
    if (!roomId) return

    if (!socket.connected) {
      socket.connect()
    }

    const handleNewMessage = (e: SocketMessage) => {
      isNew.current = true
      setMessageList((prev) => (prev ? [...prev, e] : [e]))
    }

    const handleTypingStatus = (data: TypingStatusMessage) => {
      if (data.user.id === user?.id) return

      setTypingUser((prev) => {
        const existedUser = prev.find((u) => u.id === data.user.id)
        if (data.isTyping && !existedUser) {
          return [...prev, data.user]
        }
        if (!data.isTyping) {
          return prev.filter((u) => u.id !== data.user.id)
        }
        return prev
      })
    }

    socket.on(`${roomId}-message`, handleNewMessage)
    socket.on(`${roomId}-typing`, handleTypingStatus)

    return () => {
      socket.off(`${roomId}-message`, handleNewMessage)
      socket.off(`${roomId}-typing`, handleTypingStatus)
    }
  }, [roomId, user?.id])

  useKeepScrollPosition({
    deps: [messageList],
    container: infiniteChatScrollRef.current?.containerElement || null,
    mediaInitialHeight: 300,
  })

  useLayoutEffect(() => {
    if (isNew.current && infiniteChatScrollRef.current?.scrollToBottom) {
      infiniteChatScrollRef.current.scrollToBottom()
    }
  }, [messageList?.length])

  return (
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
              const subscription = await onClickSusbribeToPushNotification()
              if (!subscription || !roomId) return
              const key = subscription.toJSON().keys
              if (!key) return
              getPushNoti({
                roomId,
                endpoint: subscription.endpoint,
                key,
              })
            }}
          >
            <BellIcon className="size-5" />
          </button>
          {isOwner && (
            <>
              <Link to={`/room/${roomId}/setting`}>Setting</Link>
              <Link to={`/room/${roomId}/livestream`}>Livestream</Link>
            </>
          )}
        </div>
      </div>
      {/* <InfiniteChatScroll
        onLoadMoreMessage={handleLoadMoreMessage}
        disabledLoadMore={isLoadMore && !!messageList}
        ref={infiniteChatScrollRef}
      > */}
      {isLoadMore && <div>Loading...</div>}
      {/* {messageList?.map((message) => (
          <MessageCard message={message} key={message.id} />
        ))} */}
      {messageList && (
        <VirtualChatBox
          messages={messageList}
          onLoadMessage={handleLoadMoreMessage}
          isLoading={isLoadMore}
        />
      )}
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
      {/* </InfiniteChatScroll> */}
      <TypingSection typingUser={typingUser} />
      <SendMessageInput roomId={roomId || ''} user={user} />
    </div>
  )
}

export default RoomChat
