<template>
  <div class="reload-zone">
    <button 
      class="reload-btn"
      :class="{ reloading: isReloading }"
      @touchstart="onReload"
      @mousedown="onReload"
    >
      <span v-if="!isReloading">换弹</span>
      <span v-else>{{ reloadProgress.toFixed(1) }}s</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isReloading: Boolean,
  reloadProgress: Number
})

const emit = defineEmits(['reload'])

function onReload(event) {
  event.preventDefault()
  emit('reload')
}
</script>

<style scoped>
.reload-zone {
  position: absolute;
  bottom: 50px;
  right: 200px;
  z-index: 20;
}

.reload-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(100, 100, 255, 0.6);
  border: 2px solid rgba(100, 100, 255, 0.9);
  color: white;
  font-size: 10px;
  cursor: pointer;
  touch-action: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.reload-btn:active {
  background-color: rgba(100, 100, 255, 0.9);
  transform: scale(0.95);
}

.reload-btn.reloading {
  background-color: rgba(255, 150, 100, 0.6);
  border-color: rgba(255, 150, 100, 0.9);
  cursor: not-allowed;
}
</style>