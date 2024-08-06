import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import { PhotoIcon } from '@heroicons/react/24/solid'
import { getRoomDetail, updateRoom } from '@modules/api/room'
import { usePreviewMediaFile } from '@modules/funcs/hooks'
import { RoomDetail } from '@modules/models/room'
import { authState } from '@modules/redux/AuthSlice/AuthSlice'
import { ChangeEvent, useEffect, useId, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'

function RoomSettingPage() {
  const { roomId } = useParams()
  const [roomDetail, setRoomDetail] = useState<RoomDetail>()
  const [file, setFile] = useState<File>()
  const [roomName, setRoomName] = useState<string>('')
  const roomNameInput = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { user } = useSelector(authState)

  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSaveFile = async () => {
    if (!roomId) return
    try {
      const formData = new FormData()
      formData.append('name', roomName)
      if (file) formData.append('file', file)
      await updateRoom({ roomId, formData })
    } catch (error) {
      //
    }
  }

  useEffect(() => {
    if (!roomDetail || !user || !roomId) return
    if (user.id !== roomDetail.ownerId) navigate(`/room/${roomId}`)
  }, [navigate, roomDetail, roomId, user])

  useEffect(() => {
    if (!roomId) return
    getRoomDetail(roomId).then((res) => {
      setRoomDetail(res.data.data)
      setRoomName(res.data.data.name)
    })
  }, [roomId])

  const { previewFile, setPreviewFile } = usePreviewMediaFile(file)

  return (
    <>
      <div className="w-full p-2 px-4 border-b border-gray-300 flex justify-between gap-2">
        <div className="flex gap-2 items-center">
          <Link to={`/room/${roomId}`} className="hover:underline p-1">
            <ChevronLeftIcon className="size-5" />
          </Link>
          <h2 className="font-semibold">{roomDetail?.name}</h2>
        </div>
        <button
          type="button"
          className="hover:opacity-50 font-semibold"
          onClick={handleSaveFile}
        >
          Save
        </button>
      </div>
      <div className="p-5">
        <div className="w-fit mx-auto mt-3">
          <label htmlFor={roomNameInput} className="font-semibold">
            Room name
          </label>
          <input
            className="p-2 rounded-md py-1 border border-black ml-3 dark:bg-slate-400"
            id={roomNameInput}
            name="email"
            value={roomName}
            onChange={(e) => {
              setRoomName(e.target.value)
            }}
          />
        </div>
        <div className="max-w-[400px] max-h-[400px] mx-auto border border-black rounded-md mt-5 aspect-square overflow-hidden">
          {previewFile?.data ? (
            <img src={previewFile.data} className="size-full object-contain" />
          ) : (
            <>
              {roomDetail?.image ? (
                <img
                  src={import.meta.env.VITE_BASE_URL + roomDetail?.image}
                  className="size-full"
                />
              ) : (
                <PhotoIcon />
              )}
            </>
          )}
        </div>
        <div className="mx-auto w-fit">
          <button
            onClick={() => {
              fileInputRef.current?.click()
            }}
            type="button"
            className="p-2 font-semibold border border-black rounded-md mt-5"
          >
            Upload image
          </button>
          <button
            className="text-blue-600 underline ml-4"
            onClick={() => {
              setFile(undefined)
              setPreviewFile(undefined)
            }}
          >
            Remove image
          </button>
        </div>
        <input
          ref={fileInputRef}
          className="hidden"
          type="file"
          multiple={false}
          accept="image/*"
          onChange={handleSelectFile}
        />
      </div>
    </>
  )
}

export default RoomSettingPage
