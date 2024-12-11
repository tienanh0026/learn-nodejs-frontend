import BaseModal from '@components/Parts/BaseModal'
import RoomCard from '@components/Parts/RoomCard'
import { Bars3Icon } from '@heroicons/react/24/solid'
import { getRoomList } from '@modules/api/room-list'
import { socket } from '@modules/libs/socket'
import { Room, RoomDetail } from '@modules/models/room'
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
function RoomLayout() {
  const [roomList, setRoomList] = useState<Room[]>()
  const [openRoomList, setOpenRoomList] = useState(false)

  useEffect(() => {
    const fetchRoomList = async () => {
      const response = await getRoomList()
      setRoomList(response.data.data)
    }
    fetchRoomList()
    socket.on('room-list', (e: RoomDetail) => {
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
      <BaseModal
        wrapperClass="hidden max-md:block"
        openAnimationName="modal-slide-in"
        animationDuration={650}
        closeAnimationName="modal-slide-out"
        bodyClass="h-full rounded-s-none left-0 ml-0 !bg-gray-200 dark:!bg-gray-600"
        isOpen={openRoomList}
        onClose={() => {
          setOpenRoomList(false)
        }}
      >
        <button
          type="button"
          onClick={() => {
            setOpenRoomList(!openRoomList)
          }}
        >
          <Bars3Icon className="size-6" />
        </button>
        <div className="flex flex-col gap-2 h-full overflow-auto ">
          {roomList &&
            roomList.map((room) => (
              <RoomCard
                room={room}
                key={room.id}
                onClick={() => setOpenRoomList(false)}
              />
            ))}
        </div>
      </BaseModal>
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => {
            setOpenRoomList(!openRoomList)
          }}
        >
          <Bars3Icon className="size-6" />
        </button>
      </div>
      <div className="w-[30%] flex flex-col gap-2 h-full overflow-auto max-md:hidden px-2">
        {roomList &&
          roomList.map((room) => <RoomCard room={room} key={room.id} />)}
      </div>
      <div className="w-[70%] bg-white dark:bg-gray-500 rounded-md shadow-[rgba(0,0,0,0.05)_0px_6px_24px_0px_rgba(0,0,0,0.08)_0px_0px_0px_1px] max-md:flex-1 max-md:w-full max-md:max-h-full">
        <Outlet />
      </div>
    </div>
  )
}

export default RoomLayout
