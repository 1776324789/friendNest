<template>
    <div class="mainBlock">
        <div style="text-align: center;line-height: 100px;">
            <span style="font-size: 25px;font-weight: bolder;color: red;">凤！！</span> 选择你磕的<b>CP</b>对象
        </div>
        <template v-for="name1, index1 in names">
            <template v-for="name2, index2 in names">
                <div class="block" @touchend="submit(name1, name2)" v-if="index1 != index2">{{ name1 + " & " + name2 }}
                </div>
            </template>
        </template>
        <div class="mainButton">
            磕完了，把正事端上来吧
        </div>
        <ThemeEnter></ThemeEnter>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import ThemeEnter from '../element/ThemeEnter.vue'

const names = ref(['帅', '周', '凤', '蕙', '梅', '詹', '远', '疆', '天', '璇', '宇', '军', '敏'])
let times = 0
function submit(name1, name2) {
    if (['军', '敏'].includes(name1) && ['敏', '军'].includes(name2)) {
        times++
        if (times > 10) {
            return
        }
        return //我们不知道后续事情的发展
    } else if (['军'].includes(name1) || ['军'].includes(name2)) {
        return
    } else if (['周', '远'].includes(name1) && ['周', '远'].includes(name2)) {
        const tips = ["这俩狼族允许你磕，把他俩绑死，防止出来祸害人~~",
            "虽然你口味很重，但是不得不说这俩人是有点东西在的",
            "百年修得同船渡，千年出了俩yxb",
            "这两个人吗？用比较委婉的语言描述一下~~~嗯~~俩只猪！",
            "大菠萝其实还是很看好这俩人的，真的，你信我"]
        return console.log(tips[Math.floor(Math.random() * tips.length)])
    } else if (['凤', '远'].includes(name1) && ['凤', '远'].includes(name2)) {
        const tips = ["对自己这么狠吗？",
            "大家都说，交友要降低预期，不是说不要预期啊！！",
            "远对待他的凤姐姐还是很认真的，就是吧，旁人得有点心理建设才行"]
        return console.log(tips[Math.floor(Math.random() * tips.length)])
    } else if (name1 == '远' || name2 == '远') {
        const tips = ["这你也磕？！",
            "远的人设还是立的太稳了，没有赏心悦目，全是触目惊心！",
            "一艘万吨巨轮而过，将这对CP创死~"]
        return console.log(tips[Math.floor(Math.random() * tips.length)])
    } else if (['凤', '帅', "蕙", "敏", "梅", "詹", '宇', '璇'].includes(name1) && ['凤', '帅', "蕙", "敏", "梅", "詹", '宇', '璇'].includes(name2)) {
        const tips = ["这不得不说！太会了",
            "你早这么磕，我早加入你了",
            "有这样的CP磕，我下半辈子的糖分就靠这个维持了",
            "她爱她啊~她爱她~他们永远甜蜜蜜~~",
            "我爱这种排列组合!!"]
        return console.log(tips[Math.floor(Math.random() * tips.length)])
    } else if (['周', '天', '疆'].includes(name1) && ['凤', '帅', "蕙", "梅", "詹", '宇'].includes(name2) || ['周', '天', '疆'].includes(name2) && ['凤', '帅', "蕙", "梅", "詹", '宇'].includes(name1)) {
        const tips = ["大菠萝反正是没意见~",
            "有时候换个角度看问题，或许也不是不行",
            "就这么磕一下充充饥吧，不过人不能总吃炒饭啊，总得试试其他口味吧~"]
        return console.log(tips[Math.floor(Math.random() * tips.length)])
    } else if (['璇'].includes(name1) && ['疆', '远', '周', '天'].includes(name2) || ['璇'].includes(name2) && ['疆', '远', '周', '天'].includes(name1)) {
        const tips = ["顺！大顺！！蒋大顺！！！",
            "大顺：咳咳！",
            "三个人多少有点挤了"]
        return console.log(tips[Math.floor(Math.random() * tips.length)])
    } else if (['敏'].includes(name1) && ['疆', '远', '周', '天'].includes(name2) || ['敏'].includes(name2) && ['疆', '远', '周', '天'].includes(name1)) {
        return
    } else if (['疆', '远', '周', '天'].includes(name1) && ['疆', '远', '周', '天'].includes(name2)) {
        const tips = ["只要你愿意，那就磕吧。。。",
            "额。。。",
            "有时候真的很想报警",
            "这都可以举报你吸毒了",
            "磕完记得漱口"]
        return console.log(tips[Math.floor(Math.random() * tips.length)])
    }
}

</script>

<style scoped>
.mainBlock {
    overflow: auto;
    position: fixed;
    width: 90vw;
    height: 90vh;
    background-color: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 15px;
    border-radius: 15px;
}

.block {
    font-size: 14px;
    width: 100px;
    height: 40px;
    background-color: #ffa2a2;
    color: #000;
    display: flex;
    float: left;
    align-items: center;
    color: #fff;
    justify-content: center;
    border-radius: 10px;
    margin: 10px;
}
</style>
