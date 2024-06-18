import MessageCard from "@components/Parts/MessageCard";
import { getMessageList } from "@modules/api/message-list";
import { sendMessage } from "@modules/api/send-message";
import { socket } from "@modules/libs/socket";
import { Message } from "@modules/models/message";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function RoomChat() {
  const [content, setContent] = useState("");
  const [messageList, setMessageList] = useState<Message[]>();

  const { roomId } = useParams();
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!roomId) return;
    e.preventDefault();
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
  }, [roomId]);

  useEffect(() => {
    socket.on("connection", (e) => {
      console.log(e);
    });
  }, [roomId]);
  return (
    <div className="size-full flex flex-col p-4">
      <div className="flex-1 flex flex-col gap-2">
        {messageList &&
          messageList.map((message) => (
            <MessageCard message={message} key={message.id} />
          ))}
      </div>
      <form className="flex gap-2" onSubmit={handleSendMessage}>
        <input
          placeholder="Enter message"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
          className="flex-1 focus:outline-none focus:ring-1 focus:ring-gray-600 rounded-md p-2 border border-gray-500"
        />
        <button className="p-2 bg-blue-600 font-medium text-white rounded-md border border-black">
          Send
        </button>
      </form>
    </div>
  );
}

export default RoomChat;
