import { Message } from "@modules/models/message";
import { authState } from "@modules/redux/AuthSlice/AuthSlice";
import { useSelector } from "react-redux";

function MessageCard({ message }: { message: Message }) {
  const { user } = useSelector(authState);
  if (user?.id === message.ownerId)
    return (
      <div className="flex w-full justify-end">
        <div className="bg-blue-500 text-white font-medium p-3 rounded-lg text-end w-fit max-w-70">
          {message.content}
        </div>
      </div>
    );
  return (
    <div className="w-full flex justify-start">
      <div className="bg-gray-200 font-medium p-3 rounded-lg text-start max-w-70 w-fit">
        {message.content}
      </div>
    </div>
  );
}

export default MessageCard;
