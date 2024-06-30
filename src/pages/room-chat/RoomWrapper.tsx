import { useParams } from "react-router-dom";
import RoomChat from ".";

function RoomWrapper() {
  const { roomId } = useParams();
  return <RoomChat key={roomId} />;
}

export default RoomWrapper;
