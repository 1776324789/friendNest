import { ref } from 'vue'
import { defineStore } from 'pinia'

export const bulletStore = defineStore('bullet', () => {
  // 所有子弹数组
  const bullets = ref([])
  // 对象池（复用的子弹）
  const bulletPool = ref([])
  // 对象池最大大小
  const maxPoolSize = 100
  
  // 尾迹点对象池
  const trailPointPool = []
  const maxTrailPointPool = 500
  
  function getTrailPoint() {
    if (trailPointPool.length > 0) {
      return trailPointPool.pop()
    }
    return { x: 0, y: 0, age: 0 }
  }
  
  function returnTrailPoint(point) {
    if (trailPointPool.length < maxTrailPointPool) {
      point.x = 0
      point.y = 0
      point.age = 0
      trailPointPool.push(point)
    }
  }
  
  /**
   * 子弹类
   * 包含子弹的所有属性和行为
   */
  class Bullet {
    constructor(config = {}) {
      this.x = 0                      // X 坐标
      this.y = 0                      // Y 坐标
      this.vx = 0                     // X 方向单位向量
      this.vy = 0                     // Y 方向单位向量
      this.speed = config.speed ?? 800        // 子弹速度
      this.radius = config.radius ?? 3        // 子弹半径
      this.active = false             // 是否激活
      this.damage = config.damage ?? 10       // 伤害值
      this.color = config.color ?? '#FFD700'  // 子弹颜色
      this.lifeTime = config.lifeTime ?? 3    // 生命周期（秒）
      this.maxDistance = config.maxDistance ?? 2000  // 最大飞行距离
      this.age = 0                    // 当前存在时间
      this.trailLength = config.trailLength ?? 5  // 尾迹长度
      this.trail = []                 // 尾迹点数组
      this.trailColor = config.trailColor ?? 'rgba(255, 200, 100, 0.6)' // 尾迹颜色
      this.trailIndex = 0             // 尾迹循环索引
      this.startX = 0                 // 发射位置 X
      this.startY = 0                 // 发射位置 Y
    }
    
    /**
     * 初始化子弹
     */
    init(x, y, vx, vy, config = {}) {
      this.startX = x
      this.startY = y
      this.x = x
      this.y = y
      this.vx = vx
      this.vy = vy
      this.speed = config.speed ?? this.speed
      this.radius = config.radius ?? this.radius
      this.color = config.color ?? this.color
      this.trailLength = config.trailLength ?? this.trailLength
      this.trailColor = config.trailColor ?? this.trailColor
      this.maxDistance = config.maxDistance ?? this.maxDistance
      this.active = true
      this.age = 0
      this.trailIndex = 0
      
      // 初始化尾迹数组（预分配）
      if (this.trail.length === 0) {
        for (let i = 0; i < this.trailLength; i++) {
          this.trail.push(getTrailPoint())
        }
      }
      
      // 重置尾迹点
      for (let i = 0; i < this.trailLength; i++) {
        this.trail[i].x = x
        this.trail[i].y = y
        this.trail[i].age = 0
      }
    }
    
    /**
     * 更新子弹状态
     */
    update(deltaTime) {
      // 使用循环数组记录尾迹，避免 push/shift
      const trailPoint = this.trail[this.trailIndex]
      trailPoint.x = this.x
      trailPoint.y = this.y
      trailPoint.age = 0
      
      this.trailIndex = (this.trailIndex + 1) % this.trailLength
      
      // 更新位置
      this.x += this.vx * this.speed * deltaTime
      this.y += this.vy * this.speed * deltaTime
      this.age += deltaTime
      
      // 更新尾迹年龄
      for (let i = 0; i < this.trailLength; i++) {
        this.trail[i].age += deltaTime
      }
      
      // 计算飞行距离
      const dx = this.x - this.startX
      const dy = this.y - this.startY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // 超过最大距离或生命周期结束，停用子弹
      if (distance > this.maxDistance || this.age >= this.lifeTime) {
        this.active = false
      }
    }
    
    /**
     * 重置子弹
     */
    reset() {
      this.active = false
      this.x = 0
      this.y = 0
      this.vx = 0
      this.vy = 0
      this.age = 0
      this.trailIndex = 0
      // 不释放尾迹点，下次复用时重用
    }
  }
  
  /**
   * 从对象池获取子弹，或创建新子弹
   */
  function getBullet() {
    if (bulletPool.value.length > 0) {
      return bulletPool.value.pop()
    }
    
    // 限制最大子弹数量
    if (bullets.value.length < 1000) {
      const bullet = new Bullet()
      bullets.value.push(bullet)
      return bullet
    }
    
    return null
  }
  
  /**
   * 回收子弹到对象池
   */
  function returnBullet(bullet) {
    bullet.reset()
    if (bulletPool.value.length < maxPoolSize) {
      bulletPool.value.push(bullet)
    }
  }
  
  /**
   * 发射子弹
   */
  function shoot(x, y, directionX, directionY, config = {}) {
    const bullet = getBullet()
    if (bullet) {
      const length = Math.sqrt(directionX * directionX + directionY * directionY)
      if (length > 0) {
        bullet.init(x, y, directionX / length, directionY / length, config)
      }
    }
    return bullet
  }
  
  /**
   * 更新所有子弹
   */
  function updateBullets(deltaTime) {
    for (const bullet of bullets.value) {
      if (bullet.active) {
        bullet.update(deltaTime)
      }
    }
  }
  
  /**
   * 获取所有活跃子弹
   */
  function getActiveBullets() {
    return bullets.value.filter(b => b.active)
  }
  
  /**
   * 清除所有子弹
   */
  function clearBullets() {
    for (const bullet of bullets.value) {
      if (bullet.active) {
        returnBullet(bullet)
      }
    }
  }
  
  /**
   * 获取活跃子弹数量
   */
  function getBulletCount() {
    return bullets.value.filter(b => b.active).length
  }
  
  return {
    bullets,
    getBullet,
    returnBullet,
    shoot,
    updateBullets,
    getActiveBullets,
    clearBullets,
    getBulletCount
  }
})
