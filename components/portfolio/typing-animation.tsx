"use client"

import { useState, useEffect } from "react"

interface TypingAnimationProps {
  phrases: string[]
  typingSpeed?: number
  deletingSpeed?: number
  delayBetween?: number
}

export function TypingAnimation({
  phrases,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetween = 1500,
}: TypingAnimationProps) {
  const [text, setText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [delta, setDelta] = useState(typingSpeed)

  useEffect(() => {
    if (phrases.length === 0) return

    const tick = () => {
      const currentPhrase = phrases[phraseIndex]
      const shouldDelete = isDeleting
      const currentText = shouldDelete
        ? currentPhrase.substring(0, text.length - 1)
        : currentPhrase.substring(0, text.length + 1)

      setText(currentText)

      if (shouldDelete) {
        setDelta(deletingSpeed)
      } else {
        setDelta(typingSpeed)
      }

      if (!shouldDelete && currentText === currentPhrase) {
        // Finished typing
        setIsDeleting(true)
        setDelta(delayBetween)
      } else if (shouldDelete && currentText === "") {
        // Finished deleting
        setIsDeleting(false)
        setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length)
      }
    }

    const timer = setTimeout(tick, delta)
    return () => clearTimeout(timer)
  }, [text, isDeleting, phraseIndex, delta, phrases, typingSpeed, deletingSpeed, delayBetween])

  return (
    <span className="inline-block">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  )
}
