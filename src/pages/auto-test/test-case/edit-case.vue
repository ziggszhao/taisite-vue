<template>
  <div>
    <a-card :bordered="false" title="编辑用例">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="saveCase">
            <template #icon>
              <SaveOutlined/>
            </template>
            保存用例
          </a-button>
          <a-button type="primary" @click="openActionModal" :disabled="!caseInfoData.caseId">
            <template #icon>
              <PlayCircleOutlined/>
            </template>
            执行用例
          </a-button>
        </a-space>
      </template>
      <a-form
          ref="caseInfoFormRef"
          :model="caseInfoData"
      >
        <a-row>
          <a-col :span="12">
            <a-form-item
                label="用例名称："
                name="caseName"
                :rules="[{required: true, message: '请填写用例名称', trigger: 'change'},
                        {min: 1,max:20, message: '名称长度在1-20之间', trigger: 'change'}]"
                :wrapperCol="{span:12}"
            >
              <a-input v-model:value="caseInfoData.caseName"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
                label="所属项目："
                name="projectId"
                :rules="[{required: true, message: '请选择所属项目', trigger: 'change'}]"
                :wrapperCol="{span:12}"
            >
              <a-select
                  ref="select"
                  v-model:value="caseInfoData.projectId"
                  disabled
              >
                <a-select-option v-for="projectInfo in projectInfoList"
                                 v-model:value="projectInfo.projectId">
                  <a-avatar :src="projectInfo.projectAvatar" :size="20"/>
                  {{ projectInfo.projectName }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-item
                label="请求类型："
                name="caseRequestType"
                :rules="[{required: true, message: '请选择请求类型', trigger: 'change'}]"
                :wrapperCol="{span:12}"
            >
              <a-select
                  ref="select"
                  v-model:value="caseInfoData.caseRequestType"
              >
                <a-select-option value="HTTP">HTTP</a-select-option>
                <a-select-option value="DUBBO" disabled>DUBBO</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
                label="用例状态："
                name="status"
                :rules="[{required: true, message: '请选择用例状态', trigger: 'change'}]"
                :wrapperCol="{span:12}"
            >
              <a-select
                  ref="select"
                  v-model:value="caseInfoData.status"
              >
                <a-select-option :value="0">
                  <a-badge color="green" text="启用"/>
                </a-select-option>
                <a-select-option :value="1">
                  <a-badge color="red" text="停用"/>
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item
            label="用例描述："
            name="caseDescription"
            :rules="[{required: true, message: '请填写用例描述', trigger: 'change'},
                        {min: 1,max:50, message: '描述长度在1-50之间', trigger: 'change'}]"
            :wrapperCol="{span:8}"
        >
          <a-textarea v-model:value="caseInfoData.caseDescription"/>
        </a-form-item>
      </a-form>
      <a-tabs v-model:activeKey="stepActiveKey">
        <a-tab-pane key="1">
          <template #tab>
            <span>
            <DatabaseOutlined/>
             数据管理
            </span>
          </template>
          <DataManage v-if="requestFlag"/>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #tab>
            <span>
            <LeftSquareTwoTone/>
             前置步骤
            </span>
          </template>
          <a-result title="努力建设中..." sub-title="请再给我一点点时间..."/>
        </a-tab-pane>
        <a-tab-pane key="3">
          <template #tab>
            <span>
             <SendOutlined color="#7BC39D"/>
             接口请求
            </span>
          </template>
          <RequestApi v-if="requestFlag" ref="requestApiRef"/>
        </a-tab-pane>
        <a-tab-pane key="4">
          <template #tab>
            <span>
             <ToTopOutlined color="#2888E1"/>
              出参提取
            </span>
          </template>
          <ExtractParameters/>
        </a-tab-pane>
        <a-tab-pane key="5">
          <template #tab>
            <span>
            <BarsOutlined color="red"/>
            断言
            </span>
          </template>
          <Assert/>
        </a-tab-pane>
        <a-tab-pane key="6">
          <template #tab>
            <span>
             <RightSquareTwoTone/>
              后置步骤
            </span>
          </template>
          <a-result title="努力建设中..." sub-title="请再给我一点点时间..."/>
        </a-tab-pane>
      </a-tabs>
    </a-card>
    <a-modal v-model:open="showActionModal" title="执行用例" @ok="runCase">
      <a-space>
        <span>选择环境</span>
        <a-select v-model:value="runCaseParameter.envId" style="width: 400px">
          <a-select-option v-for="env in envList" :value="env.envId">{{ env.envName }}</a-select-option>
        </a-select>
      </a-space>
    </a-modal>
    <a-drawer
        v-if="showResultModal"
        v-model:open="showResultModal"
        title="执行结果"
        placement="right"
        :closable="true"
        width="1000"
    >
      <CaseResult/>
    </a-drawer>
  </div>
</template>

<script setup>
import {useRoute} from 'vue-router'
import {
  runCaseApi, insertCaseApi,
  queryAnyCaseWithCaseIdApi, updateCaseApi
} from "~/api/auto-test/test-case.js";
import {
  LeftSquareTwoTone,
  SendOutlined,
  ToTopOutlined,
  BarsOutlined,
  RightSquareTwoTone,
  SaveOutlined,
  PlayCircleOutlined,
  DatabaseOutlined
} from '@ant-design/icons-vue'
import RequestApi from "~/pages/auto-test/components/request-api.vue";
import ExtractParameters from "~/pages/auto-test/components/extract-parameters.vue";
import Assert from "~/pages/auto-test/components/assert.vue";
import {message} from "ant-design-vue";
import {queryValidEnvWithProjectIdApi} from "~/api/auto-test/env.js";
import CaseResult from "~/pages/auto-test/components/case-result.vue";
import DataManage from "~/pages/auto-test/components/data-manage.vue";

