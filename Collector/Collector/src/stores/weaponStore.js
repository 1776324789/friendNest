import { ref } from 'vue'
import { defineStore } from 'pinia'

export const weaponStore = defineStore('weapon', () => {
  // 后备弹药
  const reserveAmmo = ref(500)
  
  // 当前武器
  const currentWeapon = ref(null)
  
  // 武器列表（最多 3 把）
  const weapons = ref([])
  const maxWeapons = 3
  
  /**
   * 武器类
   */
  class Weapon {
    constructor(config) {
      this.name = config.name || '武器'
      this.magazineSize = config.magazineSize || 30        // 弹夹容量
      this.currentAmmo = config.magazineSize                // 当前弹夹子弹
      this.fireRate = config.fireRate || 10                 // 射速（发/秒）
      this.reloadTime = config.reloadTime || 2              // 换弹时间（秒）
      this.isReloading = false                              // 是否正在换弹
      this.reloadProgress = 0                               // 换弹进度
      this.lastFireTime = 0                                 // 上次射击时间
      this.damage = config.damage || 10                     // 武器伤害
      this.bulletConfig = config.bulletConfig || {}         // 子弹配置
    }
    
    /**
     * 尝试射击
     */
    canFire(timestamp) {
      if (this.isReloading) return false
      if (this.currentAmmo <= 0) return false
      
      const timeSinceLastFire = timestamp - this.lastFireTime
      const minFireInterval = 1000 / this.fireRate
      
      return timeSinceLastFire >= minFireInterval
    }
    
    /**
     * 射击
     */
    fire(timestamp) {
      if (!this.canFire(timestamp)) return null
      
      this.currentAmmo--
      this.lastFireTime = timestamp
      
      return { ...this.bulletConfig, damage: this.damage }
    }
    
    /**
     * 开始换弹
     */
    startReload() {
      if (this.isReloading || this.currentAmmo === this.magazineSize) return false
      this.isReloading = true
      this.reloadProgress = 0
      return true
    }
    
    /**
     * 更新换弹进度
     */
    updateReload(deltaTime) {
      if (!this.isReloading) return false
      
      this.reloadProgress += deltaTime
      
      if (this.reloadProgress >= this.reloadTime) {
        this.finishReload()
        return true
      }
      return false
    }
    
    /**
     * 完成换弹
     */
    finishReload() {
      this.isReloading = false
      this.reloadProgress = 0
      this.currentAmmo = this.magazineSize
    }
    
    /**
     * 取消换弹
     */
    cancelReload() {
      this.isReloading = false
      this.reloadProgress = 0
    }
  }
  
  /**
   * 创建武器
   */
  function createWeapon(config) {
    if (weapons.value.length >= maxWeapons) {
      return null
    }
    const weapon = new Weapon(config)
    weapons.value.push(weapon)
    return weapon
  }
  
  /**
   * 装备武器
   */
  function equipWeapon(weapon) {
    currentWeapon.value = weapon
  }
  
  /**
   * 切换到指定武器
   */
  function switchToWeapon(index) {
    if (index >= 0 && index < weapons.value.length) {
      // 如果当前武器正在换弹，取消换弹
      if (currentWeapon.value?.isReloading) {
        currentWeapon.value.isReloading = false
        currentWeapon.value.reloadProgress = 0
      }
      
      currentWeapon.value = weapons.value[index]
      
      // 如果切换的武器弹夹为空，自动换弹
      if (currentWeapon.value.currentAmmo === 0 && !currentWeapon.value.isReloading) {
        currentWeapon.value.startReload()
      }
    }
  }
  
  /**
   * 获取武器插槽信息
   */
  function getWeaponSlots() {
    return weapons.value.map((weapon, index) => ({
      index,
      name: weapon.name,
      hasWeapon: true,
      active: currentWeapon.value === weapon,
      number: index + 1
    }))
  }
  
  /**
   * 获取当前武器
   */
  function getCurrentWeapon() {
    return currentWeapon.value
  }
  
  /**
   * 尝试射击
   */
  function tryFire(timestamp) {
    if (!currentWeapon.value) return null
    return currentWeapon.value.fire(timestamp)
  }
  
  /**
   * 开始换弹
   */
  function startReload() {
    if (!currentWeapon.value) return false
    return currentWeapon.value.startReload()
  }
  
  /**
   * 更新换弹
   */
  function updateReload(deltaTime) {
    if (!currentWeapon.value) return false
    return currentWeapon.value.updateReload(deltaTime)
  }
  
  /**
   * 获取后备弹药
   */
  function getReserveAmmo() {
    return reserveAmmo.value
  }
  
  /**
   * 设置后备弹药
   */
  function setReserveAmmo(value) {
    reserveAmmo.value = value
  }
  
  return {
    weapons,
    currentWeapon,
    reserveAmmo,
    maxWeapons,
    createWeapon,
    equipWeapon,
    switchToWeapon,
    getWeaponSlots,
    getCurrentWeapon,
    tryFire,
    startReload,
    updateReload,
    getReserveAmmo,
    setReserveAmmo
  }
})
