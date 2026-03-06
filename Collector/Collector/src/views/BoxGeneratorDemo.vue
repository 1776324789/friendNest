<template>
  <div class="home">
    <h1>箱子生成器</h1>
    <button @click="generateNewBox" class="generate-btn">生成箱子</button>
    <button @click="generateMultipleBoxes" class="generate-btn">生成5个箱子</button>
    
    <div v-if="currentBox" class="box-container">
      <h2>当前箱子</h2>
      <div class="box-info">
        <p>箱子等级: {{ currentBox.boxLevel }}</p>
        <p>物品数量: {{ currentBox.items.length }}</p>
      </div>
      <div class="items-list">
        <h3>物品列表</h3>
        <ul>
          <li v-for="(item, index) in currentBox.items" :key="index">
            物品等级: {{ item.level }}
          </li>
        </ul>
      </div>
    </div>
    
    <div v-if="boxes.length > 0" class="multiple-boxes">
      <h2>生成的箱子列表</h2>
      <div v-for="(box, index) in boxes" :key="index" class="box-item">
        <h3>箱子 {{ index + 1 }}</h3>
        <p>等级: {{ box.boxLevel }}, 物品数量: {{ box.items.length }}</p>
        <ul>
          <li v-for="(item, itemIndex) in box.items" :key="itemIndex">
            物品等级: {{ item.level }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { generateBox, generateMultipleBoxes as generateMultiple } from '../utils/boxGenerator.js';

const currentBox = ref(null);
const boxes = ref([]);

function generateNewBox() {
  currentBox.value = generateBox();
  boxes.value = []; // 清空多个箱子列表
}

function generateMultipleBoxes() {
  boxes.value = generateMultiple(5);
  currentBox.value = null; // 清空当前箱子
}
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

.generate-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
  font-size: 16px;
}

.generate-btn:hover {
  background-color: #45a049;
}

.box-container {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.box-info {
  margin-bottom: 15px;
}

.items-list ul {
  list-style-type: none;
  padding: 0;
}

.items-list li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
}

.multiple-boxes {
  margin-top: 20px;
}

.box-item {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.box-item ul {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
}

.box-item li {
  padding: 3px 0;
  border-bottom: 1px solid #eee;
}
</style>