import { Message } from '@modules/models/message'
import { authState } from '@modules/redux/AuthSlice/AuthSlice'
import clsx from 'clsx'
import { memo } from 'react'
import { useSelector } from 'react-redux'

function MessageCard({ message }: { message: Message }) {
  const { user } = useSelector(authState)
  const isImage = message.media?.includes('/image')
  const isUserMessage = user?.id === message.ownerId
  return (
    <div className={clsx('min-w-0', isUserMessage && 'max-w-full w-full')}>
      {!isUserMessage && (
        <p className="text-gray-600 text-sm font-medium">
          {message.owner.name}
        </p>
      )}
      <div
        className={clsx(
          'font-medium p-3 rounded-lg text-start w-fit max-w-[70%]',
          isUserMessage ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-200',
          message.media ? 'w-full' : 'w-fit'
        )}
      >
        <p className="text-wrap break-words">{message.content}</p>
        {message.media && (
          <div className="mt-3 flex justify-center">
            {isImage ? (
              <img
                src={import.meta.env.VITE_BASE_URL + message.media}
                data-loaded="false"
                onLoad={(event) => {
                  event.currentTarget.setAttribute('data-loaded', 'true')
                }}
                className="max-w-[600px] max-h-[300px] w-full data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-200 data-[loaded=false]:h-[300px] data-[loaded=false]:w-full object-contain"
              />
            ) : (
              <video
                controls
                src={import.meta.env.VITE_BASE_URL + message.media}
                className="max-w-[600px] max-h-[300px] h-full w-full data-[loaded=false]:bg-gray-200 data-[loaded=false]:h-[300px]"
                data-loaded="false"
                onLoadedData={(event) => {
                  event.currentTarget.setAttribute('data-loaded', 'true')
                }}
                onError={(event) => {
                  event.currentTarget.setAttribute('data-errored', 'true')
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(MessageCard)
