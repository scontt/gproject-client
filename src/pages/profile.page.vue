<script setup lang="ts">
import Header from '@/widgets/header.vue';
import { useUserStore } from '@/app/stores/userStore';
import SettingsIcon from '@/components/icons/settings.icon.vue';

const userStore = useUserStore();

const testArr = [1, 2, 3, 4];

</script>


<template>
  <Header />
    <div class="main-container">
        <div class="head">
          <div class="main-info">
            <div class="user-photo"></div>
            <div class="user-nickname">
              {{ userStore.user?.username }}
            </div>
          </div>
          <div class="header-actions">
            <div class="settings-button">
              <SettingsIcon />
            </div>
            <span class="follow-button">Подписаться</span>
          </div>
        </div>
        <div class="profile-body">
          <div class="last-game-section">
            <span class="block-label">Последняя игра</span>
            <div class="last-game-block"></div>
          </div>
          <div class="game-lists-section">
            <div class="game-lists__header">
              <span class="block-label">Списки игр</span>
              <span class="block-label create-list-button">+</span>
            </div>
            <ul class="game-lists">
              <li v-for="item in testArr" class="game-lists__item"></li>
            </ul>
          </div>
        </div>
    </div>
</template>


<style scoped lang="scss">

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.block-label {
  font-size: 28px;
  margin-left: 15px;
  margin-bottom: 10px;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .follow-button {
    font-size: 18px;
    background-color: #4C79FF;
    padding: 10px 40px;
    border-radius: 20px;
    cursor: default;

    &:hover {
      background-color: #385cc9;
    }
  }

  .main-info {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 42px;

    .user-photo {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background-color: white;
    }
  }
}

.profile-body {
  margin-top: 30px;

  .last-game-section {
    display: flex;
    flex-direction: column;

    .last-game-block {
      width: 100%;
      height: 350px;
      background-color: white;
      border-radius: 20px;
    }
  }
}

.game-lists-section {
  margin-top: 30px;

  .game-lists__header {
    .create-list-button {
      color: #385cc9;
      cursor: pointer;
    }
  }

  .game-lists {
    display: flex;
    gap: 20px;
    padding-top: 10px;

    .game-lists__item {
      width: 300px;
      height: 150px;
      border-radius: 20px;
      background-color: white;
    }
  }
}

</style>
