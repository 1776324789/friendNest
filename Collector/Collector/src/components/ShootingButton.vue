<template>
  <div class="shooting-zone">
    <div 
      class="shooting-background" 
      ref="shootingBackground"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
    >
      <div style="pointer-events: none;"
        class="shooting-knob" 
        :style="shootingKnobStyle"
        :class="{ active: isFiring }"
      >
        <span v-if="!isFiring">射击</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const shootingBackground = ref(null);

const isFiring = ref(false);
const knobPosition = ref({ x: 0, y: 0 });
const shootingSize = 100;
const knobSize = 40;
const maxDistance = (shootingSize - knobSize) / 2;
const activeTouchId = ref(null);
const lastEmitPosition = ref({ x: 0, y: 0 });

const emit = defineEmits(['shoot']);

const shootingKnobStyle = computed(() => {
  return {
    transform: `translate(calc(-50% + ${knobPosition.value.x}px), calc(-50% + ${knobPosition.value.y}px))`
  };
});

function calculateShootingPosition(clientX, clientY) {
  if (!shootingBackground.value) return null;
  
  const rect = shootingBackground.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  let newX = clientX - centerX;
  let newY = clientY - centerY;
  
  const distance = Math.sqrt(newX * newX + newY * newY);
  
  if (distance > maxDistance) {
    const angle = Math.atan2(newY, newX);
    newX = Math.cos(angle) * maxDistance;
    newY = Math.sin(angle) * maxDistance;
  }
  
  const x = newX / maxDistance;
  const y = newY / maxDistance;
  
  return { x, y, newX, newY };
}

function onTouchStart(event) {
  if (activeTouchId.value !== null) return;
  
  const touch = event.changedTouches[0];
  activeTouchId.value = touch.identifier;
  
  event.preventDefault();
  
  const position = calculateShootingPosition(touch.clientX, touch.clientY);
  
  if (position) {
    isFiring.value = true;
    knobPosition.value = { x: position.newX, y: position.newY };
    lastEmitPosition.value = { x: position.x, y: position.y };
    emit('shoot', true, position.x, position.y);
  }
}

function onTouchMove(event) {
  if (activeTouchId.value === null) return;
  
  let touch = null;
  for (let i = 0; i < event.changedTouches.length; i++) {
    if (event.changedTouches[i].identifier === activeTouchId.value) {
      touch = event.changedTouches[i];
      break;
    }
  }
  
  if (!touch) return;
  
  event.preventDefault();
  
  const position = calculateShootingPosition(touch.clientX, touch.clientY);
  
  if (position && isFiring.value) {
    const diffX = Math.abs(position.x - lastEmitPosition.value.x);
    const diffY = Math.abs(position.y - lastEmitPosition.value.y);
    
    if (diffX > 0.05 || diffY > 0.05) {
      knobPosition.value = { x: position.newX, y: position.newY };
      lastEmitPosition.value = { x: position.x, y: position.y };
      emit('shoot', true, position.x, position.y);
    }
  }
}

function onTouchEnd(event) {
  if (activeTouchId.value === null) return;
  
  let touchFound = false;
  for (let i = 0; i < event.changedTouches.length; i++) {
    if (event.changedTouches[i].identifier === activeTouchId.value) {
      touchFound = true;
      break;
    }
  }
  
  if (!touchFound) return;
  
  event.preventDefault();
  
  activeTouchId.value = null;
  isFiring.value = false;
  knobPosition.value = { x: 0, y: 0 };
  emit('shoot', false, 0, 0);
}

function onMouseDown(event) {
  event.preventDefault();
  
  const position = calculateShootingPosition(event.clientX, event.clientY);
  
  if (position) {
    isFiring.value = true;
    knobPosition.value = { x: position.newX, y: position.newY };
    emit('shoot', true, position.x, position.y);
  }
}

function onMouseMove(event) {
  event.preventDefault();
  
  const position = calculateShootingPosition(event.clientX, event.clientY);
  
  if (position && isFiring.value) {
    const diffX = Math.abs(position.x - lastEmitPosition.value.x);
    const diffY = Math.abs(position.y - lastEmitPosition.value.y);
    
    if (diffX > 0.05 || diffY > 0.05) {
      knobPosition.value = { x: position.newX, y: position.newY };
      lastEmitPosition.value = { x: position.x, y: position.y };
      emit('shoot', true, position.x, position.y);
    }
  }
}

function onMouseUp(event) {
  event.preventDefault();
  
  isFiring.value = false;
  knobPosition.value = { x: 0, y: 0 };
  emit('shoot', false, 0, 0);
}
</script>

<style scoped>
.shooting-zone {
  position: absolute;
  bottom: 70px;
  right: 70px;
  z-index: 20;
  touch-action: none;
}

.shooting-background {
  width: 100px;
  height: 100px;
  background-color: rgba(255, 100, 100, 0.3);
  border-radius: 50%;
  position: relative;
  touch-action: none;
  cursor: pointer;
  border: 2px solid rgba(255, 100, 100, 0.6);
}

.shooting-knob {
  width: 40px;
  height: 40px;
  background-color: rgba(255, 100, 100, 0.8);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  touch-action: none;
  box-shadow: 0 0 10px rgba(255, 100, 100, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
  user-select: none;
}

.shooting-knob.active {
  background-color: rgba(255, 100, 100, 1);
}
</style>