<template>
  <canvas ref="gameCanvas"></canvas>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { playerStore } from '../stores/playerStore.js';
import { bulletStore } from '../stores/bulletStore.js';
import { enemyStore } from '../stores/enemyStore.js';

const props = defineProps({
  cameraOffsetX: Number,
  cameraOffsetY: Number
});

const gameCanvas = ref(null);
let ctx = null;
const gridSize = 200;

const player = playerStore();
const bullets = bulletStore();
const enemies = enemyStore();

// 暴露初始化方法
defineExpose({
  init,
  resize,
  draw
});

function init() {
  const canvas = gameCanvas.value;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d');
}

function resize() {
  const canvas = gameCanvas.value;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function draw() {
  if (!ctx || !gameCanvas.value) return;
  
  const canvas = gameCanvas.value;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawGrid();
  drawPlayer();
  drawBullets();
  drawEnemies();
}

function drawGrid() {
  const canvas = gameCanvas.value;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const playerX = player.getX();
  const playerY = player.getY();
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  
  const offsetX = centerX + props.cameraOffsetX - (playerX % gridSize);
  const offsetY = centerY + props.cameraOffsetY - (playerY % gridSize);
  
  for (let x = offsetX - gridSize; x < canvas.width + gridSize; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  for (let y = offsetY - gridSize; y < canvas.height + gridSize; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawPlayer() {
  const canvas = gameCanvas.value;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 12.5;
  
  const screenX = centerX + props.cameraOffsetX;
  const screenY = centerY + props.cameraOffsetY;
  
  ctx.beginPath();
  ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#87CEEB';
  ctx.fill();
  ctx.closePath();
  
  drawHealthBar(screenX, screenY - 20);
}

function drawHealthBar(x, y) {
  const barWidth = 60;
  const barHeight = 4;
  const gap = 6;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight);
  
  const hpPercent = player.getCurrentHP() / player.getMaxHP();
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(x - barWidth / 2, y, barWidth * hpPercent, barHeight);
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(x - barWidth / 2, y + barHeight + gap, barWidth, barHeight);
  
  const armorPercent = player.getCurrentArmor() / player.getMaxArmor();
  ctx.fillStyle = '#FFA500';
  ctx.fillRect(x - barWidth / 2, y + barHeight + gap, barWidth * armorPercent, barHeight);
}

function drawBullets() {
  const activeBullets = bullets.getActiveBullets();
  const canvas = gameCanvas.value;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const playerX = player.getX();
  const playerY = player.getY();
  
  const offsetX = centerX - playerX + props.cameraOffsetX;
  const offsetY = centerY - playerY + props.cameraOffsetY;
  
  for (const bullet of activeBullets) {
    if (bullet.trail.length > 0) {
      const trailPoint = bullet.trail[bullet.trailIndex];
      const screenStartX = trailPoint.x + offsetX;
      const screenStartY = trailPoint.y + offsetY;
      
      const screenEndX = bullet.x + offsetX;
      const screenEndY = bullet.y + offsetY;
      
      const gradient = ctx.createLinearGradient(screenStartX, screenStartY, screenEndX, screenEndY);
      gradient.addColorStop(0, 'rgba(255, 200, 100, 0)');
      gradient.addColorStop(1, 'rgba(255, 200, 100, 0.8)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = bullet.radius * 0.8;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(screenStartX, screenStartY);
      ctx.lineTo(screenEndX, screenEndY);
      ctx.stroke();
    }
    
    const screenX = bullet.x + offsetX;
    const screenY = bullet.y + offsetY;
    
    ctx.beginPath();
    ctx.arc(screenX, screenY, bullet.radius, 0, Math.PI * 2);
    ctx.fillStyle = bullet.color;
    ctx.fill();
    ctx.closePath();
  }
}

function drawEnemies() {
  const activeEnemies = enemies.getActiveEnemies();
  const canvas = gameCanvas.value;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const playerX = player.getX();
  const playerY = player.getY();
  
  const offsetX = centerX - playerX + props.cameraOffsetX;
  const offsetY = centerY - playerY + props.cameraOffsetY;
  
  for (const enemy of activeEnemies) {
    const screenX = enemy.x + offsetX;
    const screenY = enemy.y + offsetY;
    
    ctx.beginPath();
    ctx.arc(screenX, screenY, enemy.radius, 0, Math.PI * 2);
    ctx.fillStyle = enemy.color;
    ctx.fill();
    ctx.closePath();
    
    drawEnemyHealthBar(screenX, screenY - enemy.radius - 8, enemy);
  }
}

function drawEnemyHealthBar(x, y, enemy) {
  const barWidth = 40;
  const barHeight = 3;
  const gap = 4;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(x - barWidth / 2, y, barWidth, barHeight);
  
  const hpPercent = enemy.currentHP / enemy.maxHP;
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(x - barWidth / 2, y, barWidth * hpPercent, barHeight);
  
  if (enemy.maxArmor > 0) {
    const armorPercent = enemy.currentArmor / enemy.maxArmor;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x - barWidth / 2, y + barHeight + gap, barWidth, barHeight);
    ctx.fillStyle = '#0088FF';
    ctx.fillRect(x - barWidth / 2, y + barHeight + gap, barWidth * armorPercent, barHeight);
  }
}
</script>

<style scoped>
canvas {
  display: block;
}
</style>
