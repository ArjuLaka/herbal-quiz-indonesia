"use client"
import { useEffect, useState } from "react"

interface Props {
  question: {
    text: string
    correct: string
    options: string[]
  }
  onAnswer: (isCorrect: boolean) => void
  disabled: boolean
}

const QuizCard = ({ question, onAnswer, disabled }: Props) => {
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    setSelected(null)
  }, [question])

  const handleSelect = (option: string) => {
    if (!selected && !disabled) {
      setSelected(option)
      onAnswer(option === question.correct)
    }
  }

  return (
    <div className="p-4 border rounded-lg shadow-md bg-gray-700 w-full max-w-xl">
      <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
      <div className="space-y-2">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(opt)}
            className={`w-full p-2 rounded border text-left ${
              selected
                ? opt === question.correct
                  ? "bg-green-500"
                  : opt === selected
                  ? "bg-red-500"
                  : "bg-gray-100"
                : "hover:bg-blue-500"
            }`}
            disabled={!!selected || disabled}
          >
            {String.fromCharCode(65 + idx)}. {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuizCard
