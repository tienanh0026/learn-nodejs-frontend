import RoomCard from "@components/Parts/RoomCard";
import { getRoomList } from "@modules/api/room-list";
import { Room } from "@modules/models/room";
import { useEffect, useState } from "react";

function RoomListPage() {
  const [roomList, setRoomList] = useState<Room[]>();
  useEffect(() => {
    const fetchRoomList = async () => {
      const response = await getRoomList();
      setRoomList(response.data.data);
    };
    fetchRoomList();
  }, []);
  return (
    <>
      Room list
      <p>{roomList?.length}</p>
      <div className='w-full'>
        {roomList &&
          roomList.map((room) => <RoomCard room={room} key={room.id} />)}
      </div>
    </>
  );
}

export default RoomListPage;
