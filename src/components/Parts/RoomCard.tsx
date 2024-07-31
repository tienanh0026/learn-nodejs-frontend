import { Room } from '@modules/models/room'
import { Link } from 'react-router-dom'

function RoomCard({ room, onClick }: { room: Room; onClick?: () => void }) {
  return (
    <Link
      to={`/room/${room.id}`}
      onClick={onClick}
      className="bg-gray-50 w-full p-2 rounded-md shadow-[rgba(0,0,0,0.05)_0px_6px_24px_0px_rgba(0,0,0,0.08)_0px_0px_0px_1px] border border-black flex gap-2 items-center dark:bg-gray-900"
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