const route = useRoute()
const selectProjectId = useSelectProjectId()
const projectInfoList = useProjectInfoList()
let requestFlag = ref(false)
let stepActiveKey = ref("3")
let caseInfoFormRef = ref()
let requestApiRef = ref()
let theme = computed(()=>{
    if (isDark.value) {
      return "one_dark"
    } else {
      return "github"
    }
})

let queryCaseInfoParameter = ref({
  caseId: undefined
})

let queryEnvInfoParameter = ref({
  projectId: undefined
})

let runCaseParameter = ref({
  caseId: undefined,
  envId: undefined
})

let runCaseResult = ref({})

let caseInfoData = ref({
  caseId: undefined,
  caseName: '',
  caseDescription: '',
  projectId: undefined,
  caseRequestType: 'HTTP',
  caseRequestUrl: '',
  caseRequestMethod: 'GET',
  caseRequestHeader: [],
  caseRequestBody: '',
  caseRequestBodyType: 0,
  beforeRequestDelay: 0,
  afterRequestDelay: 0,
  beforeRequestAction: [],
  afterRequestAction: [],
  retryTimes: 0,
  caseParameters: [],
  caseExtractParameters: [],
  caseAsserts: [],
  status: 0
})

let envList = ref([])
let showActionModal = ref(false)
let showResultModal = ref(false)

async function getCaseInfoData() {
  try {
    // 发请求
    const {success, data} = await queryAnyCaseWithCaseIdApi(queryCaseInfoParameter.value)
    if (success) {
      caseInfoData.value.caseId = data.caseId
      caseInfoData.value.caseName = data.caseName
      caseInfoData.value.caseDescription = data.caseDescription
      caseInfoData.value.projectId = data.projectId
      queryEnvInfoParameter.value.projectId = data.projectId
      await getEnvInfoData()
      caseInfoData.value.caseRequestType = data.caseRequestType
      caseInfoData.value.caseRequestUrl = data.caseRequestUrl
      caseInfoData.value.caseRequestMethod = data.caseRequestMethod
      caseInfoData.value.caseRequestHeader = data.caseRequestHeader
      caseInfoData.value.caseRequestBody = data.caseRequestBody
      caseInfoData.value.caseRequestBodyType = data.caseRequestBodyType
      caseInfoData.value.beforeRequestDelay = data.beforeRequestDelay
      caseInfoData.value.afterRequestDelay = data.afterRequestDelay
      caseInfoData.value.beforeRequestAction = data.beforeRequestAction
      caseInfoData.value.afterRequestAction = data.afterRequestAction
      caseInfoData.value.retryTimes = data.retryTimes
      caseInfoData.value.caseParameters = data.caseParameters
      caseInfoData.value.caseExtractParameters = data.caseExtractParameters
      caseInfoData.value.caseAsserts = data.caseAsserts
      caseInfoData.value.status = data.status
    }
    requestFlag.value = true
  } catch (error) {
    requestFlag.value = true
    console.log(error)
  }
}

async function getEnvInfoData() {
  try {
    // 发请求
    const {success, data} = await queryValidEnvWithProjectIdApi(queryEnvInfoParameter.value)
    if (success) {
      envList.value = data
      runCaseParameter.value.envId = envList.value[0].envId
    }
  } catch (error) {
    console.log(error)
  }
}

function saveCase() {
  (caseInfoFormRef.value.validate() && requestApiRef.value.caseRequestFormRef.validate())
      .then(() => {
        if (!caseInfoData.value.caseId) {
          insertCaseApi(caseInfoData.value).then(response => {
            if (response.success) {
              caseInfoData.value.caseId = response.data
              runCaseParameter.value.caseId = response.data
              queryCaseInfoParameter.value.caseId = response.data
              getCaseInfoData()
              message.success('新增成功');
            } else {
              message.error('新增失败');
            }
          }).catch(error => {
            message.error('新增失败,', error);
          })
        } else if (caseInfoData.value.caseId) {
          updateCaseApi(caseInfoData.value).then(response => {
            if (response.success) {
              getCaseInfoData()
              message.success('更新成功');
            } else {
              message.error('更新失败');
            }
          }).catch(error => {
            message.error('更新失败,', error);
          })
        }
      }).catch(error => {
    message.error('请检查参数');
  });
}

function openActionModal() {
  showActionModal.value = true
}

function runCase() {
  showActionModal.value = false
  runCaseApi(runCaseParameter.value).then(response => {
    runCaseResult.value = response.data
    showResultModal.value = true
    if (response.success) {
      message.success('执行结束');
    } else {
      message.error('执行失败');
    }
  }).catch(error => {
    message.error('执行失败');
  });
}

provide("caseInfoData", caseInfoData)
provide("runCaseResult", runCaseResult)

onBeforeMount(() => {
  if (route.query.type === "1") {
    caseInfoData.value.projectId = selectProjectId.value
    queryEnvInfoParameter.value.projectId = caseInfoData.value.projectId
    getEnvInfoData()
    requestFlag.value = true
  } else if (route.query.type === "2") {
    if (route.query.caseId) {
      runCaseParameter.value.caseId = parseInt(route.query.caseId)
      queryCaseInfoParameter.value.caseId = parseInt(route.query.caseId)
      getCaseInfoData()
    }
  }
})


</script>