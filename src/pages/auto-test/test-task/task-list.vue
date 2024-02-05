<template>
  <div>
    <a-card :bordered="false">
      <template #title>
        <a-space>
          <a-radio-group v-model:value="createdByRadio" button-style="solid">
            <a-radio-button :value="1" style="z-index:0">我的</a-radio-button>
            <a-radio-button :value="2" style="z-index:0">项目组</a-radio-button>
          </a-radio-group>
        </a-space>
      </template>
      <template #extra>
        <RouterLink
            :to="{
                      path:'/autoTest/editTask',
                      query:{
                        type:1
                      }
                    }">
          <a-button type="primary">
            <template #icon>
              <PlusOutlined/>
            </template>
            新增任务
          </a-button>
        </RouterLink>

      </template>
      <a-table :columns="columns" :data-source="taskInfoData" :pagination="pagination">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'envId'">
                        <span>
                          {{ record.envInfo.envName }}
                        </span>
          </template>
          <template v-if="column.key === 'status'">
                        <span>
                          <a-badge v-if="record.status===0" color="green" text="启用"/>
                           <a-badge v-if="record.status===1" color="red" text="停用"/>
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
                  path:'/autoTest/editTask',
                  query:{
                    taskId:record.taskId,
                    type:2
                  }
                }"
              >
                 <a>编辑</a>
              </RouterLink>
              <a-divider type="vertical"/>
              <a-popconfirm placement="top" ok-text="确定" cancel-text="取消"
                            @confirm="deleteTask(record.taskId)" title="确定删除用例嘛?">
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
import {message} from "ant-design-vue";
import {PlusOutlined} from "@ant-design/icons-vue";
import {deleteTaskApi, queryAnyTaskWithProjectIdApi} from "~/api/auto-test/test-task.js";

const columns = [
  {
    title: '任务ID',
    dataIndex: 'taskId',
    key: 'taskId',
    width: 80
  },
  {
    title: '任务名称',
    dataIndex: 'taskName',
    key: 'taskName',
    ellipsis: true
  },
  {
    title: '执行环境',
    dataIndex: 'envId',
    key: 'envId',
    ellipsis: true
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
    title: '创建时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
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
]
const userStore = useUserStore()
let createdByRadio = ref(2)
let taskInfoData = ref([])
let queryTaskInfoParameter = ref({
  projectId: undefined,
  createdBy: undefined,
  pageNum: 1,
  pageSize: 10
})

let deleteTaskParameter = ref({
  taskId: undefined
})

let selectProjectId = useSelectProjectId()

let pagination = ref({
  current: 1,
  showSizeChanger: false,
  showQuickJumper: false,
  pageSize: 10,
  total: 0,
  onChange: (pageNum) => getTaskInfoData(pageNum),
  showTotal: (total) => `总共有 ${total} 条数据`,
  hideOnSinglePage: true
})

watch(() => selectProjectId, (newValue, oldValue) => {
  queryTaskInfoParameter.value.projectId = newValue
  getTaskInfoData(1)
}, {deep: true})


async function getTaskInfoData(pageNum) {
  try {
    pagination.value.current = pageNum
    queryTaskInfoParameter.value.pageNum = pageNum
    // 发请求
    const {success, data} = await queryAnyTaskWithProjectIdApi(queryTaskInfoParameter.value)
    if (success) {
      taskInfoData.value = data.allTaskInfo
      pagination.value.total = data.total
    }
  } catch (error) {
    console.log(error)
  }
}


function deleteTask(taskId) {
  deleteTaskParameter.value.taskId = taskId
  deleteTaskApi(deleteTaskParameter.value).then(response => {
    if (response.success) {
      getTaskInfoData(pagination.value.current)
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
    queryTaskInfoParameter.value.createdBy = userStore.userInfo.userId
  } else if (newValue.value === 2) {
    queryTaskInfoParameter.value.createdBy = undefined
  }
  getTaskInfoData(1)
}, {deep: true})


onBeforeMount(() => {
  if (selectProjectId.value) {
    queryTaskInfoParameter.value.projectId = selectProjectId.value
    getTaskInfoData(1)
  }
})


</script>



