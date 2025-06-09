import { useEffect, useRef, useState } from "react"
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
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!disabled && input.trim() !== "") {
      const cleanedInput = input.trim().toLowerCase()
      const correctAnswer = question.correct.toLowerCase()
      onAnswer(cleanedInput === correctAnswer)
      setInput("")
      setSuggestions([])
      setHighlightedIndex(-1)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setSuggestions([])
    setHighlightedIndex(-1)
  }

  useEffect(() => {
    if (input.trim().length > 0) {
      const matches = herbalData
        .map((item) => item["Nama Latin"])
        .filter((latin) =>
          latin.toLowerCase().includes(input.trim().toLowerCase())
        )
        .slice(0, 5)
      setSuggestions(matches)
    } else {
      setSuggestions([])
    }
  }, [input])

  // 🔥 Fokus ke input setiap kali soal (question) berubah
  useEffect(() => {
    inputRef.current?.focus()
  }, [question])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault()
        setInput(suggestions[highlightedIndex])
        setSuggestions([])
        setHighlightedIndex(-1)
      } else {
        handleSubmit()
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 rounded-lg border shadow-md bg-gray-700 w-full max-w-xl relative"
    >
      <h2 className="text-xl font-semibold mb-2">{question.text}</h2>
      <div className="flex relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="w-full p-2 border rounded-l"
          placeholder="Tulis jawaban di sini..."
        />
        <button
          type="submit"
          disabled={disabled}
          className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700"
        >
          Submit
        </button>

        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-gray-500 border border-gray-300 w-full rounded mt-12 max-h-40 overflow-y-auto shadow-md">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onClick={() => handleSuggestionClick(s)}
                className={`px-3 py-2 cursor-pointer ${
                  i === highlightedIndex ? "bg-blue-300" : "hover:bg-gray-100"
                }`}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  )
}

export default InputAnswer
