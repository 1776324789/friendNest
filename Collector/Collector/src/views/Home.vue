<template>
  <div class="game-container">
    <GameRenderer 
      ref="renderer"
      :cameraOffsetX="cameraOffsetX"
      :cameraOffsetY="cameraOffsetY"
    />
    <Joystick @update="onJoystickUpdate" />
    <DashButton 
      @dash="onDash"
      :dashCount="dashCount"
      :isRecharging="isRecharging"
    />
    <ReloadButton 
      @reload="onReload" 
      :isReloading="isReloading" 
      :reloadProgress="reloadProgress" 
    />
    <ShootingButton @shoot="onShoot" />
    <WeaponDisplay 
      :weaponName="weaponName"
      :currentAmmo="currentAmmo"
      :magazineSize="magazineSize"
      :reserveAmmo="reserveAmmo"
      :isReloading="isReloading"
      :reloadProgress="reloadProgressPercent"
      :weaponSlots="weaponSlots"
      :switchToWeapon="switchToWeapon"
    />
    <div class="info-panel">
      <div>FPS: {{ fps }}</div>
      <div>位置：({{ playerX.toFixed(1) }}, {{ playerY.toFixed(1) }})</div>
      <div>网格渲染：{{ avgGridTime.toFixed(2) }}ms</div>
      <div>子弹渲染：{{ avgBulletTime.toFixed(2) }}ms</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { playerStore } from '../stores/playerStore.js';
import { bulletStore } from '../stores/bulletStore.js';
import { weaponStore } from '../stores/weaponStore.js';
import { enemyStore } from '../stores/enemyStore.js';
import Joystick from '../components/Joystick.vue';
import ShootingButton from '../components/ShootingButton.vue';
import ReloadButton from '../components/ReloadButton.vue';
import WeaponDisplay from '../components/WeaponDisplay.vue';
import DashButton from '../components/DashButton.vue';
import GameRenderer from '../components/GameRenderer.vue';

// Store
const player = playerStore();
const bullets = bulletStore();
const weapons = weaponStore();
const enemies = enemyStore();

// 渲染器引用
const renderer = ref(null);

// 武器数据
const weaponName = computed(() => weapons.currentWeapon?.name || '无武器');
const currentAmmo = computed(() => weapons.currentWeapon?.currentAmmo || 0);
const magazineSize = computed(() => weapons.currentWeapon?.magazineSize || 0);
const reserveAmmo = computed(() => weapons.getReserveAmmo());
const isReloading = computed(() => weapons.currentWeapon?.isReloading || false);
const reloadProgress = computed(() => weapons.currentWeapon?.reloadProgress || 0);
const reloadProgressPercent = computed(() => {
  if (!weapons.currentWeapon) return 0;
  return (reloadProgress.value / weapons.currentWeapon.reloadTime) * 100;
});
const weaponSlots = computed(() => weapons.getWeaponSlots());

// 冲刺状态
const dashCount = computed(() => player.getCurrentDashCount());
const isRecharging = computed(() => player.getCurrentDashCount() < player.getMaxDashCount());

// 切换武器
function switchToWeapon(index) {
  weapons.switchToWeapon(index);
}

// 射击状态
let isFiring = ref(false);

// 摇杆数据
let joystickData = { x: 0, y: 0, intensity: 0, direction: '静止' };

// 射击摇杆数据
let shootingData = { x: 0, y: 0, intensity: 0 };

// 镜头偏移
let cameraOffsetX = 0;
let cameraOffsetY = 0;

// 时间追踪
let lastTime = 0;
let frameCount = 0;
let fps = ref(0);
let lastFpsUpdate = 0;

// 性能计时
let gridRenderTime = 0;
let bulletRenderTime = 0;
let avgGridTime = 0;
let avgBulletTime = 0;

// 玩家位置（用于 UI 显示）
const playerX = computed(() => player.getX());
const playerY = computed(() => player.getY());

/**
 * 更新镜头偏移
 */
