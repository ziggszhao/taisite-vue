<template>
  <div ref="projectSelectRef">
    <a-space>
      <span>当前项目：</span>
      <a-select
          ref="select"
          style="width: 320px"
          v-model:value="selectProjectId"
      >
        <a-select-option v-for="projectInfo in projectInfoList" v-model:value="projectInfo.projectId">
          <a-avatar :src="projectInfo.projectAvatar" :size="20"/>
          {{ projectInfo.projectName }}
        </a-select-option>
      </a-select>
    </a-space>
  </div>
</template>

<script setup>
import {queryProjectInfoWithUserIdApi} from "~/api/project/project.js";

let selectProjectId = useSelectProjectId()
let projectInfoList= useProjectInfoList()




async function initProjectId(){
  // 获取用户信息
  const {success, data} = await queryProjectInfoWithUserIdApi()
  if (success) {
    projectInfoList.value = data
    if (projectInfoList.value.length > 0) {
      selectProjectId.value = projectInfoList.value[0].projectId
    } else{
      selectProjectId.value = null
    }
  }
}

onBeforeMount(() => {
  initProjectId()
})
</script>