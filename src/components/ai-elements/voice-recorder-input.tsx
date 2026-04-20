"use client"

import { MicIcon, SquareIcon } from "lucide-react"
import type { ComponentProps } from "react"
import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

const MAX_RECORDING_DURATION_MS = 60_000

const getSupportedAudioMimeType = () => {
  if (typeof MediaRecorder === "undefined") {
    return undefined
  }

  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"]
  return candidates.find((mimeType) => MediaRecorder.isTypeSupported(mimeType))
}

export type VoiceRecorderInputProps = ComponentProps<typeof Button> & {
  onFinish: (audio: Blob) => void | Promise<void>
  onError?: (error: Error) => void
  maxDurationMs?: number
}

export function VoiceRecorderInput({
  className,
  onFinish,
  onError,
  maxDurationMs = MAX_RECORDING_DURATION_MS,
  ...props
}: VoiceRecorderInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSupported] = useState(
    () => typeof window !== "undefined" && "MediaRecorder" in window && "mediaDevices" in navigator
  )
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const stopTimeoutRef = useRef<number | null>(null)
  const onFinishRef = useRef(onFinish)
  const onErrorRef = useRef(onError)

  // eslint-disable-next-line react-hooks/refs
  onFinishRef.current = onFinish
  // eslint-disable-next-line react-hooks/refs
  onErrorRef.current = onError

  const clearStopTimeout = useCallback(() => {
    if (stopTimeoutRef.current !== null) {
      window.clearTimeout(stopTimeoutRef.current)
      stopTimeoutRef.current = null
    }
  }, [])

  const releaseStream = useCallback(() => {
    if (!streamRef.current) {
      return
    }
    for (const track of streamRef.current.getTracks()) {
      track.stop()
    }
    streamRef.current = null
  }, [])

  const stopRecording = useCallback(() => {
    clearStopTimeout()
    const recorder = mediaRecorderRef.current
    if (recorder?.state === "recording") {
      recorder.stop()
    } else {
      releaseStream()
    }
    setIsRecording(false)
  }, [clearStopTimeout, releaseStream])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = getSupportedAudioMimeType()
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)

      streamRef.current = stream
      mediaRecorderRef.current = recorder
      audioChunksRef.current = []

      const handleDataAvailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      const handleStop = async () => {
        clearStopTimeout()
        releaseStream()

        const audio = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || mimeType || "audio/webm",
        })

        mediaRecorderRef.current = null
        if (audio.size === 0) {
          return
        }

        setIsSaving(true)
        try {
          await onFinishRef.current(audio)
        } catch {
          onErrorRef.current?.(new Error("Failed to handle recorded audio"))
        } finally {
          setIsSaving(false)
        }
      }

      const handleError = () => {
        clearStopTimeout()
        setIsRecording(false)
        releaseStream()
        mediaRecorderRef.current = null
        onErrorRef.current?.(new Error("Recording failed"))
      }

      recorder.addEventListener("dataavailable", handleDataAvailable)
      recorder.addEventListener("stop", () => {
        void handleStop()
      })
      recorder.addEventListener("error", handleError)

      recorder.start()
      setIsRecording(true)
      stopTimeoutRef.current = window.setTimeout(stopRecording, Math.max(1_000, maxDurationMs))
    } catch {
      onErrorRef.current?.(new Error("Microphone access denied"))
    }
  }, [clearStopTimeout, maxDurationMs, releaseStream, stopRecording])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
      return
    }
    void startRecording()
  }, [isRecording, startRecording, stopRecording])

  useEffect(
    () => () => {
      clearStopTimeout()
      if (mediaRecorderRef.current?.state === "recording") {
        mediaRecorderRef.current.stop()
      }
      releaseStream()
    },
    [clearStopTimeout, releaseStream]
  )

  return (
    <div className="relative inline-flex items-center justify-center">
      {isRecording &&
        [0, 1, 2].map((index) => (
          <div
            className="absolute inset-0 animate-ping rounded-full border-2 border-red-400/30"
            key={index}
            style={{
              animationDelay: `${index * 0.3}s`,
              animationDuration: "2s",
            }}
          />
        ))}

      <Button
        className={cn(
          "relative z-10 rounded-full transition-all duration-300",
          isRecording
            ? "bg-destructive text-white hover:bg-destructive/80 hover:text-white"
            : "bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground",
          className
        )}
        disabled={!isSupported || isSaving}
        onClick={toggleRecording}
        {...props}
      >
        {isSaving && <Spinner />}
        {!isSaving && isRecording && <SquareIcon className="size-4" />}
        {!(isSaving || isRecording) && <MicIcon className="size-4" />}
      </Button>
    </div>
  )
}
