<script setup lang="ts">
import Header from '@/widgets/header.vue';
import { useUserStore } from '@/app/stores/userStore';
import SettingsIcon from '@/components/icons/settings.icon.vue';
import { router } from '@/app/router';
import apiClient from '@/app/api/baseApi';
import { onMounted, ref } from 'vue';
import { constructGameList, type GameList } from '@/entities';

const userStore = useUserStore();

const gameLists = ref<GameList[]>([]);

onMounted(async () => {
  const userId = userStore.user?.id;
  if (!userId) {
    return;
  }
  const listsServer = await apiClient.get(`/gamelists/user/${userId}`);
  gameLists.value = (listsServer.data ?? []).map(constructGameList);
  console.log(gameLists.value);
});

const createList = async () => {

  const body = {
    name: "Новый список",
    description: "Новый список",
  };

  const response = await apiClient.post("/gamelists", body);

  router.push(`list/${response.data['id']}`);
};
</script>

<template>
  <Header />
  <div class="profile-container">
    <div class="profile-banner" />

    <div class="profile-content">
      <div class="head">
        <div class="avatar-wrapper">
          <div class="user-photo">
            <!-- Здесь можно <img :src="userStore.user?.avatar" /> -->
          </div>
        </div>

        <div class="user-info">
          <div class="user-nickname">{{ userStore.user?.username || 'NightPlayer' }}</div>
          <div class="user-stats">
            <span>Игр в библиотеке: 342</span> •
            <span>Часов в играх: 4,567</span>
          </div>
        </div>

        <div class="header-actions">
          <div class="settings-button" title="Настройки профиля">
            <SettingsIcon />
          </div>
        </div>
      </div>

      <div class="profile-body">

        <!-- Списки игр -->
        <div class="game-lists-section">
          <div class="section-header">
            <h2 class="section-title">Списки игр</h2>
            <div class="create-list-button" @click="createList">
              <span>+</span> Создать список
            </div>
          </div>

          <div class="game-lists-grid">
            <div
              v-for="list in gameLists"
              :key="list.id"
              class="list-card"
              @click="router.push(`/list/${list.id}`)"
            >
              <!-- <img :src="list.cover" alt="List cover" class="list-cover" /> -->
              <div class="list-overlay">
                <h3>{{ list.name }}</h3>
                <p>{{ list.games.length }} игр</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.profile-container {
  background: linear-gradient(to bottom, #0f1117, #1e1f26);
  color: #e0e0e0;
}

.profile-banner {
  height: 300px;
  background: linear-gradient(to right, #2a3f6e, #1e1f26), url('https://via.placeholder.com/1920x300?text=Profile+Banner');
  background-size: cover;
  background-position: center;
  border-bottom: 4px solid #385cc9;
}

.profile-content {
  max-width: 1400px;
  margin: -100px auto 0;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

.head {
  display: flex;
  align-items: flex-end;
  gap: 30px;
  margin-bottom: 50px;
  flex-wrap: wrap;
}

.avatar-wrapper {
  position: relative;
}

.user-photo {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #fff url('https://via.placeholder.com/200?text=Avatar') center/cover;
  border: 6px solid #2a2c36;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
}

.user-info {
  flex: 1;
}

.user-nickname {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.user-stats {
  font-size: 18px;
  color: #a0a4b8;
}

.header-actions {
  align-self: center;
}

.settings-button {
  width: 50px;
  height: 50px;
  background: #2a2c36;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);

  &:hover {
    background: #385cc9;
    transform: rotate(30deg) scale(1.1);
  }
}

.section-title {
  font-size: 32px;
  margin: 0 0 20px 0;
  color: #c0c4d8;
}

.last-game-section {
  margin-bottom: 60px;
}

.last-game-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-8px);
  }

  .game-cover {
    width: 100%;
    height: 400px;
    object-fit: cover;
    display: block;
  }

  .game-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30px;
    background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
    color: white;

    h3 {
      font-size: 28px;
      margin: 0 0 8px;
    }

    p {
      margin: 0;
      opacity: 0.9;
    }
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.create-list-button {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  color: #385cc9;
  cursor: pointer;
  padding: 10px 20px;
  background: #2a2c36;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: #385cc9;
    color: white;
    transform: translateY(-2px);
  }

  span {
    font-size: 24px;
    font-weight: bold;
  }
}

.game-lists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.list-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  height: 180px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-10px) scale(1.03);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);

    .list-overlay {
      opacity: 1;
    }
  }

  .list-cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .list-overlay {
    position: absolute;
    inset: 0;
    padding: 20px;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    color: white;
    opacity: 0;
    transition: opacity 0.3s ease;

    h3 {
      font-size: 20px;
      margin: 0 0 4px;
    }

    p {
      margin: 0;
      opacity: 0.9;
    }
  }
}

@media (max-width: 768px) {
  .head {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .user-nickname {
    font-size: 36px;
  }
}
</style>
