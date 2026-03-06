<template>
    <div class="mainBlock">
        <!-- 初始提示文本：增加动画类 -->
        <div class="init-text bounce-in">查无此人！！</div>
        <div class="init-subtext slide-in">不过我认识一个叫<span class="highlight">YXB</span>的人，你是否是它？</div>

        <!-- 按钮区域：重写样式，增加点击动效 -->
        <div class="btn-group">
            <button class="btn yes-btn" @click="handleConfirm(true)" :class="{ shake: answer === true }">
                <span>是</span>
            </button>
            <button class="btn no-btn" @click="handleConfirm(false)" :class="{ shake: answer === false }">
                <span>不是</span>
            </button>
        </div>

        <!-- 根据选择展示不同文本：增加入场动画 -->
        <div v-if="answer === true" class="result-text welcome-text pop-in">
            原来是你来了啊...<span class="laugh">哈哈哈哈...</span>好欢迎啊...<span class="laugh">哈哈哈哈...</span>
        </div>
        <div v-if="answer === false" class="result-text refuse-text pop-in">
            呵，还不是...可以进来，<span class="angry">不准用厕所</span>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// 定义响应式变量，存储用户的选择（初始为null，不显示后续文本）
const answer = ref(null)

// 处理按钮点击事件的函数，增加震动反馈
const handleConfirm = (isYXB) => {
    // 将用户的选择赋值给响应式变量，触发页面更新
    answer.value = isYXB
    // // 震动后重置样式（可选）
    // setTimeout(() => {
    //     answer.value = null
    // }, 2000)
}
</script>

<style scoped>
/* 移动端核心适配：viewport适配 + 弹性布局 */
@viewport {
    width: device-width;
    initial-scale: 1.0;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* 主容器：适配手机全屏，优化定位 */
.mainBlock {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #ffe6e6 0%, #fff0f0 100%);
    /* 渐变背景更有趣 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    border-radius: 0;
    /* 手机端全屏不需要圆角 */
    overflow: hidden;
}

/* 初始提示文本：夸张的字体和颜色 */
.init-text {
    font-size: 48px;
    /* 超大字体 */
    font-weight: 900;
    color: #ff3333;
    text-shadow: 0 0 10px #ff3333, 0 0 20px #ff6666;
    /* 文字发光 */
    margin-bottom: 20px;
    text-align: center;
}

.init-subtext {
    font-size: 24px;
    color: #333;
    margin-bottom: 40px;
    text-align: center;
}

.highlight {
    color: #ff3333;
    font-weight: bold;
    font-size: 28px;
    text-decoration: underline wavy #ff3333;
    /* 波浪下划线更有趣 */
}

/* 按钮组：手机端按钮放大 */
.btn-group {
    display: flex;
    gap: 20px;
    margin-bottom: 40px;
}

.btn {
    width: 120px;
    height: 60px;
    border: none;
    border-radius: 30px;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    position: relative;
    overflow: hidden;
}

/* 是按钮：鲜艳的绿色，点击反馈 */
.yes-btn {
    background: linear-gradient(45deg, #4CAF50, #8BC34A);
    color: white;
}

.yes-btn:hover,
.yes-btn:active {
    background: linear-gradient(45deg, #388E3C, #7CB342);
    transform: scale(1.1);
    /* 点击放大 */
}

/* 不是按钮：鲜艳的红色，点击反馈 */
.no-btn {
    background: linear-gradient(45deg, #F44336, #FF9800);
    color: white;
}

.no-btn:hover,
.no-btn:active {
    background: linear-gradient(45deg, #D32F2F, #F57C00);
    transform: scale(1.1);
    /* 点击放大 */
}

/* 结果文本：夸张的样式 */
.result-text {
    font-size: 28px;
    line-height: 1.8;
    text-align: center;
    padding: 20px;
    border-radius: 15px;
    background: white;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    max-width: 90%;
}

.welcome-text {
    color: #4CAF50;
    border: 3px solid #4CAF50;
}

.refuse-text {
    color: #F44336;
    border: 3px solid #F44336;
}

.laugh {
    color: #FF9800;
    font-size: 32px;
    animation: laugh 1s infinite alternate;
}

.angry {
    color: #F44336;
    font-size: 32px;
    font-weight: bold;
    animation: angry 0.5s infinite alternate;
}

/* 动画效果：增加趣味性 */
/* 入场弹跳 */
@keyframes bounce-in {
    0% {
        transform: scale(0);
        opacity: 0;
    }

    70% {
        transform: scale(1.2);
        opacity: 1;
    }

    100% {
        transform: scale(1);
    }
}

.bounce-in {
    animation: bounce-in 0.8s ease forwards;
}

/* 滑动入场 */
@keyframes slide-in {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }

    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

.slide-in {
    animation: slide-in 1s ease forwards;
}

/* 弹出入场 */
@keyframes pop-in {
    0% {
        transform: translateY(50px);
        opacity: 0;
    }

    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

.pop-in {
    animation: pop-in 0.6s ease forwards;
}

/* 震动效果 */
@keyframes shake {
    0% {
        transform: rotate(0deg);
    }

    25% {
        transform: rotate(5deg);
    }

    50% {
        transform: rotate(0deg);
    }

    75% {
        transform: rotate(-5deg);
    }

    100% {
        transform: rotate(0deg);
    }
}

.shake {
    animation: shake 0.3s ease infinite;
}

/* 大笑动画 */
@keyframes laugh {
    0% {
        transform: scale(1);
    }

    100% {
        transform: scale(1.2);
    }
}

/* 生气动画 */
@keyframes angry {
    0% {
        transform: scale(1);
    }

    100% {
        transform: scale(1.1) rotate(2deg);
    }
}

/* 移动端适配：小屏手机调整尺寸 */
@media (max-width: 375px) {
    .init-text {
        font-size: 36px;
    }

    .init-subtext {
        font-size: 20px;
    }

    .highlight {
        font-size: 24px;
    }

    .btn {
        width: 100px;
        height: 50px;
        font-size: 20px;
    }

    .result-text {
        font-size: 22px;
    }
}
</style>