import { useEffect, useState } from 'react'

const usePreviewMediaFile = (file: File | undefined) => {
  const [previewFile, setPreviewFile] = useState<
    { data: string | undefined; type: 'image' | 'video' } | undefined
  >()
  useEffect(() => {
    if (!file) return setPreviewFile(undefined)
    const imageRegex = /^image\/(jpeg|png|gif|webp|bmp|svg\+xml)$/
    const isImage = imageRegex.test(file.type)
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      setPreviewFile({
        data: reader.result?.toString(),
        type: isImage ? 'image' : 'video',
      })
      return
    }
    reader.onerror = function (error) {
      console.log('Error: ', error)
      setPreviewFile(undefined)
      return
    }
  }, [file])

  return { previewFile, setPreviewFile }
}

export default usePreviewMediaFile
