import { useRef, useState } from 'react'

function RoomStreamPage() {
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection>()
  const [stream, setStream] = useState<MediaStream>()
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleStartScreenShare = async () => {
    try {
      if (!navigator.mediaDevices.getDisplayMedia) {
        throw new Error('getDisplayMedia is not supported in this browser.')
      }
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      })
      if (!videoRef.current) return
      videoRef.current.srcObject = stream
      setStream(stream)
      const pc = new RTCPeerConnection()
      stream.getTracks().forEach((track) => pc.addTrack(track, stream))
      setPeerConnection(pc)
      // Handle stream (e.g., attach to video element, send to peer)
    } catch (err) {
      console.error('Error accessing display media:', err)
    }
  }

  const handleStopScreenShare = async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }
    if (peerConnection) {
      peerConnection.close()
    }
    if (videoRef.current) videoRef.current.srcObject = null

    setStream(undefined)
    setPeerConnection(undefined)
  }

  const handleStartLivestream = async () => {
    if (!stream) return
    const mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        console.log(event)
      }
    }
    mediaRecorder.start(1000)
  }

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="flex gap-2 justify-center">
        <button
          className="bg-blue-600 p-2 rounded-lg block"
          onClick={handleStartScreenShare}
        >
          Start Preview
        </button>
        <button
          className="bg-blue-600 p-2 rounded-lg block"
          onClick={handleStartLivestream}
        >
          Start Livestream
        </button>
        <button
          className="bg-blue-600 p-2 rounded-lg block"
          onClick={handleStopScreenShare}
        >
          Stop Livestream/Preview
        </button>
      </div>
      <div className="mt-2 rounded-md flex-1">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="size-full my-auto border border-black max-h-full"
        />
      </div>
    </div>
  )
}

export default RoomStreamPage
