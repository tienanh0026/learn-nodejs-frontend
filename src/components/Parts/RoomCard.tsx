import { Room } from '@modules/models/room'
import { Link } from 'react-router-dom'

function RoomCard({ room }: { room: Room }) {
  return (
    <Link
      to={`/room/${room.id}`}
      className="bg-gray-50 w-full block p-2 rounded-md shadow-[rgba(0,0,0,0.05)_0px_6px_24px_0px_rgba(0,0,0,0.08)_0px_0px_0px_1px] border border-black"
    >
      {room.image && <img src={room.image} className="inline mr-2 h-full" />}
      <span>{room.name}</span>
    </Link>
  )
}

export default RoomCard
