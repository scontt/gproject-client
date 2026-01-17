import { debounce } from 'ts-debounce';
import { ref, watch } from 'vue';
import type { Game } from '@/entities/api/Game';
import { gameService } from '@/services/gameService';

export function useGameSearch() {
  const gameName = ref('');
  const searchResults = ref<Game[]>([]);
  const isLoading = ref(false);

  const searchGames = async (name: string) => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      searchResults.value = [];
      return;
    }

    try {
      isLoading.value = true;
      searchResults.value = await gameService.searchGames(trimmedName);
    } catch (err) {
      searchResults.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const debouncedSearch = debounce(searchGames, 400);

  watch(gameName, (newValue) => {
    debouncedSearch(newValue);
  });

  return {
    gameName,
    searchResults,
    isLoading,
  };
}
