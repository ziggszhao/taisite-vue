<script setup lang="ts">
import {useRouter} from 'vue-router'

const router = useRouter()

function toHome() {
    router.push({ path: '/' })
}
</script>

<template>
    <a-result status="403" title="努力建设中..." sub-title="请再给我一点点时间...">
        <template #extra>
            <a-button type="primary" @click="toHome">
                返回首页
            </a-button>
        </template>
    </a-result>
</template>

  
  
<style scoped>
.trend-container2 {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 900px;
    padding-bottom: 0px;
}
</style>