<script setup lang="ts">
import { router } from '@/app/router';
import { useUserStore } from '@/app/stores/userStore';
import { nextTick } from 'vue';
import { authService } from '@/services/authService';

const userStore = useUserStore();

const logoutHandler = async () => {
  await authService.logout();
  await nextTick();
  userStore.logout();
  await nextTick();
  await router.push('/');
};
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Логотип -->
      <RouterLink to="/" class="logo">
        <span class="logo-icon"></span>
        <span class="logo-text">HitlerHub</span>
      </RouterLink>

      <!-- Навигация (опционально, можно добавить твои ссылки) -->
      <nav class="navigation" v-if="userStore.isAuthenticated">
        <RouterLink to="/profile" class="nav-link">
          <span>Профиль</span>
        </RouterLink>
      </nav>

      <!-- Правая часть: auth / профиль -->
      <div class="right-section">
        <div v-if="!userStore.isAuthenticated" class="auth-buttons">
          <RouterLink to="/login" class="auth-btn login-btn">
            Вход
          </RouterLink>
          <RouterLink to="/signup" class="auth-btn register-btn">
            Регистрация
          </RouterLink>
        </div>

        <div v-else class="user-section">
          <!-- Аватарка (из userStore или дефолт) -->
          <RouterLink to="/profile" class="user-avatar">
            <img
              :src="userStore.user?.avatar || 'https://via.placeholder.com/40?text=U'"
              alt="Avatar"
              class="avatar-img"
            />
            <span class="username">{{ userStore.user?.username || 'Гость' }}</span>
          </RouterLink>
          <button @click="logoutHandler" class="logout-btn">
            <span>Выход</span>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  background: rgba(26, 28, 36, 0.95);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(67, 70, 87, 0.5);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #e0e0e0;
  font-weight: 800;
  transition: all 0.3s ease;

  &:hover {
    color: #385cc9;
    text-shadow: 0 0 15px rgba(56, 92, 201, 0.5);
  }

  .logo-icon {
    font-size: 28px;
  }

  .logo-text {
    font-size: 24px;
  }
}

.navigation {
  display: flex;
  gap: 24px;

  .nav-link {
    color: #a0a4b8;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 0.3s ease;
    font-size: 16px;

    &:hover,
    &.router-link-active {
      color: white;
      background: rgba(56, 92, 201, 0.2);
    }
  }
}

.right-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.auth-buttons {
  display: flex;
  gap: 12px;
}

.auth-btn {
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.login-btn {
  background: transparent;
  border: 1px solid #434657;
  color: #e0e0e0;

  &:hover {
    background: rgba(56, 92, 201, 0.1);
    border-color: #385cc9;
    color: #385cc9;
  }
}

.register-btn {
  background: linear-gradient(to right, #385cc9, #4c79ff);
  color: white;

  &:hover {
    background: linear-gradient(to right, #4c79ff, #5d8aff);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(56, 92, 201, 0.3);
  }
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #e0e0e0;
  transition: all 0.3s ease;

  &:hover {
    color: #385cc9;
  }

  .avatar-img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #2a2c36;
  }

  .username {
    font-size: 15px;
    font-weight: 600;
  }
}

.logout-btn {
  padding: 8px 16px;
  background: rgba(139, 62, 62, 0.2);
  border: 1px solid #8b3e3e;
  color: #ff6b6b;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #8b3e3e;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 62, 62, 0.4);
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .header-container {
    padding: 12px 16px;
  }

  .logo-text {
    display: none;
  }

  .navigation {
    display: none; // можно добавить гамбургер
  }

  .auth-buttons {
    gap: 8px;
  }

  .auth-btn {
    padding: 8px 14px;
    font-size: 14px;
  }
}
</style>
