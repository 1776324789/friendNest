<template>
  <div 
    class="joystick-zone" 
    ref="joystickZone"
    @touchstart="onZoneTouchStart"
    @touchmove="onZoneTouchMove"
    @touchend="onZoneTouchEnd"
    @touchcancel="onZoneTouchEnd"
    @mousedown="onZoneMouseDown"
    @mousemove="onZoneMouseMove"
    @mouseup="onZoneMouseUp"
    @mouseleave="onZoneMouseUp"
  >
    <div class="joystick-container" v-if="visible" :style="joystickContainerStyle">
      <div 
        class="joystick-background" 
        ref="joystickBackground"
      >
        <div 
          class="joystick-knob" 
          :style="joystickStyle"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const joystickZone = ref(null);
const joystickBackground = ref(null);

const visible = ref(false);
const isDragging = ref(false);
const knobPosition = ref({ x: 0, y: 0 });
const joystickPosition = ref({ x: 0, y: 0 });
const joystickSize = 120;
const knobSize = 40;
const maxDistance = (joystickSize - knobSize) / 2;
const activeTouchId = ref(null);

const emit = defineEmits(['update']);

const joystickContainerStyle = computed(() => {
  return {
    left: `${joystickPosition.value.x}px`,
    top: `${joystickPosition.value.y}px`,
    transform: 'translate(-50%, -50%)'
  };
});

const joystickStyle = computed(() => {
  return {
    transform: `translate(calc(-50% + ${knobPosition.value.x}px), calc(-50% + ${knobPosition.value.y}px))`
  };
});

function calculateJoystickPosition(clientX, clientY) {
  if (!joystickBackground.value) return null;
  
  const rect = joystickBackground.value.getBoundingClientRect();
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
  const intensity = Math.min(distance / maxDistance, 1);
  
  let direction;
  if (intensity < 0.1) {
    direction = '静止';
  } else {
    const angle = Math.atan2(y, x) * 180 / Math.PI;
    if (angle >= -45 && angle < 45) {
      direction = '右';
    } else if (angle >= 45 && angle < 135) {
      direction = '上';
    } else if (angle >= 135 || angle < -135) {
      direction = '左';
    } else {
      direction = '下';
    }
  }
  
  emit('update', { x, y, intensity, direction });
  
  return { x: newX, y: newY };
}

function showJoystick(clientX, clientY) {
  if (!joystickZone.value) return;
  
  const rect = joystickZone.value.getBoundingClientRect();
  joystickPosition.value = {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
  visible.value = true;
}

function onZoneTouchStart(event) {
  if (activeTouchId.value !== null) return;
  
  const touch = event.changedTouches[0];
  activeTouchId.value = touch.identifier;
  
  event.preventDefault();
  
  showJoystick(touch.clientX, touch.clientY);
  isDragging.value = true;
  knobPosition.value = { x: 0, y: 0 };
  emit('update', { x: 0, y: 0, intensity: 0, direction: '静止' });
}

function onZoneTouchMove(event) {
  if (!isDragging.value || activeTouchId.value === null) return;
  
  let touch = null;
  for (let i = 0; i < event.changedTouches.length; i++) {
    if (event.changedTouches[i].identifier === activeTouchId.value) {
      touch = event.changedTouches[i];
      break;
    }
  }
  
  if (!touch) return;
  
  event.preventDefault();
  const position = calculateJoystickPosition(touch.clientX, touch.clientY);
  if (position) {
    knobPosition.value = position;
  }
}

function onZoneTouchEnd(event) {
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
  isDragging.value = false;
  knobPosition.value = { x: 0, y: 0 };
  visible.value = false;
  emit('update', { x: 0, y: 0, intensity: 0, direction: '静止' });
}

function onZoneMouseDown(event) {
  event.preventDefault();
  showJoystick(event.clientX, event.clientY);
  isDragging.value = true;
  knobPosition.value = { x: 0, y: 0 };
  emit('update', { x: 0, y: 0, intensity: 0, direction: '静止' });
}

function onZoneMouseMove(event) {
  if (!isDragging.value) return;
  event.preventDefault();
  const position = calculateJoystickPosition(event.clientX, event.clientY);
  if (position) {
    knobPosition.value = position;
  }
}

function onZoneMouseUp(event) {
  event.preventDefault();
  isDragging.value = false;
  knobPosition.value = { x: 0, y: 0 };
  visible.value = false;
  emit('update', { x: 0, y: 0, intensity: 0, direction: '静止' });
}
</script>

<style scoped>
.joystick-zone {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 300px;
  height: 200px;
  z-index: 20;
  touch-action: none;
}

.joystick-container {
  position: absolute;
  z-index: 20;
  touch-action: none;
}

.joystick-background {
  width: 120px;
  height: 120px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  position: relative;
  touch-action: none;
  cursor: pointer;
}

.joystick-knob {
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  touch-action: none;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}
</style>