<template>
  <div class="dash-zone">
    <button 
      class="dash-btn"
      :class="{ disabled: dashCount === 0, recharging: isRecharging }"
      @touchstart="onDash"
      @mousedown="onDash"
    >
      <span class="dash-text">冲刺</span>
      <span class="dash-count">{{ dashCount }}</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  dashCount: Number,
  isRecharging: Boolean
})

const emit = defineEmits(['dash'])

function onDash(event) {
  event.preventDefault()
  if (props.dashCount > 0) {
    emit('dash')
  }
}
</script>

<style scoped>
.dash-zone {
  position: absolute;
  bottom: 30px;
  right: 130px;
  z-index: 20;
}

.dash-btn {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: rgba(100, 255, 100, 0.6);
  border: 2px solid rgba(100, 255, 100, 0.9);
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  touch-action: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  position: relative;
}

.dash-btn:active:not(.disabled) {
  background-color: rgba(100, 255, 100, 0.9);
  transform: scale(0.95);
}

.dash-btn.disabled {
  background-color: rgba(100, 100, 100, 0.3);
  border-color: rgba(100, 100, 100, 0.5);
  cursor: not-allowed;
}

.dash-btn.recharging {
  background-color: rgba(255, 200, 100, 0.6);
  border-color: rgba(255, 200, 100, 0.9);
}

.dash-text {
  display: block;
  font-size: 12px;
}

.dash-count {
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 16px;
  font-weight: bold;
}
</style>