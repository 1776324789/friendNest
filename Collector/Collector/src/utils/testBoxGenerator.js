import { generateBox, generateMultipleBoxes } from './boxGenerator.js';

// 测试生成单个箱子
console.log('测试生成单个箱子:');
const box = generateBox();
console.log(box);

// 测试生成多个箱子
console.log('\n测试生成多个箱子:');
const boxes = generateMultipleBoxes(5);
boxes.forEach((box, index) => {
  console.log(`箱子 ${index + 1}:`, box);
});

// 测试箱子等级分布
console.log('\n测试箱子等级分布:');
const levelCount = Array(10).fill(0);
for (let i = 0; i < 1000; i++) {
  const box = generateBox();
  levelCount[box.boxLevel - 1]++;
}
levelCount.forEach((count, index) => {
  console.log(`等级 ${index + 1}: ${count} 次`);
});