import { LeaderboardEntry } from "../types"

interface Props {
  scores: LeaderboardEntry[]
}

const Leaderboard = ({ scores }: Props) => {
  const sorted = [...scores].sort((a, b) => b.score - a.score).slice(0, 5)

  return (
    <div className="mt-6 p-4 border rounded bg-gray-500 w-full max-w-md">
      <h3 className="text-lg font-bold mb-2">🏆 Papan Skor (Top 5)</h3>
      <ol className="list-decimal ml-5">
        {sorted.map((entry, i) => (
          <li key={i}>
            {entry.name}: {entry.score}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default Leaderboard