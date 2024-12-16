import axios, { AxiosRequestConfig } from 'axios'
import { useState } from 'react'
import baseAxios from '.'

type ApiFieldResponseErr<T extends string> = {
  message: string
  errors?: Record<T, string>
}

const useApi = <ResponseT, ResponseErrorFieldsT extends string>(
  axiosRequestConfig: AxiosRequestConfig
) => {
  const [data, setData] = useState<ResponseT | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] =
    useState<ApiFieldResponseErr<ResponseErrorFieldsT> | null>(null)
  const execute = async () => {
    try {
      setIsLoading(true)
      const response = await baseAxios<ResponseT>(axiosRequestConfig)
      setData(response.data)
      return response.data
    } catch (error) {
      setIsError(true)
      if (
        axios.isAxiosError<ApiFieldResponseErr<ResponseErrorFieldsT>>(error)
      ) {
        console.log(error.response?.data)
        setError(error.response?.data || null)
      }
    } finally {
      setIsLoading(false)
    }
  }
  return { execute, data, isLoading, isError, error }
}

export { useApi }
