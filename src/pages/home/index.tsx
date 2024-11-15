import { authState, clearAuthState } from '@modules/redux/AuthSlice/AuthSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useLocalStorage } from '@modules/funcs/hooks'
import Select from '@components/BaseComponent/Select'

function HomePage() {
  const { user } = useSelector(authState)
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(clearAuthState())
    Cookies.set('access-token', '')
    Cookies.set('refresh-token', '')
  }
  const [isCheck, setIsCheck] = useState(false)
  const themeValue = useLocalStorage(isCheck ? 'theme' : 'token')

  const [selectValue, setSelectValue] = useState<string | number | undefined>(
    undefined
  )

  const selectArray = [
    {
      title: 'select 1',
      value: 1,
    },
    {
      title: 'select 2',
      value: 2,
    },
  ]

  const selectTitle = selectArray.find(
    (selectItem) => selectItem.value === selectValue
  )

  const handleSelect = (select: number | string | undefined) => {
    setSelectValue(select)
  }
  return (
    <div className="size-full flex flex-col">
      {themeValue}
      <label>
        test
        <input
          type="checkbox"
          checked={isCheck}
          onChange={(e) => {
            setIsCheck(e.target.checked)
          }}
        />
      </label>
      {user ? (
        <>
          <div className="w-full flex justify-end">
            <button
              onClick={handleLogout}
              className="p-2 px-3 rounded-md bg-blue-500 text-white font-medium"
            >
              Logout
            </button>
          </div>
          <p>
            Hi, <span className="font-medium text-orange-400">{user.name}</span>
          </p>
          <div className="h-full flex justify-center items-center mx-8">
            <Link
              to="/room-list"
              className="bg-blue-500 text-white rounded-md p-2 w-full text-center max-w-72"
            >
              Room List
            </Link>
          </div>
        </>
      ) : (
        <>
          <p>
            You're not logging in,&nbsp;
            <Link to={'/login'} className="underline">
              click here
            </Link>
            &nbsp;to log in
          </p>
        </>
      )}
      <Select onSelect={handleSelect} selectValue={selectValue}>
        <Select.Trigger>
          {selectValue ? selectTitle?.title : 'Please select'}
        </Select.Trigger>
        <Select.Content wrapperClass="min-w-[100px]">
          <Select.Item value={undefined}>No value</Select.Item>
          {selectArray.map((selectItem) => (
            <Select.Item value={selectItem.value} key={selectItem.value}>
              {selectItem.title}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  )
}

export default HomePage
