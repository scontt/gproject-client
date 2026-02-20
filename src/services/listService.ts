import apiClient from '@/app/api/baseApi';
import { constructGameList, type GameList } from '@/entities';
import type { Game } from '@/entities/api/Game';

export interface UpdateListPayload {
  id: string;
  name: string;
  description: string;
  games: Game[];
}

class ListService {
  async createList(name: string): Promise<{ id?: string | null }> {
    const body = {
      name,
      description: name,
    };

    const response = await apiClient.post('/gamelists', body);
    return response.data;
  }

  async getList(listId: string): Promise<GameList> {
    const response = await apiClient.get(`/gamelists/${listId}`);
    return constructGameList(response.data);
  }

  async getUserLists(userId: string): Promise<GameList[]> {
    const response = await apiClient.get(`/gamelists/user/${userId}`);
    return (response.data ?? []).map(constructGameList);
  }

  async getUserListsAvailable(userId: string): Promise<GameList[]> {
    const response = await apiClient.get(`/gamelists/user/${userId}/available`);
    return (response.data ?? []).map(constructGameList);
  }

  async updateList(payload: UpdateListPayload): Promise<void> {
    await apiClient.patch('/gamelists/', payload);
  }

  async addGameToList(listId: string, gameId: string): Promise<void> {
    const body = {
      gameId,
      listId,
    };

    await apiClient.patch('/gamelists/addgame', body);
  }

  async removeGameFromList(listId: string, gameId: string): Promise<void> {
    const body = {
      gameId,
      listId,
    };

    await apiClient.patch('/gamelists/removegame', body);
  }

  async attachGameToUser(listId: string, gameId: string, userId: string): Promise<void> {
    const body = {
      gameId,
      listId,
      userId,
    };

    await apiClient.patch('/gamelists/editgameuser', body);
  }

  async detachGameFromUser(listId: string, gameId: string): Promise<void> {
    const body = {
      gameId,
      listId,
      userId: null,
    };

    await apiClient.patch('/gamelists/editgameuser', body);
  }
}

export const listService = new ListService();
