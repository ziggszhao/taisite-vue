<template>
  <div>
    <a-card :bordered="false">
      <template #title>
        <a-space>
          <a-radio-group v-model:value="createdByRadio" button-style="solid" >
            <a-radio-button :value="1" style="z-index:0">我的</a-radio-button>
            <a-radio-button :value="2" style="z-index:0">项目组</a-radio-button>
          </a-radio-group>
        </a-space>
      </template>
      <template #extra>
        <RouterLink
            :to="{
              //name:'xiang', //用name也可以跳转
              path:'/autoTest/editCase',
              query:{
                type:1
              }
            }">
          <a-button type="primary">
            <template #icon>
              <PlusOutlined/>
            </template>
            新增用例
          </a-button>
        </RouterLink>

      </template>
      <a-table :columns="columns" :data-source="caseInfoData" :pagination="pagination">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
                        <span>
                          <a-badge v-if="record.status===0" color="green" text="启用"/>
                           <a-badge v-if="record.status===1" color="red" text="停用"/>
                          <!--                            <a-switch v-model:checked="record.status" checked-children="启用" :checkedValue='0'-->
                          <!--                                      un-checked-children="停用" :unheckedValue='1'/>-->
                        </span>
          </template>
          <template v-if="column.key === 'createdBy'">
                        <span>
                            {{ record.createdBy.nickName }}
                        </span>
          </template>
          <template v-if="column.key === 'updatedBy'">
                        <span>
                            {{ record.updatedBy.nickName }}
                        </span>
          </template>
          <template v-if="column.key === 'action'">
                        <span>
                            <RouterLink
                                :to="{
                                //name:'xiang', //用name也可以跳转
                                path:'/autoTest/editCase',
                                query:{
                                  caseId:record.caseId,
                                  type:2
                                }
                              }"
                            >
                               <a>编辑</a>
                            </RouterLink>
                            <a-divider type="vertical"/>
                            <a-popconfirm placement="top" ok-text="确定" cancel-text="取消"
                                          @confirm="deleteCase(record.caseId)" title="确定删除用例嘛?">
                              <a>删除</a>
                            </a-popconfirm>
                        </span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import {onBeforeMount} from 'vue';
import {deleteCaseApi, queryAnyCaseWithProjectIdApi} from "~/api/auto-test/test-case.js";
import {message} from "ant-design-vue";
import {PlusOutlined} from "@ant-design/icons-vue";

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
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '创建人',
    dataIndex: 'createdBy',
    key: 'createdBy',
    ellipsis: true
  },
  {
    title: '更新人',
    dataIndex: 'updatedBy',
    key: 'updatedBy',
    ellipsis: true
  },
  {
    title: '更新时间',
    dataIndex: 'updatedTime',
    key: 'updatedTime',
    ellipsis: true
  },
  {
    title: '操作',
    key: 'action',
    width: 200
  },
];
const userStore = useUserStore()
let createdByRadio = ref(2)
let caseInfoData = ref([])
let queryCaseInfoParameter = ref({
  projectId: undefined,
  createdBy: undefined,
  pageNum: 1,
  pageSize: 10
})

let deleteCaseParameter = ref({
  caseId: undefined
})

let selectProjectId = useSelectProjectId()

let pagination = ref({
  current: 1,
  showSizeChanger: false,
  showQuickJumper: false,
  pageSize: 10,
  total: 0,
  onChange: (pageNum) => getCaseInfoData(pageNum),
  showTotal: (total) => `总共有 ${total} 条数据`,
  hideOnSinglePage: true
})

watch(() => selectProjectId, (newValue, oldValue) => {
  queryCaseInfoParameter.value.projectId = newValue
  getCaseInfoData(1)
}, {deep: true})




async function getCaseInfoData(pageNum) {
  try {
    pagination.value.current = pageNum
    queryCaseInfoParameter.value.pageNum = pageNum
    // 发请求
    const {success, data} = await queryAnyCaseWithProjectIdApi(queryCaseInfoParameter.value)
    if (success) {
      caseInfoData.value = data.allCaseInfo
      pagination.value.total = data.total
    }
  } catch (error) {
    console.log(error)
  }
}

function deleteCase(caseId) {
  deleteCaseParameter.value.caseId = caseId
  deleteCaseApi(deleteCaseParameter.value).then(response => {
    if (response.success) {
      getCaseInfoData(pagination.value.current)
      message.success('删除成功');
    } else {
      message.error('删除失败');
    }
  }).catch(error => {
    message.error('删除失败');
  });
}

watch(() => createdByRadio, (newValue, oldValue) => {
  if (newValue.value === 1) {
    queryCaseInfoParameter.value.createdBy = userStore.userInfo.userId
  } else if (newValue.value === 2) {
    queryCaseInfoParameter.value.createdBy = undefined
  }
  getCaseInfoData(1)
}, {deep: true})


onBeforeMount(() => {
  if (selectProjectId.value) {
    queryCaseInfoParameter.value.projectId = selectProjectId.value
    getCaseInfoData(1)
  }
})


</script>

