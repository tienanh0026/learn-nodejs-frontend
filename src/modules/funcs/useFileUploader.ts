import { useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
type UploadResult = {
  progress: number
  uploading: boolean
  cancelUpload: () => void
}

const initUpload = async (fileName: string, fileSize: number) => {
  const response = await axios.post<{
    urls: string[]
    chunkSize: number
    blobName: string
  }>('/api/v1/upload/init', {
    fileName,
    fileSize,
  })
  return response.data
}

const finalizeUpload = async (blobName: string, totalParts: number) => {
  const response = await axios.post('/api/v1/upload/finalize', {
    blobName,
    totalParts,
  })
  return response.data
}

export function useLargeFileUpload(): [
  (file: File) => Promise<void>,
  UploadResult
] {
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const initUploadMutation = useMutation({
    mutationFn: (file: File) => initUpload(file.name, file.size),
  })

  const finalizeUploadMutation = useMutation({
    mutationFn: ({
      blobName,
      totalParts,
    }: {
      blobName: string
      totalParts: number
    }) => finalizeUpload(blobName, totalParts),
  })

  const uploadFile = async (file: File) => {
    setUploading(true)
    setProgress(0)
    abortRef.current = new AbortController()

    const initRes = await initUploadMutation.mutateAsync(file)
    const { urls, chunkSize, blobName } = initRes

    const reader = file.stream().getReader()
    let totalBytes = 0

    for (let i = 0; i < urls.length; i++) {
      if (abortRef.current.signal.aborted) {
        throw new Error('Upload aborted')
      }

      // Read the next chunk
      const chunkBuffer = new Uint8Array(chunkSize)
      let filled = 0

      while (filled < chunkSize) {
        const { done, value } = await reader.read()
        if (abortRef.current.signal.aborted) throw new Error('Upload aborted')
        if (done) break

        const copyLength = Math.min(chunkSize - filled, value.length)
        chunkBuffer.set(value.subarray(0, copyLength), filled)
        filled += copyLength
      }

      // Slice the buffer to actual size read
      const actualChunk = chunkBuffer.slice(0, filled)

      // Upload with Axios
      await axios.put(urls[i], actualChunk, {
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Length': actualChunk.length,
        },
        signal: abortRef.current.signal as AbortSignal,
      })

      totalBytes += filled
      setProgress(Math.round((totalBytes / file.size) * 100))
    }

    await finalizeUploadMutation.mutateAsync({
      blobName,
      totalParts: urls.length,
    })
    setUploading(false)
    setProgress(100)
  }

  const cancelUpload = () => {
    abortRef.current?.abort()
    setUploading(false)
    setProgress(0)
  }
  return [uploadFile, { uploading, progress, cancelUpload }]
}
