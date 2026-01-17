<script setup lang="ts">
import type { Game } from '@/entities/api/Game';
import Header from '@/widgets/header.vue';
import { ref } from 'vue';
import { useGameSearch } from '@/composables/useGameSearch';
import { listService } from '@/services/listService';

const listName = ref<string>('');
const listId = ref<string | null>(null);
const selectedGames = ref<Game[]>([]);

const { gameName, searchResults, isLoading } = useGameSearch();

const createListIfNeeded = async () => {
  if (listId.value) {
    return listId.value;
  }

  const name = listName.value.trim() || "Новый список";
  const body = {
    name,
    description: name,
  };

  const response = await listService.createList(name);
  listId.value = response?.id ?? null;
  return listId.value;
};

const addGame = async (game: Game) => {
  if (!selectedGames.value.some(g => g.id === game.id)) {
    const currentListId = await createListIfNeeded();
    if (!currentListId) {
      return;
    }

    await listService.addGameToList(currentListId, game.id.toString());

    selectedGames.value.push(game);
  }
};

const removeGame = async (game: Game) => {
  const currentListId = listId.value;

  if (currentListId) {
    await listService.removeGameFromList(currentListId, game.id.toString());
  }

  selectedGames.value = selectedGames.value.filter(g => g.id !== game.id);
};
</script>

<template>
  <Header />
  <div class="main-container">
    <div class="list-head">
      <input class="list-name" type="text" v-model="listName" />
    </div>
    <!-- Две колонки: поиск слева, выбранные игры справа -->
    <div class="layout">
      <!-- Левая колонка: поиск -->
      <div class="search-column">
        <input
          v-model="gameName"
          type="text"
          class="steam-search"
          placeholder="Введите название игры..."
        />

        <div class="search-result">
          <div v-if="isLoading" class="loading">Загрузка...</div>
          <div v-else-if="searchResults.length === 0 && gameName.trim()" class="no-results">
            Ничего не найдено
          </div>

          <!-- Результаты поиска — кандидаты на добавление -->
          <div
            v-for="game in searchResults"
            :key="game.id"
            class="search__item"
            @click="addGame(game)"
          >
            <div class="game-info">
              <div class="game-name">{{ game.name }}</div>
            </div>
            <div class="add-button">+</div>
          </div>
        </div>
      </div>

      <!-- Правая колонка: выбранные игры -->
      <div class="selected-column">
        <h2 class="selected-title">Выбранные игры ({{ selectedGames.length }})</h2>

        <div class="selected-list">
          <div v-if="selectedGames.length === 0" class="empty-list">
            Пока ничего не добавлено
          </div>

          <div
            v-for="game in selectedGames"
            :key="game.id"
            class="selected__item"
          >
            <div class="game-info">
              <div class="game-name">{{ game.name }}</div>
            </div>
            <div class="remove-button" @click="removeGame(game)">×</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #1e1f26;
  color: #e0e0e0;

  .list-name {
    padding: 14px 20px;
    font-size: 22px;
    background: none;
    border: none;
    border: 1px solid transparent;
    border: 1px solid #434657;
    border-radius: 12px;
    color: #e0e0e0;
    outline: none;
    margin: auto 0 10px auto;
    width: 40%;
    transition: all 0.3s ease;

    &:hover {
      border: 1px solid #434657;
    }

    &:focus {
      background: #2a2c36;
      border: 1px solid #434657;
    }
  }
}

.layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
}

/* Левая колонка */
.search-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.steam-search {
  padding: 14px 20px;
  font-size: 18px;
  background: #2a2c36;
  border: 1px solid #434657;
  border-radius: 12px;
  color: #e0e0e0;
  outline: none;
  transition: all 0.3s ease;

  &::placeholder {
    color: #6c6f82;
  }

  &:focus {
    border-color: #5d7bb0;
    box-shadow: 0 0 0 3px rgba(93, 123, 176, 0.2);
  }
}

.search-result {
  background: #252630;
  border: 1px solid #434657;
  border-radius: 12px;
  max-height: 70vh;
  overflow-x: hidden;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Общий стиль для плашек (и поиск, и выбранные) */
.search__item,
.selected__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(to right, #2f313d, #2a2c36);
  border-bottom: 1px solid #363842;
  cursor: pointer;

  &:hover {
    background: linear-gradient(to right, #3a3d4e, #343640);
  }

  &:last-child {
    border-bottom: none;
  }
}

.game-info {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .game-name {
    font-size: 16px;
    font-weight: 600;
  }

  .game-edition {
    font-size: 13px;
    color: #a0a4b8;
  }
}

.add-button {
  width: 36px;
  height: 36px;
  background: #3a845e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  transition: all 0.2s ease;

  &:hover {
    background: #4caf50;
    transform: scale(1.1);
  }
}

.remove-button {
  width: 36px;
  height: 36px;
  background: #8b3e3e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #c44;
    transform: scale(1.1);
  }
}

/* Правая колонка */
.selected-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.selected-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #c0c4d8;
}

.selected-list {
  background: #252630;
  border: 1px solid #434657;
  border-radius: 12px;
  min-height: 70vh;
  padding: 12px 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.empty-list,
.loading,
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #888c9e;
  font-size: 16px;
}

/* Скроллбар */
.search-result::-webkit-scrollbar,
.selected-list::-webkit-scrollbar {
  width: 8px;
}
.search-result::-webkit-scrollbar-thumb,
.selected-list::-webkit-scrollbar-thumb {
  background: #434657;
  border-radius: 4px;
}
.search-result::-webkit-scrollbar-thumb:hover,
.selected-list::-webkit-scrollbar-thumb:hover {
  background: #5d5f72;
}
</style>
