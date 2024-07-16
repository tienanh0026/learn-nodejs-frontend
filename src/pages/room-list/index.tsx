import AccordionList from '@components/Parts/AccordionList'
import { ChevronLeftIcon, PhotoIcon } from '@heroicons/react/24/solid'
import { createRoom } from '@modules/api/room'
import { getUserList } from '@modules/api/user-list'
import usePreviewMediaFile from '@modules/funcs/hooks'
import { User } from '@modules/models/user'
import { authState } from '@modules/redux/AuthSlice/AuthSlice'
import { ChangeEvent, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'

const CREATE_PARAM_KEY = 'create'

type UserInviteList = {
  user: User
  role: string
  isInvited: boolean
}

function RoomListPage() {
  const [searchParams] = useSearchParams()
  const [isCreating, setIsCreating] = useState(
    !!searchParams.get(CREATE_PARAM_KEY)
  )
  const nameId = useId()
  const [userList, setUserList] = useState<UserInviteList[]>()
  const [name, setName] = useState('')
  const [file, setFile] = useState<File>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user: currentUser } = useSelector(authState)
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

  const filteredUserList = useMemo(() => {
    if (!userList) return undefined
    return userList.filter((user) => user.user.id !== currentUser?.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userList?.length])

  useEffect(() => {
    getUserList().then((res) => {
      const formatInviteList = res.data.data.map((item) => ({
        user: item,
        role: 'user',
        isInvited: false,
      }))
      setUserList(
        formatInviteList.filter((user) => user.user.id !== currentUser?.id)
      )
    })
  }, [])

  const handleAddUser = (isChecked: boolean, user: User) => {
    setUserList((prevList) => {
      const index = prevList?.findIndex((item) => item.user.id === user.id)
      if (index && index !== -1)
        prevList?.splice(index, 1, {
          ...prevList[index],
          isInvited: isChecked,
        })
      return prevList
    })
  }
  const handleChangeRole = (role: string, user: User) => {
    setUserList((prevList) => {
      const index = prevList?.findIndex((item) => item.user.id === user.id)
      if (index && index !== -1)
        prevList?.splice(index, 1, {
          ...prevList[index],
          role,
        })
      return prevList
    })
  }
  console.log(userList)

  return (
    <div className="size-full overflow-auto">
      {isCreating ? (
        <>
          <div className="w-full gap-2 sticky top-0 bg-white p-4 shadow-[rgba(0,0,0,0.24)_0px_1px_1px]">
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
          <form className="max-w-80 p-4 mx-auto" onSubmit={handleCreateRoom}>
            <label htmlFor={nameId} className="flex flex-col gap-2">
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

            {filteredUserList && (
              <AccordionList
                list={filteredUserList}
                title="User list"
                renderItem={(user) => (
                  <div className="flex items-center justify-between gap-2">
                    <label className="flex gap-2" key={user.user.id}>
                      <input
                        value={user.user.id}
                        checked={user.isInvited}
                        type="checkbox"
                        onChange={(e) => {
                          console.log(e)
                          handleAddUser(e.target.checked, user.user)
                        }}
                      />
                      <span className="cursor-pointer">{user.user.name}</span>
                    </label>
                    <label htmlFor={user.user.id + 'option'}>
                      Role
                      <select
                        id={user.user.id + 'option'}
                        defaultValue={'user'}
                        value={user.role}
                        className="border border-black rounded-md p-1 ml-2"
                        onChange={(e) => {
                          handleChangeRole(e.target.value, user.user)
                        }}
                      >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                      </select>
                    </label>
                  </div>
                )}
              />
            )}
            <button className="block mt-4 p-2 bg-blue-600 rounded-md text-white mx-auto">
              Create Room
            </button>
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
