import { useNavigate } from 'react-router-dom'
import { useForgetPasswordAuthContext } from '../provider'
import { useEffect, useState } from 'react'
import PasscodeInput from '@components/BaseComponent/PasscodeInput'
import { verifyOtp } from '@modules/api/forget-password'

function VerifyOtpPage() {
  const { email, setResetToken } = useForgetPasswordAuthContext()

  const [otp, setOtp] = useState('')

  const navigate = useNavigate()
  useEffect(() => {
    if (!email) navigate('/forget-password', { replace: true })
  }, [email, navigate])
  if (!email) {
    return null
  }

  const handlePasscodeChange = (otp: string) => {
    setOtp(otp)
  }

  const handleOtpSubmit = async () => {
    try {
      const { data } = await verifyOtp({
        email: email,
        otp,
      })
      setResetToken(data.data.accessToken)
      navigate('/change-password')
    } catch (error) {
      //
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <h1 className="text-center font-bold text-2xl">VERIFY OTP</h1>
      <PasscodeInput onPasscodeChange={handlePasscodeChange} />
      <button
        type="button"
        className="p-2 py-1 font-bold bg-blue-400 w-fit rounded-md mx-auto"
        onClick={handleOtpSubmit}
      >
        Submit
      </button>
    </div>
  )
}

export default VerifyOtpPage
