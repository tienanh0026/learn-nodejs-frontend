import { changePassword } from '@modules/api/forget-password'
import { useForgetPasswordAuthContext } from '@pages/forget-password/provider'
import { useEffect, useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ChangePasswordPage() {
  const { email, resetToken, setEmail, setResetToken } =
    useForgetPasswordAuthContext()
  const navigate = useNavigate()
  const passwordId = useId()
  const [password, setPassword] = useState('')
  useEffect(() => {
    if (!email || !resetToken) {
      navigate('/forget-password/verify', { replace: true })
    }
  }, [email, navigate, resetToken])
  if (!email || !resetToken) {
    return null
  }

  const handlePasswordChange = async () => {
    try {
      await changePassword(password, resetToken)
      setEmail('')
      setResetToken('')
      navigate('/login')
    } catch (error) {
      //
    }
  }
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6  mx-auto">
      <h1 className="text-center font-bold text-2xl">CHANGE PASSWORD OTP</h1>
      <label htmlFor={passwordId} className="w-full  max-w-72">
        <p className="font-bold">Password</p>
        <input
          className="p-2 rounded-md py-1 w-full"
          id={passwordId}
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
      </label>
      <button
        type="button"
        className="p-2 py-1 font-bold bg-blue-400 w-fit rounded-md mx-auto"
        onClick={handlePasswordChange}
      >
        Submit
      </button>
    </div>
  )
}
