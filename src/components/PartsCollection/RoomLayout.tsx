import RoomCard from '@components/Parts/RoomCard'
import { getRoomList } from '@modules/api/room-list'
import { socket } from '@modules/libs/socket'
import { Room, RoomDetail } from '@modules/models/room'
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'

function RoomLayout() {
  const [roomList, setRoomList] = useState<Room[]>()
  useEffect(() => {
    const fetchRoomList = async () => {
      const response = await getRoomList()
      setRoomList(response.data.data)
    }
    fetchRoomList()
    socket.connect().on('room-list', (e: RoomDetail) => {
      console.log(e)
      setRoomList((prev) => {
        const roomList = prev ? [...prev] : []
        if (!prev) return [e]
        const existedIndex = roomList.findIndex((room) => room.id === e.id)
        if (existedIndex !== -1) {
          roomList.splice(existedIndex, 1, e)
          return roomList
        }
        return [...roomList, e]
      })
    })

    return () => {
      socket.off('room-list')
    }
  }, [])

  return (
    <div className="flex h-full gap-4">
      <div className="w-[30%] flex flex-col gap-2 h-full overflow-auto">
        {roomList &&
          roomList.map((room) => <RoomCard room={room} key={room.id} />)}
      </div>
      <div className="w-[70%] bg-white rounded-md shadow-[rgba(0,0,0,0.05)_0px_6px_24px_0px_rgba(0,0,0,0.08)_0px_0px_0px_1px]">
        <Outlet />
      </div>
    </div>
  )
}

export default RoomLayout
