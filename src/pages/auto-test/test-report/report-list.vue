<template>
  <a-table :columns="columns" :data-source="reportInfo" :pagination="pagination">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'status'">
                        <span>
                          <a-badge v-if="record.status===1" color="blue" text="正在执行"/>
                          <a-badge v-if="record.status===2" color="green" text="执行成功"/>
                           <a-badge v-if="record.status===3" color="red" text="执行失败"/>
                        </span>
      </template>
      <template v-if="column.key === 'createdBy'">
                        <span>
                            {{ record.createdBy.nickName }}
                        </span>
      </template>
      <template v-if="column.key === 'action'">
            <span>
              <RouterLink
                  :to="{
                  //name:'xiang', //用name也可以跳转
                  path:'/autoTest/testReportDetail',
                  query:{
                    reportId:record.reportId,
                  }
                }"
              >
                 <a>详情</a>
              </RouterLink>
              <a-divider type="vertical"/>
            </span>
      </template>
    </template>
  </a-table>
</template>

<script setup>
import {queryAnyReportWithProjectIdApi} from "~/api/auto-test/test-report.js";
import {onBeforeMount} from "vue";

let reportInfo=ref()

let queryReportParameter = ref({
  projectId: undefined,
  pageNum: 1,
  pageSize: 10
})

let selectProjectId = useSelectProjectId()

let pagination = ref({
  current: 1,
  showSizeChanger: false,
  showQuickJumper: false,
  pageSize: 10,
  total: 0,
  onChange: (pageNum) => getReportInfoData(pageNum),
  showTotal: (total) => `总共有 ${total} 条数据`,
  hideOnSinglePage: true
})

const columns = [
  {
    title: '报告ID',
    dataIndex: 'reportId',
    key: 'reportId',
    width: 80
  },
  {
    title: '运行类型',
    dataIndex: 'runType',
    key: 'runType',
  },
  {
    title: '运行模式',
    dataIndex: 'runMode',
    key: 'runMode',
  },
  {
    title: '运行结果',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '执行人',
    dataIndex: 'createdBy',
    key: 'createdBy',
  },
  {
    title: '运行总数',
    dataIndex: 'runCount',
    key: 'runCount',
  },
  {
    title: '运行成功数',
    dataIndex: 'runSuccessCount',
    key: 'runSuccessCount',
  },
  {
    title: '运行时长（s）',
    dataIndex: 'duration',
    key: 'duration',
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    key: 'startTime',
  },
  {
    title: '操作',
    key: 'action',
  },
]

async function getReportInfoData(pageNum) {
  try {
    pagination.value.current = pageNum
    queryReportParameter.value.pageNum = pageNum
    // 发请求
    const {success, data} = await queryAnyReportWithProjectIdApi(queryReportParameter.value)
    if (success) {
      reportInfo.value = data.allReportInfo
      pagination.value.total = data.total
    }
  } catch (error) {
    console.log(error)
  }
}

onBeforeMount(() => {
  if (selectProjectId.value) {
    queryReportParameter.value.projectId = selectProjectId.value
    getReportInfoData(1)
  }
})
</script>