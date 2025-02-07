import { createContext, useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'

type ForgetPasswordContextType = {
  email: string
  resetToken: string
  setEmail: (email: string) => void
  setResetToken: (resetToken: string) => void
}

const ForgetPasswordContext = createContext<
  ForgetPasswordContextType | undefined
>(undefined)

export default function ForgetPasswordProvider() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')

  return (
    <ForgetPasswordContext.Provider
      value={{ email, setEmail, resetToken: token, setResetToken: setToken }}
    >
      <Outlet />
    </ForgetPasswordContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useForgetPasswordAuthContext = () => {
  const context = useContext(ForgetPasswordContext)
  if (!context)
    throw new Error(
      'useForgetPasswordAuth must be used within an ForgetPasswordContext'
    )
  return context
}
