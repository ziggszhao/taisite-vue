<template>
  <div>
      <a-space>
        <span>当前项目：</span>
      <a-select
          ref="select"
          style="width: 320px"
          v-model:value="projectStore.selectProjectId"
       >
        <a-select-option v-for="projectInfo in projectStore.projectInfoList"  v-model:value="projectInfo.projectId">
          <a-avatar :src="projectInfo.projectAvatar" :size="20"/>
          {{projectInfo.projectName}}
        </a-select-option>
      </a-select>
      </a-space>
  </div>
</template>

<script setup>
import {useProjectStore} from "~/stores/project.js";
const projectStore=useProjectStore()




onBeforeMount(()=>{
  projectStore.initProjectId()
})
</script>