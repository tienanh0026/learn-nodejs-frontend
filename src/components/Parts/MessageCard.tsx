import { Message } from '@modules/models/message'
import { authState } from '@modules/redux/AuthSlice/AuthSlice'
import { useSelector } from 'react-redux'

function MessageCard({ message }: { message: Message }) {
  const { user } = useSelector(authState)
  const isImage = message.media?.includes('/image')
  if (user?.id === message.ownerId)
    return (
      <div className="flex justify-end max-w-full">
        <div className="bg-blue-500 text-white font-medium p-3 rounded-lg text-end max-w-70 text-wrap">
          {message.content}
        </div>
      </div>
    )
  return (
    <div>
      <p className="text-gray-600 text-sm font-medium">{message.owner.name}</p>
      <div className="w-full flex justify-start">
        <div className="bg-gray-200 font-medium p-3 rounded-lg text-start max-w-70 w-fit">
          <p className="text-wrap">{message.content}</p>
          {message.media && (
            <div className="mt-3">
              {isImage ? (
                <img
                  src={import.meta.env.VITE_BASE_URL + message.media}
                  className="max-w-[600px] max-h-[600px] w-full"
                />
              ) : (
                <video
                  src={import.meta.env.VITE_BASE_URL + message.media}
                  className="max-w-[600px] max-h-[600px] w-full"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageCard
