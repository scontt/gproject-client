<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/app/stores/userStore';
import { router } from '@/app/router';

const userStore = useUserStore();
const searchQuery = ref('');

// Пример навигации — подстрой под свои роуты
const navItems = [
  { name: 'Главная', path: '/' },
  // { name: 'Поиск игр', path: '/search' },
  { name: 'Списки', path: '/lists' },
  { name: 'Профиль', path: '/profile' },
];

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`);
    searchQuery.value = '';
  }
};
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Логотип -->
      <div class="logo" @click="router.push('/')">
        <span class="logo-text">HitlerHub</span>
      </div>

      <!-- Навигация -->
      <nav class="navigation">
        <a
          v-for="item in navItems"
          :key="item.path"
          :class="{ active: $route.path === item.path }"
          @click="router.push(item.path)"
          class="nav-link"
        >
          {{ item.name }}
        </a>
      </nav>

      <!-- Поиск и профиль -->
      <div class="right-section">
        <div class="search-bar">
          <input
            v-model="searchQuery"
            @keyup.enter="performSearch"
            type="text"
            placeholder="Поиск игр..."
            class="search-input"
          />
          <button @click="performSearch" class="search-button">
            🔍
          </button>
        </div>

        <!-- Аватар пользователя -->
        <div
          v-if="userStore.user"
          class="user-avatar"
          @click="router.push('/profile')"
          title="Перейти в профиль"
        >
          <img
            :src="userStore.user.avatar || 'https://via.placeholder.com/40?text=U'"
            alt="Avatar"
            class="avatar-img"
          />
        </div>

        <!-- Если не авторизован -->
        <div v-else class="auth-buttons">
          <button @click="router.push('/login')" class="login-btn">Войти</button>
          <button @click="router.push('/register')" class="register-btn">Регистрация</button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background: rgba(26, 28, 36, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #363842;
  position: sticky;
  top: 0;
  z-index: 1000;
  padding: 12px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

.logo {
  cursor: pointer;
  .logo-text {
    font-size: 28px;
    font-weight: 800;
    color: #385cc9;
    text-shadow: 0 0 10px rgba(56, 92, 201, 0.5);
  }
}

.navigation {
  display: flex;
  gap: 32px;
  flex: 1;
  justify-content: center;

  .nav-link {
    font-size: 18px;
    color: #a0a4b8;
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      color: white;
      background: rgba(56, 92, 201, 0.2);
    }

    &.active {
      color: white;
      background: #385cc9;
      font-weight: 600;
    }
  }
}

.right-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #2a2c36;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #434657;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #385cc9;
    box-shadow: 0 0 0 3px rgba(56, 92, 201, 0.2);
  }

  .search-input {
    padding: 10px 16px;
    background: transparent;
    border: none;
    color: #e0e0e0;
    width: 240px;
    outline: none;
    font-size: 16px;

    &::placeholder {
      color: #6c6f82;
    }
  }

  .search-button {
    padding: 10px 16px;
    background: transparent;
    border: none;
    color: #a0a4b8;
    cursor: pointer;
    font-size: 18px;
    transition: color 0.3s ease;

    &:hover {
      color: #385cc9;
    }
  }
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid #2a2c36;
  transition: all 0.3s ease;

  &:hover {
    border-color: #385cc9;
    transform: scale(1.1);
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.auth-buttons {
  display: flex;
  gap: 12px;

  button {
    padding: 10px 20px;
    border-radius: 12px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .login-btn {
    background: transparent;
    border: 1px solid #434657;
    color: #e0e0e0;

    &:hover {
      background: #2a2c36;
    }
  }

  .register-btn {
    background: #385cc9;
    border: none;
    color: white;

    &:hover {
      background: #4c79ff;
    }
  }
}

/* Мобильная адаптивность */
@media (max-width: 1024px) {
  .header-container {
    flex-wrap: wrap;
    gap: 20px;
  }

  .navigation {
    order: 3;
    width: 100%;
    justify-content: center;
  }

  .search-bar .search-input {
    width: 180px;
  }
}

@media (max-width: 768px) {
  .navigation {
    gap: 16px;
    font-size: 16px;
  }

  .search-bar {
    width: 100%;
    .search-input {
      width: 100%;
    }
  }
}
</style>
