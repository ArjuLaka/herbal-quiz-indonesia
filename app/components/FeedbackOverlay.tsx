import { useEffect, useState } from "react"

interface Props {
  isCorrect: boolean
  delay: number
  onFinish: () => void
}

const FeedbackOverlay = ({ isCorrect, delay, onFinish }: Props) => {
  const [countdown, setCountdown] = useState(delay)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval)
          onFinish()
          return 0
        }
        return c - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`text-white text-center p-8 rounded-lg ${
        isCorrect ? 'bg-green-600' : 'bg-red-600'
      }`}>
        <h2 className="text-2xl font-bold mb-2">
          {isCorrect ? "✅ Benar!" : "❌ Salah!"}
        </h2>
        <p>Lanjut dalam {countdown} detik...</p>
      </div>
    </div>
  )
}

export default FeedbackOverlay