function updateCamera(deltaTime) {
  const vx = player.getVx();
  const vy = player.getVy();
  const maxSpeed = player.getMaxSpeed();
  
  let targetOffsetX = 0;
  let targetOffsetY = 0;
  
  const shootIntensity = Math.sqrt(shootingData.x * shootingData.x + shootingData.y * shootingData.y);
  if (shootIntensity >= 0.1) {
    targetOffsetX = -shootingData.x * 130;
    targetOffsetY = -shootingData.y * 130;
  } else {
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed >= 1) {
      targetOffsetX = -(vx / maxSpeed) * 130;
      targetOffsetY = -(vy / maxSpeed) * 130;
    }
  }
  
  const smoothFactor = 5 * deltaTime;
  cameraOffsetX += (targetOffsetX - cameraOffsetX) * smoothFactor;
  cameraOffsetY += (targetOffsetY - cameraOffsetY) * smoothFactor;
}

/**
 * 更新玩家物理
 */
function updatePhysics(deltaTime) {
  const targetSpeed = player.getMaxSpeed();
  
  let newVx = player.getVx();
  let newVy = player.getVy();
  
  player.updateDash(deltaTime);
  
  if (player.getIsDashing()) {
    return;
  }
  
  if (joystickData.intensity >= 0.1) {
    const targetVx = joystickData.x * targetSpeed;
    const targetVy = joystickData.y * targetSpeed;
    
    const dx = targetVx - newVx;
    const dy = targetVy - newVy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    const accelAmount = targetSpeed * 5 * deltaTime;
    
    if (dist > accelAmount) {
      const ratio = accelAmount / dist;
      newVx += dx * ratio;
      newVy += dy * ratio;
    } else {
      newVx = targetVx;
      newVy = targetVy;
    }
  } else {
    const speed = Math.sqrt(newVx * newVx + newVy * newVy);
    
    if (speed > 0) {
      const decelAmount = targetSpeed * 8 * deltaTime;
      
      if (speed > decelAmount) {
        const ratio = (speed - decelAmount) / speed;
        newVx *= ratio;
        newVy *= ratio;
      } else {
        newVx = 0;
        newVy = 0;
      }
    }
  }
  
  const currentSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
  if (currentSpeed > targetSpeed) {
    const ratio = targetSpeed / currentSpeed;
    newVx *= ratio;
    newVy *= ratio;
  }
  
  player.setVelocity(newVx, newVy);
  player.updatePosition(deltaTime);
}

/**
 * 射击处理
 */
function onShoot(isPressed, dirX, dirY) {
  isFiring.value = isPressed;
  if (isPressed) {
    shootingData.x = dirX;
    shootingData.y = dirY;
    shootingData.intensity = Math.sqrt(dirX * dirX + dirY * dirY);
  } else {
    shootingData.x = 0;
    shootingData.y = 0;
    shootingData.intensity = 0;
  }
}

function tryFire(timestamp) {
  if (!isFiring.value) return;
  
  const bulletConfig = weapons.tryFire(timestamp);
  if (!bulletConfig) {
    if (weapons.currentWeapon?.currentAmmo === 0 && !weapons.currentWeapon?.isReloading) {
      weapons.startReload();
    }
    return;
  }
  
  const playerX = player.getX();
  const playerY = player.getY();
  
  let dirX = shootingData.x;
  let dirY = shootingData.y;
  
  const intensity = Math.sqrt(dirX * dirX + dirY * dirY);
  if (intensity < 0.1) {
    const vx = player.getVx();
    const vy = player.getVy();
    const speed = Math.sqrt(vx * vx + vy * vy);
    if (speed >= 1) {
      dirX = vx / speed;
      dirY = vy / speed;
    } else {
      dirX = 0;
      dirY = -1;
    }
  }
  
  bullets.shoot(playerX, playerY, dirX, dirY, bulletConfig);
}

/**
 * 换弹处理
 */
function onReload() {
  weapons.startReload();
}

/**
 * 冲刺处理
 */
function onDash() {
  const vx = player.getVx();
  const vy = player.getVy();
  const speed = Math.sqrt(vx * vx + vy * vy);
  
  let dirX = vx;
  let dirY = vy;
  
  if (speed < 1) {
    dirX = shootingData.x;
    dirY = shootingData.y;
    
    const shootIntensity = Math.sqrt(dirX * dirX + dirY * dirY);
    if (shootIntensity < 0.1) {
      dirX = joystickData.x;
      dirY = joystickData.y;
    }
    
    const len = Math.sqrt(dirX * dirX + dirY * dirY);
    if (len > 0) {
      dirX = dirX / len;
      dirY = dirY / len;
    }
  } else {
    dirX = dirX / speed;
    dirY = dirY / speed;
  }
  
  player.startDash(dirX, dirY);
}

