export interface GameList {
  id: string,
  name: string,
  user: string,
  description: string,
  createdAt: Date
  games: []
}

export const constructGameList = (data: any): GameList => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    createdAt: new Date(data.createdAt),
    games: data.games
  }
}
