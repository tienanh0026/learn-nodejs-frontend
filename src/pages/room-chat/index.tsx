import MessageCard from "@components/Parts/MessageCard";
import { getMessageList } from "@modules/api/message-list";
import { getRoomDetail } from "@modules/api/room";
import { sendMessage } from "@modules/api/send-message";
import { socket } from "@modules/libs/socket";
import { Message } from "@modules/models/message";
import { RoomDetail } from "@modules/models/room";
import { SocketMessage } from "@modules/models/socket";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { getPushNoti } from "@modules/api/push-notification";
import usePushNotifications from "@modules/libs/service-worker/hooks";
import { useLoadMore } from "@components/PartsCollection/InfiniteScroll/hooks";

function RoomChat() {
  const [content, setContent] = useState("");
  const [messageList, setMessageList] = useState<Message[]>();
  const [roomDetail, setRoomDetail] = useState<RoomDetail>();
  const { onClickSusbribeToPushNotification } = usePushNotifications();
  const { roomId } = useParams();
  const [isLoadMore, setIsLoadMore] = useState(false);
  const topPanelId = useId();
  const topPanelRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentPage = useRef({
    page: 1,
    totalPage: 1,
  });
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!roomId || !content) return;
    try {
      await sendMessage({
        content,
        roomId,
      });
      setContent("");
    } catch {
      //
    }
  };

  const handleLoadMoreMessage = useCallback(() => {
    if (!roomId) return;
    getMessageList({ roomId, page: currentPage.current.page + 1 })
      .then((res) => {
        currentPage.current = {
          page: res.data.data.currentPage,
          totalPage: res.data.data.totalPages,
        };
        setMessageList((prevList) => {
          if (!prevList) return res.data.data.list.reverse();
          return [...res.data.data.list.reverse(), ...prevList];
        });
      })
      .finally(() => {
        setIsLoadMore(false);
      });
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    getMessageList({ roomId, page: -1 }).then((response) => {
      currentPage.current = {
        page: response.data.data.currentPage,
        totalPage: response.data.data.totalPages,
      };
      setMessageList(response.data.data.list.reverse());
    });
    getRoomDetail(roomId).then((response) => {
      setRoomDetail(response.data.data);
    });
  }, [roomId]);

  useEffect(() => {
    if (roomId && socket.active)
      socket.connect().on(`${roomId}-message`, (e: SocketMessage) => {
        console.log(e);

        setMessageList((prev) => {
          if (!prev) return [e];
          return [...prev, e];
        });
      });

    return () => {
      socket.off(`${roomId}-message`);
    };
  }, [roomId]);

  useLoadMore({
    loadMoreElement: topPanelRef.current,
    onLoadMore: handleLoadMoreMessage,
    skip: isLoadMore,
    observerOption: {
      root: containerRef.current,
      threshold: 1,
      rootMargin: "0px",
    },
  });

  return (
    <>
      <div className='size-full flex flex-col'>
        <div className='w-full p-2 px-4 border-b border-gray-300 flex justify-between gap-2'>
          <div className='flex gap-2 items-center'>
            <Link to={"/room-list"} className='hover:underline p-1'>
              <ChevronLeftIcon className='size-5' />
            </Link>
            <h2 className='font-semibold'>{roomDetail?.name}</h2>
          </div>
          <button
            type='button'
            onClick={async () => {
              const subscription =
                await onClickSusbribeToPushNotification().then();
              if (!subscription || !roomId) return;
              const key = subscription.toJSON().keys;
              if (!key) return;
              getPushNoti({
                roomId: roomId,
                endpoint: subscription.endpoint,
                key: key,
              });
              // serviceWorker.getUserSubscription().then((value) => {
              //   if (!value || !roomId) return;
              //   const key = value.toJSON().keys;
              //   if (!key) return;
              //   getPushNoti({
              //     roomId: roomId,
              //     endpoint: value.endpoint,
              //     key: key,
              //   });
              // });
            }}
          >
            noti
          </button>
        </div>
        {/* {messageList && (
          <InfiniteScrollWrapper
            data={messageList}
            onLoadMore={() => {
              handleLoadMoreMessage();
            }}
            isLoadMore={isLoadMore}
          >
            {messageList.map((message) => (
              <MessageCard message={message} key={message.id} />
            ))}
          </InfiniteScrollWrapper>
        )} */}
        <div
          className='flex-1 flex flex-col gap-2 p-4 overflow-auto'
          ref={containerRef}
        >
          <div className='flex flex-col gap-2'>
            <div id={topPanelId} ref={topPanelRef}></div>
            {messageList &&
              messageList.map((message) => (
                <MessageCard message={message} key={message.id} />
              ))}
          </div>
        </div>
        <form className='flex gap-2 p-4' onSubmit={handleSendMessage}>
          <input
            placeholder='Enter message'
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            className='flex-1 focus:outline-none focus:ring-1 focus:ring-gray-600 rounded-md p-2 border border-gray-500'
          />
          <button className='p-2 bg-blue-600 font-medium text-white rounded-md border border-black'>
            Send
          </button>
        </form>
      </div>
    </>
  );
}

export default RoomChat;
