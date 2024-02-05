<template>
  <a-row :gutter="24">
    <a-col :span="5" style="padding-left: 0;">
      <a-menu
          v-model:selectedKeys="selectedKeys"
          mode="inline"
          :items="items"
          :theme="isDark?'dark':'light'"
      />
    </a-col>
    <a-col :span="19">
      <div v-if="selectedKeys[0] === '1'" style="height: 88vh">
        <a-descriptions bordered>

          <a-descriptions-item label="执行结果">
            <a-badge v-if="runCaseResult.success" color="green" text="成功"/>
            <a-badge v-else color="red" text="失败"/>
          </a-descriptions-item>
          <a-descriptions-item label="执行结果" :span="2">
            {{ runCaseResult.message }}
          </a-descriptions-item>
          <a-descriptions-item label="请求方式">
            {{ runCaseResult.caseRequestMethod }}
          </a-descriptions-item>
          <a-descriptions-item label="HTTP返回状态码">
            {{ runCaseResult.response.code }}
          </a-descriptions-item>
          <a-descriptions-item label="执行时间(ms)">
            {{ runCaseResult.response.totalTime }}
          </a-descriptions-item>

          <a-descriptions-item label="请求地址" :span="2">
            {{ runCaseResult.caseRequestUrl }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <div v-if="selectedKeys[0] === '2'">
        <v-ace-editor
            v-model:value="runCaseResult.caseActionLogs"
            style="height: 88vh;font-size: 16px;"
            ref="actionCaseResultLogEditor"
            lang="text"
            :theme="theme"
            :options="{
                readOnly: true,
                showLineNumbers:true, //显示行号
                wrap:'free'
              }"
        />
      </div>
      <div v-if="selectedKeys[0] === '3'">
        <NameValue :nameValueInfo="runCaseResult.caseRequestHeader" source="commonShow"/>
      </div>
      <div v-if="selectedKeys[0] === '4'">
        <NameValue :nameValueInfo="runCaseResult.response.headers" source="commonShow"/>
      </div>
      <div v-if="selectedKeys[0] === '5'">
        <v-ace-editor
            v-model:value="runCaseResult.response.content"
            style="height: 88vh;font-size: 16px;"
            ref="actionCaseResultResponseEditor"
            lang="text"
            :theme="theme"
            :options="{
                readOnly: true,
                showLineNumbers:true, //显示行号
                wrap:'free'
              }"
        />
      </div>
    </a-col>
  </a-row>
</template>

<script setup>
import {VAceEditor} from 'vue3-ace-editor';
import '~/config/ace-config';
import NameValue from "~/pages/auto-test/components/name-value.vue";
import {isDark} from '~/composables/theme'

let theme = ref('github')
let runCaseResult = inject("runCaseResult")
const selectedKeys = ref(['1'])

const items = computed(() => {
  return [
    {
      key: '1',
      label: '基本信息',
      title: '基本信息',
    },
    {
      key: '2',
      label: '执行日志',
      title: '执行日志',
    },
    {
      key: '3',
      label: 'Request Header',
      title: 'Request Header',
    },
    {
      key: '4',
      label: 'Response Header',
      title: 'Response Header',
    }, ,
    {
      key: '5',
      label: 'Response',
      title: 'Response',
    },
  ]
})

onBeforeMount(()=>{
  if (isDark.value) {
    theme.value= "one_dark"
  } else {
    theme.value= "github"
  }
})
</script>