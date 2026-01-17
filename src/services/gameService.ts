import apiClient from '@/app/api/baseApi';
import type { Game } from '@/entities/api/Game';

class GameService {
  async searchGames(name: string): Promise<Game[]> {
    const response = await apiClient.get(`/game/name/${name}`);
    return response.data;
  }
}

export const gameService = new GameService();
