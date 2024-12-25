import { TypingStatusMessage } from '@modules/models/socket'

function TypingSection({
  typingUser,
}: {
  typingUser: TypingStatusMessage['user'][]
}) {
  if (typingUser.length === 0) return null
  return (
    <div className="flex items-center sticky bottom-0 bg-white">
      {typingUser.length === 1 ? (
        <p key={typingUser[0].id + '-typing'}>{typingUser[0].name} is Typing</p>
      ) : (
        <p> Several people are typing</p>
      )}
      <span className="bg-gray-300 rounded-2xl flex items-center w-fit px-2 py-3 gap-2 h-full ml-2">
        <span className="size-[5px] rounded-full bg-black overflow-hidden animate-[fly-around_800ms_linear_infinite]"></span>
        <span className="size-[5px] rounded-full bg-black overflow-hidden animate-[fly-around_800ms_linear_infinite_200ms]"></span>
        <span className="size-[5px] rounded-full bg-black overflow-hidden animate-[fly-around_800ms_linear_infinite_400ms]"></span>
      </span>
    </div>
  )
}

export default TypingSection
