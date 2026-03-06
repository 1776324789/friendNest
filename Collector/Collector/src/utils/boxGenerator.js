// 生成箱子等级的函数，等级越高，概率越低，呈指数下降
export function generateBoxLevel() {
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);
  const probabilities = levels.map(level => Math.exp(-0.5 * level));
  const totalProbability = probabilities.reduce((sum, p) => sum + p, 0);
  const normalizedProbabilities = probabilities.map(p => p / totalProbability);
  
  let random = Math.random();
  let cumulativeProbability = 0;
  
  for (let i = 0; i < levels.length; i++) {
    cumulativeProbability += normalizedProbabilities[i];
    if (random <= cumulativeProbability) {
      return levels[i];
    }
  }
  
  return 1; // 默认返回最低等级
}

// 生成物品数量的函数，箱子等级越高，物品越多
export function generateItemCount(boxLevel) {
  return Math.floor(boxLevel * 0.8) + 1;
}

// 生成物品等级的函数，箱子等级越高，物品品质越高，且高等级物品生成概率呈指数下降
export function generateItemLevel(boxLevel) {
  const maxLevel = Math.min(boxLevel * 2, 20);
  const minLevel = 1;
  
  // 生成物品等级，高等级物品概率呈指数下降
  const levels = Array.from({ length: maxLevel - minLevel + 1 }, (_, i) => i + minLevel);
  const probabilities = levels.map(level => Math.exp(-0.3 * level));
  const totalProbability = probabilities.reduce((sum, p) => sum + p, 0);
  const normalizedProbabilities = probabilities.map(p => p / totalProbability);
  
  let random = Math.random();
  let cumulativeProbability = 0;
  
  for (let i = 0; i < levels.length; i++) {
    cumulativeProbability += normalizedProbabilities[i];
    if (random <= cumulativeProbability) {
      return levels[i];
    }
  }
  
  return minLevel; // 默认返回最低等级
}

// 生成箱子数据的主函数
export function generateBox() {
  const boxLevel = generateBoxLevel();
  const itemCount = generateItemCount(boxLevel);
  const items = Array.from({ length: itemCount }, () => ({
    level: generateItemLevel(boxLevel)
  }));
  
  return {
    boxLevel,
    items
  };
}

// 生成多个箱子的函数
export function generateMultipleBoxes(count) {
  return Array.from({ length: count }, () => generateBox());
}