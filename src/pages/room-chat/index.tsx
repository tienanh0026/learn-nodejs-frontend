import MessageCard from "@components/Parts/MessageCard";
import { getMessageList } from "@modules/api/message-list";
import { getRoomDetail } from "@modules/api/room";
import { sendMessage } from "@modules/api/send-message";
import { socket } from "@modules/libs/socket";
import { Message } from "@modules/models/message";
import { RoomDetail } from "@modules/models/room";
import { SocketMessage } from "@modules/models/socket";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

function RoomChat() {
  const [content, setContent] = useState("");
  const [messageList, setMessageList] = useState<Message[]>();
  const [roomDetail, setRoomDetail] = useState<RoomDetail>();

  const { roomId } = useParams();
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
  useEffect(() => {
    if (!roomId) return;
    getMessageList(roomId).then((response) => {
      setMessageList(response.data.data);
    });
    getRoomDetail(roomId).then((response) => {
      setRoomDetail(response.data.data);
    });
  }, [roomId]);

  useEffect(() => {
    if (roomId)
      socket.on(`${roomId}-message`, (e: SocketMessage) => {
        setMessageList((prev) => {
          if (!prev) return [e];
          return [...prev, e];
        });
      });
    return () => {
      socket.off(`${roomId}-message`);
    };
  }, [roomId]);

  return (
    <>
      <div className='size-full flex flex-col'>
        <div className='w-full p-2 px-4 border-b border-gray-300 flex items-center gap-2'>
          <Link to={"/room-list"} className='hover:underline p-1'>
            <ChevronLeftIcon className='size-5' />
          </Link>
          <h2 className='font-semibold'>{roomDetail?.name}</h2>
        </div>
        <div className='flex-1 flex flex-col gap-2 p-4'>
          {messageList &&
            messageList.map((message) => (
              <MessageCard message={message} key={message.id} />
            ))}
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
