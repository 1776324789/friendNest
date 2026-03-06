<template>
  <div class="weapon-info">
    <div>
        <div class="weapon-name">{{ weaponName }}</div>
        <div class="ammo-info">
        <span class="current-ammo">{{ currentAmmo }}</span>
        <span class="separator">/</span>
        <span class="magazine-size">{{ magazineSize }}</span>
        </div>
        <div class="reserve-ammo">后备：{{ reserveAmmo }}</div>
        <div class="reload-bar" v-if="isReloading">
        <div class="reload-progress" :style="{ width: reloadProgress + '%' }"></div>
        </div>
    </div>
    <div class="weapon-slots">
      <div 
        v-for="(slot, index) in weaponSlots" 
        :key="index"
        class="weapon-slot"
        :class="{ active: slot.active, empty: !slot.hasWeapon }"
        @click="switchToWeapon(index)"
      >
        {{ slot.number }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  weaponName: String,
  currentAmmo: Number,
  magazineSize: Number,
  reserveAmmo: Number,
  isReloading: Boolean,
  reloadProgress: Number,
  weaponSlots: Array,
  switchToWeapon: Function
})

defineEmits(['switchWeapon'])
</script>

<style scoped>
.weapon-info {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 15px;
  border-radius: 8px;
  text-align: center;
  z-index: 30;
  min-width: 180px;
}

.weapon-name {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 3px;
  color: #FFD700;
}

.ammo-info {
  font-size: 20px;
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

.current-ammo {
  color: #00FF00;
}

.separator {
  color: #888;
  margin: 0 3px;
}

.magazine-size {
  color: #FFFFFF;
}

.reserve-ammo {
  font-size: 10px;
  color: #888;
  margin-top: 2px;
}

.reload-bar {
  width: 100%;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin-top: 5px;
  overflow: hidden;
}

.reload-progress {
  height: 100%;
  background-color: #FFD700;
  transition: width 0.1s linear;
}

.weapon-slots {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 8px;
}

.weapon-slot {
  width: 25px;
  height: 25px;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.weapon-slot.active {
  background-color: rgba(255, 215, 0, 0.4);
  border-color: #FFD700;
  color: #FFD700;
}

.weapon-slot.empty {
  opacity: 0.3;
}

.weapon-slot:hover:not(.empty) {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>