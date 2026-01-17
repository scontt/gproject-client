import type { Game } from "./Game"

export interface GameList {
  id: string,
  name: string,
  description: string,
  games: Game[]
}

export const constructGameList = (data: any): GameList => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    games: data.games ?? []
  }
}
