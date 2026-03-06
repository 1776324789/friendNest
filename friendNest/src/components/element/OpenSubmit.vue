<template>
    <div class="page" v-if="showSubmit">
        <div class="mainBlock">
            <div class="badge">先身份核验一下</div>
            <div class="title1">为了验证你是否是自己人</div>
            <div class="title2">请输入大菠萝对你的称呼,或者其他关键词</div>
            <input :disabled="disable" v-model="answer" class="input" placeholder="人物的不同会决定展示页面不同。吗？"
                placeholder-class="placeholder" />
            <div class="tip" v-if="second > -3">
                <span style="font-weight: bold;font-size: 15px; color: red;">&nbsp;&nbsp;&nbsp;{{ second > 0 ? second :
                    0 }}</span>
            </div>
            <div class="tip" v-if="second <= -3">
                放个倒计时是不是还蛮唬人的~
            </div>
            <div class="btn" @click="submit">
                确认提交
            </div>
        </div>
    </div>
    <GZYopen></GZYopen>
    
</template>

<script setup>
import GZYopen from '@/components/content/GZYopen.vue'
import { ref } from 'vue'

const showSubmit = ref(true)
const second = ref(10)
const disable = ref(true)
const showOpen = ref("")

setInterval(() => {
    second.value--
}, 1000)

setTimeout(() => {
    disable.value = false
}, 4000);

const answer = ref("远")

function submit() {
    if (answer.value.includes("远")) {
        showOpen.value = 'gzy'
    }
    showSubmit.value = false
}
</script>

<style scoped>
/* 整个页面背景 */
.page {
    height: 100vh;
}

/* 主卡片 */
.mainBlock {
    width: 78vw;
    position: fixed;
    padding: 26px 22px 28px;
    background-color: #fff;
    border-radius: 18px;
    left: 50%;
    top: 35%;
    transform: translate(-50%, -50%);
    box-shadow: 0 12px 30px rgba(182, 0, 0, 0.15);
    animation: float 3s ease-in-out infinite;
}

/* 顶部小标签 */
.badge {
    display: inline-block;
    padding: 4px 10px;
    background-color: #b60000;
    color: #fff;
    font-size: 12px;
    border-radius: 20px;
    margin-bottom: 10px;
}

/* 标题 */
.title1 {
    font-size: 22px;
    font-weight: 700;
    color: #b60000;
    line-height: 34px;
}

.title2 {
    font-size: 16px;
    line-height: 28px;
    color: #333;
    margin-bottom: 16px;
}

/* 输入框 */
.input {
    outline: none;
    width: 100%;
    height: 44px;
    border-radius: 12px;
    border: 2px solid #f0d6d6;
    padding: 0 14px;
    font-size: 15px;
    box-sizing: border-box;
    transition: all 0.2s;
}

.input:focus {
    border-color: #b60000;
    box-shadow: 0 0 0 2px rgba(182, 0, 0, 0.15);
}

/* placeholder */
.placeholder {
    color: #bbb;
}

/* 提示文案 */
.tip {
    line-height: 30px;
    height: 30px;
    margin-top: 10px;
    font-size: 14px;
    color: #999;
}

/* 按钮 */
.btn {
    margin-top: 18px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    background: linear-gradient(135deg, #b60000, #e64545);
    color: #fff;
    font-size: 16px;
    border-radius: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    box-shadow: 0 6px 14px rgba(182, 0, 0, 0.3);
}

/* 轻微漂浮动画 */
@keyframes float {
    0% {
        transform: translate(-50%, -50%) translateY(0);
    }

    50% {
        transform: translate(-50%, -50%) translateY(-6px);
    }

    100% {
        transform: translate(-50%, -50%) translateY(0);
    }
}
</style>