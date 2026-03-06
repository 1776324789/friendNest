import { ref } from 'vue'
import { defineStore } from 'pinia'

export const enemyStore = defineStore('enemy', () => {
  const enemies = ref([])
  const enemyPool = ref([])
  const maxPoolSize = 50
  
  class Enemy {
    constructor(config = {}) {
      this.x = config.x ?? 0
      this.y = config.y ?? 0
      this.speed = config.speed ?? 50
      this.radius = config.radius ?? 10
      this.active = false
      this.maxHP = config.maxHP ?? 50
      this.currentHP = config.currentHP ?? 50
      this.maxArmor = config.maxArmor ?? 0
      this.currentArmor = config.currentArmor ?? 0
      this.damage = config.damage ?? 10
      this.color = config.color ?? '#FF0000'
    }
    
    init(x, y, config = {}) {
      this.x = x
      this.y = y
      this.speed = config.speed ?? this.speed
      this.radius = config.radius ?? this.radius
      this.maxHP = config.maxHP ?? this.maxHP
      this.currentHP = config.currentHP ?? this.maxHP
      this.maxArmor = config.maxArmor ?? this.maxArmor
      this.currentArmor = config.currentArmor ?? this.maxArmor
      this.damage = config.damage ?? this.damage
      this.color = config.color ?? this.color
      this.active = true
    }
    
    update(deltaTime, playerX, playerY) {
      if (!this.active) return
      
      // 计算到玩家的方向
      const dx = playerX - this.x
      const dy = playerY - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance > 0) {
        // 归一化并移动
        const dirX = dx / distance
        const dirY = dy / distance
        
        this.x += dirX * this.speed * deltaTime
        this.y += dirY * this.speed * deltaTime
      }
    }
    
    takeDamage(damage) {
      // 先扣除护甲
      let remainingDamage = damage
      if (this.currentArmor > 0) {
        const armorDamage = Math.min(this.currentArmor, damage)
        this.currentArmor -= armorDamage
        remainingDamage = damage - armorDamage * 0.5 // 护甲减少 50% 伤害
      }
      
      // 再扣除生命值
      this.currentHP -= remainingDamage
      if (this.currentHP <= 0) {
        this.active = false
        return true
      }
      return false
    }
    
    reset() {
      this.active = false
      this.x = 0
      this.y = 0
      this.currentHP = this.maxHP
      this.currentArmor = this.maxArmor
    }
  }
  
  function getEnemy() {
    if (enemyPool.value.length > 0) {
      return enemyPool.value.pop()
    }
    
    if (enemies.value.length < 200) {
      const enemy = new Enemy()
      enemies.value.push(enemy)
      return enemy
    }
    
    return null
  }
  
  function returnEnemy(enemy) {
    enemy.reset()
    if (enemyPool.value.length < maxPoolSize) {
      enemyPool.value.push(enemy)
    }
  }
  
  function spawnEnemy(x, y, config = {}) {
    const enemy = getEnemy()
    if (enemy) {
      enemy.init(x, y, config)
    }
    return enemy
  }
  
  function updateEnemies(deltaTime, playerX, playerY) {
    for (const enemy of enemies.value) {
      if (enemy.active) {
        enemy.update(deltaTime, playerX, playerY)
      }
    }
  }
  
  function getActiveEnemies() {
    return enemies.value.filter(e => e.active)
  }
  
  function clearEnemies() {
    for (const enemy of enemies.value) {
      if (enemy.active) {
        returnEnemy(enemy)
      }
    }
  }
  
  function getEnemyCount() {
    return enemies.value.filter(e => e.active).length
  }
  
  return {
    enemies,
    getEnemy,
    returnEnemy,
    spawnEnemy,
    updateEnemies,
    getActiveEnemies,
    clearEnemies,
    getEnemyCount
  }
})
