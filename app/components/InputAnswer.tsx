import { useEffect, useState } from "react"
import herbalData from "../data/herbalData.json"

interface Props {
  question: {
    text: string
    correct: string
  }
  onAnswer: (isCorrect: boolean) => void
  disabled: boolean
}

const InputAnswer = ({ question, onAnswer, disabled }: Props) => {
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!disabled && input.trim() !== "") {
      const cleanedInput = input.trim().toLowerCase()
      const correctAnswer = question.correct.toLowerCase()
      onAnswer(cleanedInput === correctAnswer)
      setInput("")
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setSuggestions([])
  }

  useEffect(() => {
    if (input.trim().length > 0) {
      const matches = herbalData
        .map((item) => item["Nama Latin"])
        .filter((latin) =>
          latin.toLowerCase().includes(input.trim().toLowerCase())
        )
        .slice(0, 5) // tampilkan maksimal 5 saran

      setSuggestions(matches)
    } else {
      setSuggestions([])
    }
  }, [input])

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 rounded-lg border shadow-md bg-gray-700 w-full max-w-xl relative">
      <h2 className="text-xl font-semibold mb-2">{question.text}</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={disabled}
        className="w-full p-2 border rounded"
        placeholder="Tulis jawaban di sini..."
      />
      {/* Saran Otomatis */}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-gray-500 border border-gray-300 w-full rounded mt-1 max-h-40 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(s)}
              className="px-3 py-2 cursor-pointer hover:bg-blue-500"
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      <button
        type="submit"
        disabled={disabled}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  )
}

export default InputAnswer
