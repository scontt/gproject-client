<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Header from '@/widgets/header.vue';
import { listService } from '@/services/listService';
import { useUserStore } from '@/app/stores/userStore';
import type { GameList } from '@/entities';
import type { Game } from '@/entities/api/Game';

const userStore = useUserStore();
const route = useRoute();

const gameLists = ref<GameList[]>([]);
const selectedListId = ref<string>('');
const isLoading = ref(true);
const fetchError = ref('');

const wheelCanvas = ref<HTMLCanvasElement | null>(null);
const wheelContainer = ref<HTMLDivElement | null>(null);
const wheelSize = ref(0);
const rotation = ref(0);
const isSpinning = ref(false);
const winningGame = ref<Game | null>(null);

const colors = [
  '#385cc9',
  '#5d7bb0',
  '#4caf50',
  '#8b3e3e',
  '#c0c4d8',
  '#2a2c36'
];

const games = computed(() => {
  const map = new Map<string, Game>();
  for (const list of gameLists.value) {
    if (list.id !== selectedListId.value) {
      continue;
    }
    for (const game of list.games) {
      if (!map.has(game.id)) {
        map.set(game.id, game);
      }
    }
  }
  return Array.from(map.values());
});

const wheelItems = computed(() => games.value.map((game) => game.name));
const hasLists = computed(() => gameLists.value.length > 0);
const hasItems = computed(() => wheelItems.value.length > 0);

const selectList = (listId: string) => {
  selectedListId.value = listId;
  winningGame.value = null;
  drawWheel();
};

const resizeWheel = () => {
  const canvas = wheelCanvas.value;
  const container = wheelContainer.value;
  if (!canvas || !container) {
    return;
  }

  const size = Math.min(container.clientWidth, 420);
  const dpr = window.devicePixelRatio || 1;

  wheelSize.value = size;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  drawWheel();
};

const truncateLabel = (label: string, maxLength: number) => {
  if (label.length <= maxLength) {
    return label;
  }
  return `${label.slice(0, Math.max(0, maxLength - 3))}...`;
};

const drawWheel = () => {
  const canvas = wheelCanvas.value;
  if (!canvas) {
    return;
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const size = wheelSize.value;
  if (!size) {
    return;
  }

  const radius = size / 2;
  ctx.clearRect(0, 0, size, size);

  if (!wheelItems.value.length) {
    ctx.save();
    ctx.translate(radius, radius);
    ctx.fillStyle = 'rgba(224, 224, 224, 0.7)';
    ctx.font = '600 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Выберите список', 0, -4);
    ctx.fillText('для колеса', 0, 16);
    ctx.restore();
    return;
  }

  const slice = (Math.PI * 2) / wheelItems.value.length;
  const labelRadius = radius - 16;
  const fontSize = Math.max(11, Math.min(16, 180 / wheelItems.value.length));

  for (let i = 0; i < wheelItems.value.length; i += 1) {
    const start = rotation.value + i * slice;
    const end = start + slice;

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius - 3, start, end);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(start + slice / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#14161c';
    ctx.font = `700 ${fontSize}px sans-serif`;
    ctx.fillText(truncateLabel(wheelItems.value[i], 22), labelRadius, 5);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(radius, radius, Math.max(24, radius * 0.16), 0, Math.PI * 2);
  ctx.fillStyle = '#1e1f26';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.stroke();
};

const getWinningIndex = (finalRotation: number) => {
  if (!wheelItems.value.length) {
    return 0;
  }
  const slice = (Math.PI * 2) / wheelItems.value.length;
  const pointerAngle = -Math.PI / 2;
  const normalized = (Math.PI * 2 + (pointerAngle - (finalRotation % (Math.PI * 2)))) % (Math.PI * 2);
  return Math.floor(normalized / slice) % wheelItems.value.length;
};

const spinWheel = () => {
  if (!hasItems.value || isSpinning.value) {
    return;
  }

  isSpinning.value = true;
  winningGame.value = null;

  const spins = 5 + Math.random() * 3;
  const randomOffset = Math.random() * Math.PI * 2;
  const startRotation = rotation.value;
  const targetRotation = startRotation + spins * Math.PI * 2 + randomOffset;
  const duration = 3600;
  const startTime = performance.now();

  const animate = (now: number) => {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    rotation.value = startRotation + (targetRotation - startRotation) * eased;
    drawWheel();

    if (t < 1) {
      requestAnimationFrame(animate);
      return;
    }

    isSpinning.value = false;
    const index = getWinningIndex(rotation.value);
    winningGame.value = games.value[index] ?? null;

    if (winningGame.value && userStore.user?.id) {
      console.log("Выпала игра: ", winningGame.value);
      listService.attachGameToUser(selectedListId.value, winningGame.value.id, userStore.user?.id);
    }
  };

  requestAnimationFrame(animate);
};

const getPreferredListId = () => {
  const raw = route.query.list;
  if (Array.isArray(raw)) {
    return raw[0] ?? '';
  }
  return typeof raw === 'string' ? raw : '';
};

onMounted(async () => {
  const userId = userStore.user?.id;
  if (!userId) {
    isLoading.value = false;
    return;
  }

  try {
    gameLists.value = await listService.getUserListsAvailable(userId);
    const preferredListId = getPreferredListId();
    const hasPreferred = gameLists.value.some((list) => list.id === preferredListId);
    selectedListId.value = hasPreferred ? preferredListId : (gameLists.value[0]?.id ?? '');
  } catch (error) {
    fetchError.value = 'Не удалось загрузить списки.';
  } finally {
    isLoading.value = false;
  }
});

onMounted(() => {
  resizeWheel();
  window.addEventListener('resize', resizeWheel);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeWheel);
});

