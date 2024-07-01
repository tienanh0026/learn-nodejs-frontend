import { register } from '@modules/api/register'
import { ErrorResponse } from '@modules/libs/axios/types'
import axios from 'axios'
import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
  const [mail, setMail] = useState('')
  const [name, setName] = useState('')

  const [password, setPassword] = useState('')
  const mailId = useId()
  const passwordId = useId()
  const nameId = useId()

  const navigate = useNavigate()
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true)
      e.preventDefault()
      await register({
        email: mail,
        password,
        name,
      })
      navigate('/login')
    } catch (error) {
      if (axios.isAxiosError<ErrorResponse>(error)) {
        setError(error.response?.data.message)
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex items-center justify-center h-full gap-8">
      <form
        className="flex flex-col gap-2 items-center"
        onSubmit={handleSubmit}
      >
        <h1 className="font-bold text-center text-2xl">REGISTER PAGE</h1>
        <label htmlFor={mailId} className="flex flex-col gap-2 mt-4">
          <p className="font-bold">Email</p>
          <input
            className="p-2 rounded-md py-1"
            id={mailId}
            name="email"
            value={mail}
            onChange={(e) => {
              setMail(e.target.value)
            }}
          />
        </label>
        <label htmlFor={nameId} className="flex flex-col gap-2">
          <p className="font-bold">Name</p>
          <input
            className="p-2 rounded-md py-1"
            id={nameId}
            name="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
            }}
          />
        </label>
        <label htmlFor={passwordId}>
          <p className="font-bold">Password</p>
          <input
            className="p-2 rounded-md py-1"
            id={passwordId}
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
        </label>
        {error && <p className="text-red-400 font-medium">{error}</p>}
        <button
          disabled={loading}
          className="mt-4 p-2 py-1 font-bold bg-blue-400 w-fit rounded-md"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default RegisterPage
