<template>
    <div class="mainBlock">
        <!-- 标题区域：增加夸张样式和入场动画 -->
        <div class="title-section bounce-in">
            <span class="highlight">凤！！</span>
            <span class="title-text">选择你磕的<b class="cp-tag">CP</b>对象</span>
        </div>

        <!-- CP选择区域：替换float为flex，增加点击动画 -->
        <div class="cp-list">
            <template v-for="name1, index1 in names" :key="`${index1}-top`">
                <template v-for="name2, index2 in names" :key="`${index1}-${index2}`">
                    <div class="cp-block slide-in" :style="{ animationDelay: `${(index1 + index2) * 0.05}s` }"
                        @touchend="handleCPClick(name1, name2)" v-if="index1 != index2">
                        <span class="cp-text">{{ name1 + " & " + name2 }}</span>
                    </div>
                </template>
            </template>
        </div>

        <!-- 底部按钮：夸张样式+点击反馈 -->
        <div class="mainButton pop-in" @click="handleFinish">
            <span class="btn-text">磕完了?那我就把正事端上来了哈</span>
        </div>

        <!-- 提示弹窗：点击CP后显示，带动画 -->
        <div v-if="showToast" class="toast-container fade-in">
            <div class="toast-content">
                {{ toastText }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// 定义姓名列表
const names = ref(['帅', '周', '凤', '蕙', '梅', '詹', '远', '疆', '天', '璇', '宇', '军', '敏'])
let times = 0

// 弹窗相关响应式变量
const showToast = ref(false)
const toastText = ref('')
// 处理CP点击（封装toast逻辑，增加动画）
const handleCPClick = (name1, name2) => {
    // 先隐藏之前的提示
    showToast.value = false

    if (['军', '敏'].includes(name1) && ['敏', '军'].includes(name2)) {
        times++
        if (times > 10) {
            return
        }
        return
    } else if (['军'].includes(name1) || ['军'].includes(name2)) {
        return
    } else if (['敏'].includes(name1) && ['疆', '远', '周', '天'].includes(name2) || ['敏'].includes(name2) && ['疆', '远', '周', '天'].includes(name1)) {
        return
    } else if (['周', '远'].includes(name1) && ['周', '远'].includes(name2)) {
        // 情绪：损人+搞笑吐槽（主打互怼）
        const tips = [
            "这俩狼族允许你磕，把他俩绑死，防止出来祸害人~~",
            "虽然你口味很重，但是不得不说这俩人是有点东西在的",
            "百年修得同船渡，千年出了俩yxb",
            "这两个人吗？用比较委婉的语言描述一下~~~嗯~~俩只猪！",
            "大菠萝其实还是很看好这俩人的，真的，你信我",
            "这俩凑一起，主打一个负负得更负，别嚯嚯别人了",
            "也就你能磕得下这对，我敬你是条汉子！",
            "建议锁死，省得他俩分开去嚯嚯其他老实人",
            "这组合主打一个卧龙凤雏，缺一不可啊哈哈哈",
            "磕归磕，别让他俩知道，不然得组团来骂你",
            "口味够重啊兄弟，这俩搁一块能把房顶掀了",
            "别人磕CP图甜，你磕这俩图个乐呵是吧？"
        ]
        toast(tips[Math.floor(Math.random() * tips.length)])
    } else if (['凤', '远'].includes(name1) && ['凤', '远'].includes(name2)) {
        // 情绪：调侃+暖心吐槽（带点心疼）
        const tips = [
            "对自己这么狠吗？",
            "大家都说，交友要降低预期，不是说不要预期啊！！",
            "远对待他的凤姐姐还是很认真的，就是吧，旁人得有点心理建设才行",
            "凤姐这是栽手里了？远子可别不识好歹啊",
            "咱就是说，凤姐值得更好的，但远子也不是不行（小声）",
            "这对主打一个姐弟情深？还是冤种互坑啊？",
            "凤姐带远子，跟带个逆子似的，辛苦啦！",
            "远子也就在凤姐面前装乖，背后指不定多皮呢",
            "磕这对多少带点亲情滤镜了啊喂！",
            "别人磕爱情，你磕这对主打一个家人感是吧？"
        ]
        toast(tips[Math.floor(Math.random() * tips.length)])
    } else if (name1 == '远' || name2 == '远') {
        // 情绪：夸张吐槽+阴阳怪气（主打损远子）
        const tips = [
            "这你也磕？！",
            "远的人设还是立的太稳了，没有赏心悦目，全是触目惊心！",
            "一艘万吨巨轮而过，将这对CP创死~",
            "远子都能有CP？你是把鱼塘里的鱼都捞遍了吧",
            "但凡有别的选择，也不至于磕远子吧？心疼你三秒",
            "远子：我何德何能啊？（配个无语脸）",
            "磕这对的人，多少沾点叛逆，主打一个反其道而行",
            "远子的CP感全靠你的想象力撑着，真辛苦",
            "建议直接报警，有人硬磕远子，眼睛要瞎了",
            "远子：别带我，我只想当个安静的冤种",
            "这CP磕得，比吃了苍蝇还上头是吧？"
        ]
        toast(tips[Math.floor(Math.random() * tips.length)])
    } else if (['凤', '帅', "蕙", "敏", "梅", "詹", '宇', '璇'].includes(name1) && ['凤', '帅', "蕙", "敏", "梅", "詹", '宇', '璇'].includes(name2)) {
        // 情绪：开心调侃+嗑糖（主打甜妹贴贴）
        const tips = [
            "这不得不说！太会了",
            "你早这么磕，我早加入你了",
            "有这样的CP磕，我下半辈子的糖分就靠这个维持了",
            "她爱她啊~她爱她~他们永远甜蜜蜜~~",
            "我爱这种排列组合!!",
            "这才对嘛！美女贴贴才是yyds，磕到了磕到了",
            "这对我先磕为敬！甜到齁，建议原地结婚",
            "终于选对了！这组合主打一个赏心悦目，谁看了不迷糊",
            "姐妹贴贴，快乐翻倍！这CP我举双手双脚赞成",
            "就该磕这种！颜值天花板组合，甜到我心吧里了",
            "嗑这对的都是品味在线的！比那些牛鬼蛇神强多了",
            "这才是正确打开方式！美女和美女锁死！"
        ]
        toast(tips[Math.floor(Math.random() * tips.length)])
    } else if (['周', '天', '疆'].includes(name1) && ['凤', '帅', "蕙", "梅", "詹", '宇'].includes(name2) || ['周', '天', '疆'].includes(name2) && ['凤', '帅', "蕙", "梅", "詹", '宇'].includes(name1)) {
        // 情绪：佛系调侃+凑活磕（主打无所谓）
        const tips = [
            "大菠萝反正是没意见~",
            "有时候换个角度看问题，或许也不是不行",
            "就这么磕一下充充饥吧，不过人不能总吃炒饭啊，总得试试其他口味吧~",
            "凑活磕吧，总比磕那俩牛鬼蛇神强点",
            "主打一个雨露均沾，啥CP都得尝一口是吧？",
            "这组合吧，不惊艳但也不辣眼，凑活过呗",
            "行吧行吧，磕就磕，反正也没人拦着你",
            "偶尔换换口味也行，总磕甜的也齁得慌",
            "这对属于是意外之喜？勉强能下嘴的水平",
            "佛系磕CP，主打一个不挑，有就行！"
        ]
        toast(tips[Math.floor(Math.random() * tips.length)])
    } else if (['璇'].includes(name1) && ['疆', '远', '周', '天'].includes(name2) || ['璇'].includes(name2) && ['疆', '远', '周', '天'].includes(name1)) {
        // 情绪：搞笑玩梗+调侃（主打大顺梗）
        const tips = [
            "顺！大顺！！蒋大顺！！！",
            "大顺：咳咳！",
            "三个人多少有点挤了",
            "大顺表示：这福气给你要不要啊？",
            "璇姐这是要一拖三？忙得过来吗？",
            "大顺：我只是路过，怎么就被拉来凑CP了？",
            "这组合主打一个混乱美，大顺都懵了",
            "璇姐的鱼塘里，大顺只是其中一条鱼罢了",
            "大顺：别磕我，我只想当个安静的吃瓜群众",
            "这CP磕得，大顺连夜扛着火车跑了！"
        ]
        toast(tips[Math.floor(Math.random() * tips.length)])
    } else if (['疆', '远', '周', '天'].includes(name1) && ['疆', '远', '周', '天'].includes(name2)) {
        // 情绪：夸张吐槽+损人（主打爆笑吐槽）
        const tips = [
            "只要你愿意，那就磕吧。。。",
            "额。。。",
            "有时候真的很想报警",
            "这都可以举报你吸毒了",
            "我的眼睛！！！！！",
            "这对磕得，我连夜去挂眼科，眼睛要瞎了",
            "但凡有一粒花生米，也不至于磕成这样啊",
            "兄弟，口味别太独特，容易没朋友的！",
            "这组合主打一个辣眼睛，建议配副墨镜磕",
            "磕这对的人，多少沾点大病，得治！",
            "别人磕CP图开心，你磕这对图啥？图瞎？",
            "报警了报警了，有人硬磕阴间CP！",
            "这对凑一起，能把地球创穿，离远点吧！"
        ]
        toast(tips[Math.floor(Math.random() * tips.length)])
    }
}


// 底部按钮点击事件（增加反馈）
const handleFinish = () => {
    toast("别急别急，正事马上就来啦~~~")
}
</script>

<style scoped>
/* 移动端核心适配 */
@viewport {
    width: device-width;
    initial-scale: 1.0;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* 主容器：全屏适配，渐变背景 */
.mainBlock {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(120deg, #fff5f5 0%, #ffe0e0 100%);
    padding: 20px;
    border-radius: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

/* 标题区域：夸张样式+居中 */
.title-section {
    text-align: center;
    line-height: 90px;
    margin-bottom: 20px;
}

.highlight {
    font-size: 40px;
    font-weight: 900;
    color: #ff2d55;
    text-shadow: 0 0 10px #ff2d55, 0 0 20px #ff6680;
    margin-right: 10px;
}

.title-text {
    font-size: 26px;
    color: #333;
}

.cp-tag {
    font-size: 30px;
    color: #ff5e87;
    text-decoration: underline wavy #ff5e87;
    margin: 0 5px;
}

/* CP列表：flex布局替代float，间距更均匀 */
.cp-list {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
    flex: 1;
    margin-bottom: 30px;
}

/* CP选项：夸张样式+点击反馈 */
.cp-block {
    font-size: 18px;
    width: 110px;
    height: 50px;
    background: linear-gradient(45deg, #ff8a80, #ff5252);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 25px;
    box-shadow: 0 6px 12px rgba(255, 90, 90, 0.2);
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
}

/* 点击反馈：缩放+变色 */
.cp-block:active {
    transform: scale(0.95);
    background: linear-gradient(45deg, #ff5252, #e53935);
    box-shadow: 0 3px 6px rgba(255, 90, 90, 0.3);
}

.cp-text {
    z-index: 2;
    font-weight: 600;
}

/* 底部按钮：夸张样式 */
.mainButton {
    width: 90%;
    height: 70px;
    background: linear-gradient(45deg, #ffccbc, #ffab91);
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 35px;
    margin: 0 auto 20px;
    box-shadow: 0 8px 16px rgba(255, 171, 145, 0.3);
    cursor: pointer;
    transition: all 0.3s ease;
}

.mainButton:active {
    transform: scale(0.98);
    box-shadow: 0 4px 8px rgba(255, 171, 145, 0.4);
}

.btn-text {
    font-size: 20px;
    font-weight: 600;
    color: #e53935;
}

/* 提示弹窗：夸张样式+居中 */
.toast-container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    padding: 0 20px;
}

.toast-content {
    background: #fff;
    padding: 20px 30px;
    border-radius: 20px;
    font-size: 22px;
    line-height: 1.6;
    color: #333;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    border: 3px solid #ff5252;
    max-width: 80%;
    text-align: center;
}

/* 动画效果 */
/* 弹跳入场 */
@keyframes bounce-in {
    0% {
        transform: scale(0);
        opacity: 0;
    }

    70% {
        transform: scale(1.1);
        opacity: 1;
    }

    100% {
        transform: scale(1);
    }
}

.bounce-in {
    animation: bounce-in 0.8s ease forwards;
}

/* 滑动入场（逐个出现） */
@keyframes slide-in {
    0% {
        transform: translateY(30px);
        opacity: 0;
    }

    100% {
        transform: translateY(0);
        opacity: 1;
    }
}

.slide-in {
    animation: slide-in 0.5s ease forwards;
    opacity: 0;
}

/* 弹出入场 */
@keyframes pop-in {
    0% {
        transform: scale(0.8);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.pop-in {
    animation: pop-in 0.6s ease forwards;
}

/* 渐入渐出 */
@keyframes fade-in {
    0% {
        opacity: 0;
        transform: translate(-50%, -40%);
    }

    100% {
        opacity: 1;
        transform: translate(-50%, -50%);
    }
}

.fade-in {
    animation: fade-in 0.3s ease forwards;
}

/* 小屏手机适配 */
@media (max-width: 375px) {
    .highlight {
        font-size: 32px;
    }

    .title-text {
        font-size: 20px;
    }

    .cp-tag {
        font-size: 24px;
    }

    .cp-block {
        width: 90px;
        height: 45px;
        font-size: 16px;
    }

    .mainButton {
        height: 60px;
    }

    .btn-text {
        font-size: 18px;
    }

    .toast-content {
        font-size: 18px;
        padding: 15px 20px;
    }
}
</style>