watch([wheelItems, wheelSize], () => {
  drawWheel();
});
</script>

<template>
  <Header />
  <main class="fortune-container">
    <div class="fortune-head">
      <h1>Колесо фортуны</h1>
      <p>Выбери список, из которого будет собрана рулетка.</p>
    </div>

    <div class="fortune-layout">
      <div class="fortune-panel">
        <div v-if="isLoading" class="panel-message">Загружаем списки...</div>
        <div v-else-if="fetchError" class="panel-message error">{{ fetchError }}</div>
        <div v-else-if="!hasLists" class="panel-message">
          Пока нет списков. Создай их в профиле.
        </div>

        <div v-else class="list-selector">
          <div class="list-chips">
            <button
              v-for="list in gameLists"
              :key="list.id"
              type="button"
              class="list-chip"
              :class="{ active: selectedListId === list.id }"
              @click="selectList(list.id)"
            >
              <span class="list-name">{{ list.name }}</span>
              <span class="list-count">{{ list.games.length }}</span>
            </button>
          </div>
        </div>

        <div class="panel-stats">
          <div>
            <span class="stat-label">Игр в колесе</span>
            <span class="stat-value">{{ wheelItems.length }}</span>
          </div>
          <div>
            <span class="stat-label">Активных списков</span>
            <span class="stat-value">{{ selectedListId ? 1 : 0 }}</span>
          </div>
        </div>

        <div class="panel-actions">
          <button class="spin-button" type="button" :disabled="!hasItems || isSpinning" @click="spinWheel">
            {{ isSpinning ? 'Крутим...' : 'Крутить колесо' }}
          </button>
          <div class="result-card">
            <p class="result-label">Твой выбор</p>
            <p class="result-value">{{ winningGame?.name || 'Еще не выбрали' }}</p>
          </div>
        </div>
      </div>

      <div class="wheel-panel">
        <div class="wheel-frame" ref="wheelContainer">
          <div class="wheel-pointer"></div>
          <canvas ref="wheelCanvas" class="wheel-canvas" />
        </div>
        <div class="wheel-hint">
          {{ hasItems ? 'Нажми кнопку и дай случаю решить.' : 'Добавь игры в списки — колесо оживет.' }}
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.fortune-container {
  min-height: 100vh;
  padding: 20px;
  background: #1e1f26;
  color: #e0e0e0;
}

.fortune-head {
  margin: 10px 0 24px;
}

.fortune-head h1 {
  margin: 0 0 8px;
  font-size: 28px;
}

.fortune-head p {
  margin: 0;
  color: #a0a4b8;
}

.fortune-layout {
  display: grid;
  grid-template-columns: minmax(260px, 1fr) minmax(280px, 1fr);
  gap: 24px;
}

.fortune-panel {
  background: #252630;
  border: 1px solid #434657;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.panel-message {
  padding: 14px 16px;
  border-radius: 10px;
  background: #2a2c36;
  color: #c0c4d8;
}

.panel-message.error {
  color: #ff8f8f;
}

.list-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.list-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #434657;
  background: #2a2c36;
  color: #a0a4b8;
  cursor: pointer;
  transition: all 0.2s ease;
}

.list-chip.active {
  color: #fff;
  border-color: #5d7bb0;
  background: #2f3445;
}

.list-name {
  font-size: 14px;
}

.list-count {
  background: #434657;
  color: #fff;
  border-radius: 999px;
  padding: 2px 6px;
  font-size: 12px;
}

.panel-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #a0a4b8;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #e0e0e0;
}

.panel-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.spin-button {
  width: 100%;
  padding: 12px 18px;
  border: none;
  border-radius: 10px;
  background: #385cc9;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.spin-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spin-button:not(:disabled):hover {
  background: #4c79ff;
}

.result-card {
  background: #2a2c36;
  border-radius: 10px;
  padding: 12px 16px;
  border: 1px solid #434657;
}

.result-label {
  font-size: 12px;
  text-transform: uppercase;
  color: #a0a4b8;
  margin: 0 0 8px;
}

.result-value {
  font-size: 20px;
  margin: 0;
  color: #e0e0e0;
}

.wheel-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.wheel-frame {
  position: relative;
  width: min(420px, 90vw);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  padding: 12px;
  background: #252630;
  border: 1px solid #434657;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.wheel-canvas {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.4);
}

.wheel-pointer {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  transform: rotate(180deg);
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 20px solid #385cc9;
}

.wheel-hint {
  color: #a0a4b8;
  text-align: center;
  max-width: 320px;
}

@media (max-width: 960px) {
  .fortune-layout {
    grid-template-columns: 1fr;
  }
}
</style>
