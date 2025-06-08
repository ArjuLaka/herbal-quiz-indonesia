export interface HerbalItem {
  No: number
  "Nama Herbal": string
  "Nama Latin": string
}

export interface Question {
  text: string
  correct: string
  options: string[]
}

export interface LeaderboardEntry {
  name: string
  score: number
}