/**
 * 检测子弹与敌人碰撞
 */
function checkBulletEnemyCollisions() {
  const activeBullets = bullets.getActiveBullets();
  const activeEnemies = enemies.getActiveEnemies();
  
  for (const bullet of activeBullets) {
    for (const enemy of activeEnemies) {
      if (!bullet.active || !enemy.active) continue
      
      const dx = bullet.x - enemy.x;
      const dy = bullet.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < bullet.radius + enemy.radius) {
        const killed = enemy.takeDamage(bullet.damage);
        bullet.active = false;
        
        if (killed) {
          enemies.returnEnemy(enemy);
        }
        break;
      }
    }
  }
}

/**
 * 主渲染循环
 */
function render(timestamp) {
  if (lastTime === 0) {
    lastTime = timestamp;
  }
  
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  
  frameCount++;
  if (timestamp - lastFpsUpdate >= 1000) {
    fps.value = frameCount;
    frameCount = 0;
    lastFpsUpdate = timestamp;
    
    avgGridTime = avgGridTime * 0.9 + gridRenderTime * 0.1;
    avgBulletTime = avgBulletTime * 0.9 + bulletRenderTime * 0.1;
  }
  
  updatePhysics(deltaTime);
  updateCamera(deltaTime);
  bullets.updateBullets(deltaTime);
  weapons.updateReload(deltaTime);
  enemies.updateEnemies(deltaTime, player.getX(), player.getY());
  
  tryFire(timestamp);
  checkBulletEnemyCollisions();
  
  renderer.value.draw();
  
  requestAnimationFrame(render);
}

/**
 * 摇杆数据更新回调
 */
function onJoystickUpdate(data) {
  joystickData = data;
}

/**
 * 处理窗口大小变化
 */
function handleResize() {
  renderer.value.resize();
}

// 初始化
onMounted(() => {
  const testWeapon1 = weapons.createWeapon({
    name: '突击步枪',
    magazineSize: 30,
    fireRate: 10,
    reloadTime: 2,
    damage: 15,
    bulletConfig: {
      speed: 1000,
      radius: 3,
      trailLength: 8,
      color: '#FFD700',
      trailColor: 'rgba(255, 200, 100, 0.6)',
      maxDistance: 2000
    }
  });
  
  const testWeapon2 = weapons.createWeapon({
    name: '冲锋枪',
    magazineSize: 50,
    fireRate: 8,
    reloadTime: 2.5,
    damage: 8,
    bulletConfig: {
      speed: 800,
      radius: 2,
      trailLength: 5,
      color: '#00FF00',
      trailColor: 'rgba(0, 255, 0, 0.6)',
      maxDistance: 1500
    }
  });
  
  const testWeapon3 = weapons.createWeapon({
    name: '狙击枪',
    magazineSize: 5,
    fireRate: 2,
    reloadTime: 3,
    damage: 50,
    bulletConfig: {
      speed: 1500,
      radius: 4,
      trailLength: 10,
      color: '#FF0000',
      trailColor: 'rgba(255, 0, 0, 0.6)',
      maxDistance: 3000
    }
  });
  
  weapons.equipWeapon(testWeapon1);
  
  const playerX = player.getX();
  const playerY = player.getY();
  enemies.spawnEnemy(playerX + 300, playerY, {
    speed: 50,
    radius: 10,
    maxHP: 50,
    color: '#FF0000'
  });
  
  renderer.value.init();
  render(0);
  
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.game-container {
  width: 100vw;
  height: 100vh;
  background-color: #2c3e50;
  position: relative;
  overflow: hidden;
}

canvas {
  display: block;
}

.info-panel {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 12px;
  border-radius: 5px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  z-index: 30;
  min-width: 150px;
  line-height: 1.4;
}

.info-panel div {
  margin: 3px 0;
}
</style>
