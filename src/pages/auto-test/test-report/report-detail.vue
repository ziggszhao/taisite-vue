<template>
  <div>
    <a-card :title="'测试报告 # '+route.query.reportId">
      <a-row :gutter="24">
        <a-col :span="16">
          <a-descriptions title="报告详情">
            <a-descriptions-item label="运行类型">{{ reportDetail.runType }}</a-descriptions-item>
            <a-descriptions-item label="运行模式">{{ reportDetail.runMode }}</a-descriptions-item>
            <a-descriptions-item label="运行结果">
               <span>
                  <a-badge v-if="reportDetail.status===1" color="blue" text="正在执行"/>
                  <a-badge v-if="reportDetail.status===2" color="green" text="执行成功"/>
                   <a-badge v-if="reportDetail.status===3" color="red" text="执行失败"/>
                </span>
            </a-descriptions-item>
            <a-descriptions-item label="执行用例总数">{{ reportDetail.runCount }}</a-descriptions-item>
            <a-descriptions-item label="执行用例成功数">{{ reportDetail.runSuccessCount }}</a-descriptions-item>
            <a-descriptions-item label="执行用例失败数">{{ reportDetail.runFailCount }}</a-descriptions-item>
            <a-descriptions-item label="执行人">{{ reportDetail.createdBy.nickName }}</a-descriptions-item>
            <a-descriptions-item label="执行耗时(s)">{{ reportDetail.duration }}</a-descriptions-item>
            <a-descriptions-item label="开始时间">{{ reportDetail.startTime }}</a-descriptions-item>
            <a-descriptions-item label="结束时间">{{ reportDetail.endTime }}</a-descriptions-item>
          </a-descriptions>
        </a-col>
        <a-col :span="8">
          <div style="text-align: center;" class="mb-4">
            <a-progress
                type="circle"
                :percent="reportDetail.percent"
                trailColor="#FA4B49"
                strokeColor="#54C51E"
                :status="reportDetail.percent===0?'exception':''"
            />
          </div>

          <a-card>
            <a-card-grid style="width: 25%; text-align: center">
              用例总数<br>
              <ContainerTwoTone/>
              {{ reportDetail.runCount }}
            </a-card-grid>
            <a-card-grid style="width: 25%; text-align: center">
              成功数<br>
              <CheckCircleOutlined style="color: #54C51E"/>
              {{ reportDetail.runSuccessCount }}
            </a-card-grid>
            <a-card-grid style="width: 25%; text-align: center">
              失败数<br>
              <CloseCircleOutlined style="color: #FA4B49"/>
              {{ reportDetail.runFailCount }}
            </a-card-grid>
            <a-card-grid style="width: 25%; text-align: center">
              测试通过率<br>
              <PieChartTwoTone/>
              {{ reportDetail.percent }}%
            </a-card-grid>
          </a-card>
        </a-col>
      </a-row>
    </a-card>
    <a-card title="用例列表" class="mt-4">
      <a-table ref="envTableRef" :columns="columns" :data-source="reportDetail.runLog" :pagination="pagination">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'success'">
                        <span>
                          <a-badge v-if="record.success" color="green" text="执行成功"/>
                          <a-badge v-if="!record.success" color="red" text="执行失败"/>
                        </span>
          </template>
          <template v-if="column.key === 'response'">
            <span>
             {{ record.response.totalTime }}
            </span>
          </template>
          <template v-if="column.key === 'action'">
            <a @click="showLog(record)">日志</a>
          </template>
        </template>
      </a-table>
    </a-card>
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
import {useRoute} from "vue-router";
import {queryAnyReportWithReportIdApi} from "~/api/auto-test/test-report.js";
import CaseResult from "~/pages/auto-test/components/case-result.vue";
import {ContainerTwoTone, CheckCircleOutlined, CloseCircleOutlined, PieChartTwoTone} from '@ant-design/icons-vue'

const route = useRoute()

let queryReportDetailParameter = ref({
  reportId: undefined,
})
let pagination = ref({
  defaultPageSize: 10,
  hideOnSinglePage: true
})
const columns = [
  {
    title: '用例ID',
    dataIndex: 'caseId',
    key: 'caseId',
    width: 80
  },
  {
    title: '用例名称',
    dataIndex: 'caseName',
    key: 'caseName',
    ellipsis: true
  },
  {
    title: '请求协议',
    dataIndex: 'caseRequestType',
    key: 'caseRequestType',
    ellipsis: true
  },
  {
    title: '请求接口',
    dataIndex: 'caseRequestUrl',
    key: 'caseRequestUrl',
  },
  {
    title: '请求方式',
    dataIndex: 'caseRequestMethod',
    key: 'caseRequestMethod',
  },
  {
    title: '执行结果',
    dataIndex: 'success',
    key: 'success',
  },
  {
    title: '执行耗时（ms）',
    dataIndex: 'response',
    key: 'response',
  },
  {
    title: '操作',
    key: 'action'
  },
]

let reportDetail = ref({
  reportId: undefined,
  taskInfo: {},
  projectId: undefined,
  envInfo: {},
  runMode: '',
  runType: '',
  runCount: 0,
  runSuccessCount: 0,
  runFailCount: 0,
  startTime: '',
  endTime: '',
  duration: '',
  createdBy: {},
  status: 0,
  runLog: [],
  percent: 0
})

let showResultModal = ref(false)

async function getReportDetailData() {
  try {
    // 发请求
    const {success, data} = await queryAnyReportWithReportIdApi(queryReportDetailParameter.value)
    if (success) {
      reportDetail.value.reportId = data.reportId
      reportDetail.value.taskInfo = data.taskInfo
      reportDetail.value.projectId = data.projectId
      reportDetail.value.envInfo = data.envInfo
      reportDetail.value.runMode = data.runMode
      reportDetail.value.runType = data.runType
      reportDetail.value.runCount = data.runCount
      reportDetail.value.runSuccessCount = data.runSuccessCount
      reportDetail.value.runFailCount = data.runFailCount
      reportDetail.value.startTime = data.startTime
      reportDetail.value.endTime = data.endTime
      reportDetail.value.duration = data.duration
      reportDetail.value.createdBy = data.createdBy
      reportDetail.value.status = data.status
      reportDetail.value.runLog = data.runLog
      reportDetail.value.percent = parseInt(((reportDetail.value.runSuccessCount / reportDetail.value.runCount) * 100).toFixed(2))
    }
  } catch (error) {
    console.log(error)
  }
}

let runCaseResult = ref({})

function showLog(record) {
  showResultModal.value = true
  runCaseResult.value = record
}


provide("runCaseResult", runCaseResult)

onBeforeMount(() => {
  if (route.query.reportId) {
    queryReportDetailParameter.value.reportId = parseInt(route.query.reportId)
    getReportDetailData()
  }
})

</script>