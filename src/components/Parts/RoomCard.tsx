import { Room } from '@modules/models/room'
import { Link } from 'react-router-dom'

function RoomCard({ room }: { room: Room }) {
  return (
    <Link
      to={`/room/${room.id}`}
      className="bg-gray-50 w-full p-2 rounded-md shadow-[rgba(0,0,0,0.05)_0px_6px_24px_0px_rgba(0,0,0,0.08)_0px_0px_0px_1px] border border-black flex gap-2 items-center"
    >
      {room.image && (
        <img
          src={import.meta.env.VITE_BASE_URL + room.image}
          className="size-6"
        />
      )}
      <span className="truncate">{room.name}</span>
    </Link>
  )
}

export default RoomCard
