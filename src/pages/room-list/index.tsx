import { ChevronLeftIcon, PhotoIcon } from '@heroicons/react/24/solid'
import { createRoom } from '@modules/api/room'
import usePreviewMediaFile from '@modules/funcs/hooks'
import { ChangeEvent, useId, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const CREATE_PARAM_KEY = 'create'

function RoomListPage() {
  const [searchParams] = useSearchParams()
  const [isCreating, setIsCreating] = useState(
    !!searchParams.get(CREATE_PARAM_KEY)
  )
  const nameId = useId()

  const [name, setName] = useState('')
  const [file, setFile] = useState<File>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCreateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', name)
    if (file) formData.append('file', file)

    await createRoom({ formData })
    setName('')
    setPreviewFile(undefined)
  }

  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const { previewFile, setPreviewFile } = usePreviewMediaFile(file)

  return (
    <div className="p-4 size-full">
      {isCreating ? (
        <>
          <div className="w-full gap-2 relative p-1">
            <Link
              to={''}
              className="hover:underline p-1 absolute left-0"
              onClick={() => setIsCreating(false)}
            >
              <ChevronLeftIcon className="size-5" />
            </Link>
            <div className="flex-1 text-center font-semibold">
              Create a new room
            </div>
          </div>
          <form className="max-w-72 mx-auto h-full" onSubmit={handleCreateRoom}>
            <label htmlFor={nameId} className="flex flex-col gap-2 mt-4">
              <p className="font-bold">Name</p>
              <input
                className="p-2 rounded-md py-1 border border-black"
                id={nameId}
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
              />
            </label>
            <div className="max-w-[400px] max-h-[400px] mx-auto border border-black rounded-md mt-5 overflow-hidden">
              {previewFile?.data ? (
                <img
                  src={previewFile.data}
                  className="size-full object-contain"
                />
              ) : (
                <PhotoIcon />
              )}
            </div>
            <div className="mx-auto w-fit">
              <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                multiple={false}
                accept="image/*"
                onChange={handleSelectFile}
              />
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
            <div className="w-full flex items-center mt-6">
              <button className="p-2 bg-blue-600 rounded-md text-white mx-auto">
                Create Room
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="size-full flex justify-center items-center font-semibold text-xl">
          <Link
            to={`?${CREATE_PARAM_KEY}=true`}
            onClick={() => {
              setIsCreating(true)
            }}
          >
            Create a new room
          </Link>
        </div>
      )}
    </div>
  )
}

export default RoomListPage
