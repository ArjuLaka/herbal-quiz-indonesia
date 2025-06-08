"use client";
import { useEffect, useState } from "react";
import herbalData from "./data/herbalData.json";
import QuizCard from "./components/QuizCard";
import Leaderboard from "./components/Leaderboard";
import FeedbackOverlay from "./components/FeedbackOverlay";
import InputAnswer from "./components/InputAnswer"
import { HerbalItem, Question, LeaderboardEntry } from "./types";
import { shuffleArray } from "./utils/shuffle";

export default function Home() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<LeaderboardEntry[]>([]);
  const [timeLeft, setTimeLeft] = useState(180);
  const [disabled, setDisabled] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [feedbackDelay, setFeedbackDelay] = useState(0);
  const [quizMode, setQuizMode] = useState<"multiple" | "input">("multiple");

  const generateQuestion = () => {
    const item = herbalData[Math.floor(Math.random() * herbalData.length)];
    const correct = item["Nama Latin"];
    const distractors = shuffleArray(
      herbalData
        .filter((h) => h["Nama Latin"] !== correct)
        .map((h) => h["Nama Latin"])
    ).slice(0, 3);
    const options = shuffleArray([correct, ...distractors]);
    setQuestion({
      text: `Apa nama latin dari "${item["Nama Herbal"]}"?`,
      correct,
      options,
    });
  };

  const startQuiz = () => {
    setStarted(true);
    setScore(0);
    setTimeLeft(180);
    setGameOver(false);
    generateQuestion();

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setGameOver(true); // skor akan disimpan oleh useEffect [gameOver]
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleAnswer = (isCorrect: boolean) => {
    const delay = isCorrect ? 2 : 8;
    setShowFeedback(true);
    setLastAnswerCorrect(isCorrect);
    setFeedbackDelay(delay);

    if (isCorrect) {
      setScore((s) => s + 1);
    }

    setDisabled(true);
  };

  const handleFeedbackFinish = () => {
    setDisabled(false);
    setShowFeedback(false);
    generateQuestion();
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("quiz_scores");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(
            (entry) =>
              typeof entry === "object" && "name" in entry && "score" in entry
          );
          setHistory(valid);
        } else {
          setHistory([]);
        }
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.error("Gagal membaca leaderboard:", e);
      setHistory([]);
      localStorage.removeItem("quiz_scores");
    }
  }, []);

  useEffect(() => {
    if (gameOver) {
      const newEntry: LeaderboardEntry = {
        name: playerName || "Anonim",
        score,
      };
      const stored = localStorage.getItem("quiz_scores") || "[]";
      const parsed: LeaderboardEntry[] = JSON.parse(stored);
      const updated = [...parsed, newEntry];
      setHistory(updated);
      localStorage.setItem("quiz_scores", JSON.stringify(updated));
    }
  }, [gameOver]);

  const restart = () => {
    setStarted(false);
    setScore(0);
    setGameOver(false);
    setTimeLeft(180);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">🌿 Kuis Herbal 3 Menit</h1>
      {!started ? (
        <div className="p-4 bg-gray-700 rounded shadow-md w-full max-w-md space-y-4">
          <label className="block">
            <span className="text-white">Nama Kamu:</span>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="mt-1 block w-full p-2 border rounded"
              placeholder="Masukkan nama..."
            />
          </label>
          <div className="flex space-x-4">
            <label>
              <input
                type="radio"
                value="multiple"
                checked={quizMode === "multiple"}
                onChange={() => setQuizMode("multiple")}
              />
              <span className="ml-2">Pilihan Ganda</span>
            </label>
            <label>
              <input
                type="radio"
                value="input"
                checked={quizMode === "input"}
                onChange={() => setQuizMode("input")}
              />
              <span className="ml-2">Isian Manual</span>
            </label>
          </div>
          <button
            onClick={startQuiz}
            disabled={!playerName.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Siap! Mulai Kuis
          </button>
          <Leaderboard scores={history} />
        </div>
      ) : gameOver ? (
        <div className="text-center">
          <p className="text-xl mb-2">⏰ Waktu Habis!</p>
          <p className="mb-2 font-semibold">Skor: {score}</p>
          <button
            onClick={restart}
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Main Lagi
          </button>
          <Leaderboard scores={history} />
        </div>
      ) : question ? (
        <>
          <p className="mb-2 text-lg">⏱️ Sisa waktu: {timeLeft} detik</p>
          <p className="mb-4">Skor: {score}</p>
          {quizMode === "multiple" ? (
            <QuizCard
              question={question}
              onAnswer={handleAnswer}
              disabled={disabled}
            />
          ) : (
            <InputAnswer
              question={{ text: question.text, correct: question.correct }}
              onAnswer={handleAnswer}
              disabled={disabled}
            />
          )}
          {showFeedback && (
            <FeedbackOverlay
              isCorrect={lastAnswerCorrect}
              delay={feedbackDelay}
              onFinish={handleFeedbackFinish}
            />
          )}
        </>
      ) : (
        <p>Memuat soal...</p>
      )}
    </div>
  );
}
