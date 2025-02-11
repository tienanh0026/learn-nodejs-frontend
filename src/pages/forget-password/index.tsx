import { forgetPassword } from '@modules/api/forget-password'
import { FormEventHandler, useId, useState } from 'react'
import { useForgetPasswordAuthContext } from './provider'
import { useNavigate } from 'react-router-dom'

function ForgetPasswordPage() {
  const [email, setEmail] = useState('')
  const id = useId()
  const { setEmail: setContextEmail } = useForgetPasswordAuthContext()
  const navigate = useNavigate()
  const handleSubmitEmail: FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault()
      await forgetPassword({
        email,
      })
      setContextEmail(email)
      navigate('/forget-password/verify')
    } catch (error) {
      //
    }
  }

  return (
    <form
      className="m-auto max-w-72 h-full flex justify-center flex-col"
      onSubmit={handleSubmitEmail}
    >
      <h1 className="text-center font-bold text-2xl">FORGET PASSWORD</h1>

      <label htmlFor={id + '-mail'} className="flex flex-col gap-2 mt-4 w-full">
        <p className="font-bold">Email</p>
        <input
          className="p-2 rounded-md py-1 dark:text-black "
          id={id + '-mail'}
          name="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
      </label>
      <button className="mt-10 p-2 py-1 font-bold bg-blue-400 w-fit rounded-md mx-auto">
        Submit
      </button>
    </form>
  )
}

export default ForgetPasswordPage
