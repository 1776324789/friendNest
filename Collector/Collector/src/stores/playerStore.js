import { ref } from 'vue'
import { defineStore } from 'pinia'

export const playerStore = defineStore('player', () => {

  const x = ref(0)
  const y = ref(0)
  const vx = ref(0)
  const vy = ref(0)
  const maxSpeed = ref(300)
  const acceleration = ref(1500)
  const deceleration = ref(1500)
  
  // 生命值和护甲值
  const maxHP = ref(100)
  const currentHP = ref(100)
  const maxArmor = ref(100)
  const currentArmor = ref(0)
  
  // 冲刺相关
  const maxDashCount = ref(2)
  const currentDashCount = ref(2)
  const dashCooldown = ref(3)
  const dashDistance = ref(100)
  const dashSpeed = ref(800)
  const isDashing = ref(false)
  const dashProgress = ref(0)
  const dashStartX = ref(0)
  const dashStartY = ref(0)
  const dashDirX = ref(0)
  const dashDirY = ref(0)
  const rechargeTimer = ref(0)
  
  function getX() {
    return x.value
  }
  
  function getY() {
    return y.value
  }
  
  function setX(newX) {
    x.value = newX
  }
  
  function setY(newY) {
    y.value = newY
  }
  
  function getVx() {
    return vx.value
  }
  
  function getVy() {
    return vy.value
  }
  
  function setVx(newVx) {
    vx.value = newVx
  }
  
  function setVy(newVy) {
    vy.value = newVy
  }
  
  function getMaxSpeed() {
    return maxSpeed.value
  }
  
  function setMaxSpeed(newMaxSpeed) {
    maxSpeed.value = newMaxSpeed
  }
  
  function getAcceleration() {
    return acceleration.value
  }
  
  function setAcceleration(newAcceleration) {
    acceleration.value = newAcceleration
  }
  
  function getDeceleration() {
    return deceleration.value
  }
  
  function setDeceleration(newDeceleration) {
    deceleration.value = newDeceleration
  }
  
  function getPosition() {
    return { x: x.value, y: y.value }
  }
  
  function getVelocity() {
    return { x: vx.value, y: vy.value }
  }
  
  function setPosition(newX, newY) {
    x.value = newX
    y.value = newY
  }
  
  function setVelocity(newVx, newVy) {
    vx.value = newVx
    vy.value = newVy
  }
  
  function updatePosition(deltaTime) {
    x.value += vx.value * deltaTime
    y.value += vy.value * deltaTime
  }
  
  // 生命值相关
  function getMaxHP() {
    return maxHP.value
  }
  
  function getCurrentHP() {
    return currentHP.value
  }
  
  function setCurrentHP(value) {
    currentHP.value = Math.max(0, Math.min(value, maxHP.value))
  }
  
  function setMaxHP(value) {
    maxHP.value = value
    currentHP.value = Math.min(currentHP.value, value)
  }
  
  function takeDamage(damage) {
    // 先扣除护甲
    let remainingDamage = damage
    if (currentArmor.value > 0) {
      const armorDamage = Math.min(currentArmor.value, damage)
      currentArmor.value -= armorDamage
      remainingDamage = damage - armorDamage * 0.5 // 护甲减少 50% 伤害
    }
    
    // 再扣除生命值
    currentHP.value = Math.max(0, currentHP.value - remainingDamage)
  }
  
  function heal(amount) {
    currentHP.value = Math.min(maxHP.value, currentHP.value + amount)
  }
  
  // 护甲相关
  function getMaxArmor() {
    return maxArmor.value
  }
  
  function getCurrentArmor() {
    return currentArmor.value
  }
  
  function setCurrentArmor(value) {
    currentArmor.value = Math.max(0, Math.min(value, maxArmor.value))
  }
  
  function setMaxArmor(value) {
    maxArmor.value = value
    currentArmor.value = Math.min(currentArmor.value, value)
  }
  
  function addArmor(amount) {
    currentArmor.value = Math.min(maxArmor.value, currentArmor.value + amount)
  }
  
  // 冲刺相关
  function getMaxDashCount() {
    return maxDashCount.value
  }
  
  function getCurrentDashCount() {
    return currentDashCount.value
  }
  
  function getIsDashing() {
    return isDashing.value
  }
  
  function getDashProgress() {
    return dashProgress.value
  }
  
  function startDash(vx, vy) {
    if (currentDashCount.value <= 0 || isDashing.value) return false
    
    currentDashCount.value--
    isDashing.value = true
    dashProgress.value = 0
    
    // 记录冲刺起点和方向
    dashStartX.value = x.value
    dashStartY.value = y.value
    dashDirX.value = vx
    dashDirY.value = vy
    
    return true
  }
  
  function updateDash(deltaTime) {
    if (isDashing.value) {
      // 计算当前冲刺位置
      dashProgress.value += deltaTime * dashSpeed.value
      
      if (dashProgress.value >= dashDistance.value) {
        // 冲刺结束
        isDashing.value = false
        dashProgress.value = 0
      } else {
        // 更新位置
        const progress = dashProgress.value / dashDistance.value
        x.value = dashStartX.value + dashDirX.value * dashProgress.value
        y.value = dashStartY.value + dashDirY.value * dashProgress.value
      }
    }
    
    // 恢复冲刺次数
    if (currentDashCount.value < maxDashCount.value) {
      rechargeTimer.value += deltaTime
      
      if (rechargeTimer.value >= dashCooldown.value) {
        currentDashCount.value++
        rechargeTimer.value = 0
      }
    }
  }
  
  return {
    getX,
    getY,
    setX,
    setY,
    getVx,
    getVy,
    setVx,
    setVy,
    getMaxSpeed,
    setMaxSpeed,
    getAcceleration,
    setAcceleration,
    getDeceleration,
    setDeceleration,
    getPosition,
    getVelocity,
    setPosition,
    setVelocity,
    updatePosition,
    // 生命值和护甲
    getMaxHP,
    getCurrentHP,
    setCurrentHP,
    setMaxHP,
    takeDamage,
    heal,
    getMaxArmor,
    getCurrentArmor,
    setCurrentArmor,
    setMaxArmor,
    addArmor,
    // 冲刺
    getMaxDashCount,
    getCurrentDashCount,
    getIsDashing,
    getDashProgress,
    startDash,
    updateDash
  }
})
