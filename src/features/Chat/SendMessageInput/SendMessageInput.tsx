import Select from '@components/BaseComponent/Select'
import {
  PaperClipIcon,
  ChevronDownIcon,
  FilmIcon,
} from '@heroicons/react/24/solid'
import { scheduleMessage, useSendMessage } from '@modules/api/send-message'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import ScheduleMessageModal from '../ScheduleMessageModal/ScheduleMessageModal'
import { usePreviewMediaFile } from '@modules/funcs/hooks'
import { socket } from '@modules/libs/socket'
import { User } from '@modules/models/user'

function SendMessageInput({
  roomId,
  user,
}: {
  roomId: string
  user: User | null
}) {
  const [content, setContent] = useState('')
  const [file, setFile] = useState<File>()
  const { previewFile, setPreviewFile } = usePreviewMediaFile(file)
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files) {
      setFile(e.target.files[0])
      e.target.value = ''
    }
  }

  const { execute, isLoading } = useSendMessage(roomId || '', {
    content: content,
    file: file,
  })

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!roomId) return
    if (!content && !file) return
    try {
      await execute()
      setContent('')
      setFile(undefined)
    } catch {
      //
    }
  }

  const inputFileRef = useRef<HTMLInputElement>(null)

  const [openScheduleModal, setOpenScheduleModal] = useState(false)
  const handleSubmitScheduleMessage = async (value: Date) => {
    if (!roomId) return
    if (!content && !file) return
    try {
      await scheduleMessage({
        roomId,
        message: {
          content,
          file,
        },
        time: value,
      })
      setContent('')
      setFile(undefined)
      setOpenScheduleModal(false)
    } catch {
      //
    }
  }

  const isTyping = useRef<boolean>(false)

  useEffect(() => {
    if (!user || !roomId) return
    if (!isTyping.current && content) {
      isTyping.current = true
      socket.emit('on-typing-message', {
        user,
        roomId: roomId,
      })
    }
    const typingTimeout = setTimeout(() => {
      isTyping.current = false
      socket.emit('on-stop-typing-message', {
        user,
        roomId: roomId,
      })
    }, 3000)
    return () => clearTimeout(typingTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content])

  return (
    <>
      <ScheduleMessageModal
        isOpen={openScheduleModal}
        onClose={() => setOpenScheduleModal(false)}
        onSubmitScheduleMessage={handleSubmitScheduleMessage}
        key={`${openScheduleModal}`}
      />
      <div className="flex flex-col p-4">
        <form className="flex gap-2" onSubmit={handleSendMessage}>
          <input
            placeholder="Enter message"
            value={content}
            onChange={(e) => {
              setContent(e.target.value)
            }}
            className="flex-1 focus:outline-none focus:ring-1 focus:ring-gray-600 rounded-md p-2 border border-gray-500"
          />
          <button
            type="button"
            className="bg-gray-200 p-2 border border-black rounded-md hover:opacity-60"
            onClick={() => {
              inputFileRef.current?.click()
            }}
          >
            <PaperClipIcon className="size-5" />
          </button>
          <div className="flex rounded-md border border-black overflow-hidden">
            <button
              disabled={(!content && !file) || isLoading}
              className="p-2 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-black bg-blue-600 font-medium text-white border-r border-black flex gap-1 items-center"
            >
              Send
              {isLoading && (
                <svg
                  className="animate-spin size-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
            </button>
            <Select
              selectValue={undefined}
              onSelect={(value) => {
                if (value === 'schedule-message') setOpenScheduleModal(true)
              }}
              disabled={!content && !file}
            >
              <Select.Trigger
                wrapperClass="border-none px-1 bg-blue-600 rounded-none disabled:bg-gray-200 disabled:cursor-not-allowed"
                renderIcon={
                  <ChevronDownIcon
                    className={clsx('size-4')}
                    color={!content && !file ? 'black' : 'white'}
                  />
                }
              ></Select.Trigger>
              <Select.Content align="right">
                <Select.Item value={'schedule-message'}>
                  Schedule Message
                </Select.Item>
              </Select.Content>
            </Select>
          </div>
          <input
            type="file"
            className="hidden"
            multiple={false}
            ref={inputFileRef}
            onChange={handleChangeFile}
          />
        </form>
        {previewFile && (
          <div className="h-32 mt-2 p-2 w-fit flex items-center justify-center gap-1 flex-col group relative border border-gray-300 rounded-md">
            <button
              type="button"
              onClick={() => {
                setFile(undefined)
                setPreviewFile(undefined)
              }}
              className="absolute -top-[2px] -right-[2px] bg-slate-400 text-white font-semibold p-1 size-5  items-center justify-center rounded-full hidden group-hover:flex"
            >
              x
            </button>
            {previewFile.type === 'image' ? (
              <img
                src={previewFile.data}
                className="max-w-40 h-full object-contain"
              />
            ) : (
              <FilmIcon className="h-full flex-1 w-fit" />
            )}
            <p className="text-sm pt-1/2 text-gray-600 truncate text-medium shrink-0 max-w-24">
              {file?.name}
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default SendMessageInput
