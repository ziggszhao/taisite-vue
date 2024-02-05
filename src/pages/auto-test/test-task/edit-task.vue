<template>
  <a-card :bordered="true" title="编辑任务">
    <template #extra>
      <a-space>
        <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">上一步</a-button>
        <a-button v-if="current < items.length - 1" type="primary" @click="next">下一步</a-button>
        <a-button v-if="current === items.length - 1" type="primary" @click="saveTask()">
          <template #icon>
            <SaveOutlined/>
          </template>
          保存任务
        </a-button>
        <a-button v-if="current === items.length - 1" type="primary" :disabled="taskInfoData.taskId===undefined" @click="runTask()">
          <template #icon>
            <PlayCircleOutlined/>
          </template>
          执行任务
        </a-button>
      </a-space>
    </template>
    <a-steps :current="current" :items="items"></a-steps>
    <div v-if="current ===0" class="steps-content">
      <a-form
          ref="taskInfoFormRef"
          :model="taskInfoData"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
      >
        <a-form-item
            label="任务名称："
            name="taskName"
            :rules="[{required: true, message: '请填写任务名称', trigger: 'change'},
                        {min: 1,max:20, message: '名称长度在1-20之间', trigger: 'change'}]"
        >
          <a-input v-model:value="taskInfoData.taskName"/>
        </a-form-item>
        <a-form-item
            label="crontab表达式："
            name="crontab"
            :rules="[{required: true, message: '请填写crontab表达式', trigger: 'change'},
                        {min: 1,max:20, message: '名称长度在1-20之间', trigger: 'change'}]"
        >
          <a-input v-model:value="taskInfoData.crontab">
            <template #suffix>
              <a-tooltip>
                <template #title>
                  Cron表达式以5空格隔开，分为6个域，Cron语法格式：Seconds Minutes Hours DayofMonth Month DayofWeek<br>
                  Seconds:可出现", - * /"四个字符，有效范围为0-59的整数<br>
                  Minutes:可出现", - * /"四个字符，有效范围为0-59的整数<br>
                  Hours:可出现", - * /"四个字符，有效范围为0-23的整数<br>
                  DayofMonth:可出现", - * / ? L W C"八个字符，有效范围为0-31的整数<br>
                  Month:可出现", - * /"四个字符，有效范围为1-12的整数<br>
                  DayofWeek:可出现", - * / ? L C #"八个字符，有效范围为1-7的整数。1表示星期天，2表示星期一， 依次类推<br>
                  示例：<br>
                  0 0 10,14,16 * * ? 每天上午10点，下午2点，4点<br>
                  0 0/30 9-17 * * ? 朝九晚五工作时间内每半小时<br>
                  0 0 12 ? * 4 表示每个星期三中午12点<br>
                </template>
                <QuestionCircleOutlined/>
              </a-tooltip>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
            label="运行环境："
            name="envId"
            :rules="[{required: true, message: '请选择运行环境', trigger: 'change'}]"
        >
          <a-select v-model:value="taskInfoData.envId">
            <a-select-option v-for="env in envList" :value="env.envId">{{ env.envName }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="所属项目："
            name="projectId"
            :rules="[{required: true, message: '请选择所属项目', trigger: 'change'}]"
        >
          <a-select
              ref="select"
              v-model:value="taskInfoData.projectId"
              disabled
          >
            <a-select-option v-for="projectInfo in projectInfoList"
                             v-model:value="projectInfo.projectId">
              <a-avatar :src="projectInfo.projectAvatar" :size="20"/>
              {{ projectInfo.projectName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="用例状态："
            name="status"
            :rules="[{required: true, message: '请选择任务状态', trigger: 'change'}]"
        >
          <a-select
              ref="select"
              v-model:value="taskInfoData.status"
          >
            <a-select-option :value="0">
              <a-badge color="green" text="启用"/>
            </a-select-option>
            <a-select-option :value="1">
              <a-badge color="red" text="停用"/>
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="任务描述："
            name="taskDescription"
            :rules="[{required: true, message: '请填写任务描述', trigger: 'change'},
                        {min: 1,max:50, message: '描述长度在1-50之间', trigger: 'change'}]"
        >
          <a-textarea v-model:value="taskInfoData.taskDescription"/>
        </a-form-item>
      </a-form>
    </div>
    <div v-if="current ===1" class="steps-content">
      <a-transfer
          v-model:target-keys="taskInfoData.caseList"
          :data-source="caseInfoData"
          :oneWay="true"
          :showSelectAll="false"
          :select-all-labels="selectAllLabels"
      >
        <template
            #children="{
          direction,
          filteredItems,
          selectedKeys,
          disabled: listDisabled,
          onItemSelectAll,
          onItemSelect,
        }"
        >
          <a-table
              :id="direction === 'left' ? 'left' : 'right'"
              :columns="direction === 'left' ? leftColumns : rightColumns"
              :data-source="direction === 'left' ? caseInfoData : taskInfoData.caseList"
              :pagination="direction === 'left' ? leftPagination : false"
              :customRow="direction === 'left' ? leftCustomRow : rightCustomRow"
              size="small"
              :class="direction === 'left' ? 'leftTable' : 'rightTable'"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'index'">
                <DragOutlined style=" cursor: move;"/>
              </template>
              <template v-if="column.key === 'action'">
                        <span>
                            <RouterLink
                                :to="{
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
                              <a @click="deleteCase(record.index)">删除</a>
                        </span>
              </template>
            </template>
          </a-table>
        </template>
      </a-transfer>
    </div>
    <div v-if="current ===2" class="steps-content">
      <a-form
          ref="taskNotifyFormRef"
          :model="taskInfoData"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
      >
        <a-form-item
            label="通知方式："
            name="notifyType"
        >
          <a-checkbox-group v-model:value="taskInfoData.notifyType" :options="notifyTypeOptions"/>
        </a-form-item>
        <a-form-item
            label="失败时才通知："
            name="notifyOnlyFail"
        >
          <a-radio-group v-model:value="taskInfoData.notifyOnlyFail">
            <a-radio :value="1">是</a-radio>
            <a-radio :value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
            label="通知接收人："
            name="notifyReceiver"
            max-tag-count="1"
        >
          <a-select
              v-model:value="taskInfoData.notifyReceiver"
              mode="multiple"
              placeholder="请选择通知接收人"
          >
            <a-select-option v-for="user in userList" :value="user.userId">
              <a-avatar :src="user.userAvatar" :size="20"/>
              {{ user.nickName }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </div>
  </a-card>
</template>

<script setup>
import {useRoute} from "vue-router";
import {runTaskApi, insertTaskApi, queryAnyTaskWithTaskIdApi, updateTaskApi} from "~/api/auto-test/test-task.js";
import {queryValidEnvWithProjectIdApi} from "~/api/auto-test/env.js";
import {
  PlayCircleOutlined,
  SaveOutlined,
  DragOutlined,
  UserOutlined,
  SolutionOutlined,
  SoundOutlined, QuestionCircleOutlined
} from "@ant-design/icons-vue";
import {getAllValidUserBaseInfoApi} from "~/api/common/user.js";
import {message} from "ant-design-vue";
import {deleteCaseApi, insertCaseApi, queryAnyCaseWithProjectIdApi, updateCaseApi} from "~/api/auto-test/test-case.js";


const route = useRoute()
const selectProjectId = useSelectProjectId()
const projectInfoList = useProjectInfoList()
let taskInfoFormRef = ref()
let taskNotifyFormRef = ref()
let envList = ref([])
let userList = ref([])
const labelCol = {span: 8};
const wrapperCol = {span: 12};
const notifyTypeOptions = ref([
  {
    label: '站内信',
    value: 1,
  },
  {
    label: '短信',
    value: 2,
  },
  {
    label: '邮件',
    value: 3,
  },
])
let queryTaskInfoParameter = ref({
  taskId: undefined
})

let queryEnvInfoParameter = ref({
  projectId: undefined
})

let runTaskParameter = ref({
  taskId: undefined
})

let taskInfoData = ref({
  taskId: undefined,
  taskName: '',
  taskDescription: '',
  projectId: undefined,
  crontab: '',
  caseList: [],
  envId: undefined,
  notifyType: [],
  notifyOnlyFail: 1,
  notifyReceiver: [],
  status: 0
})
const leftColumns = [
  {
    title: '用例id',
    dataIndex: 'caseId',
    key: 'caseId',
    width: 100,
    align: 'center'
  },
  {
    title: '用例名称',
    dataIndex: 'caseName',
    key: 'caseName',
    ellipsis: true
  }
]
const rightColumns = [
  {
    title: '',
    key: 'index',
    width: 40,
    align: 'center'
  },
  {
    title: '用例id',
    dataIndex: 'caseId',
    key: 'caseId',
    width: 100,
    align: 'center'
  },
  {
    title: '用例名称',
    dataIndex: 'caseName',
    key: 'caseName',
    ellipsis: true
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    align: "center"
  }
]
const current = ref(0);
const items = ref([
  {
    title: '基本信息',
    content: 'First-content',
    icon: h(UserOutlined),
  },
  {
    title: '选择用例',
    content: 'Second-content',
    icon: h(SolutionOutlined),
  },
  {
    title: '通知配置',
    content: 'Third-content',
    icon: h(SoundOutlined),
  }
])
const next = () => {
  if (current.value === 0) {
    taskInfoFormRef.value.validate()
        .then(() => {
          current.value++;
        }).catch(error => {
      message.error('请检查参数');
    });
  }else if (current.value === 1) {
    if(taskInfoData.value.caseList.length!==0){
      current.value++;
    }else{
      message.error('请选择至少一个用例')
    }
  } else if (current.value === 2){
    current.value++;
  }
}
const prev = () => {
  current.value--;
};
const selectAllLabels = [
  '单击添加到右侧',
  '拖拽调整执行顺序',
];

async function getTaskInfoData() {
  try {
    // 发请求
    const {success, data} = await queryAnyTaskWithTaskIdApi(queryTaskInfoParameter.value)
    if (success) {
      taskInfoData.value.taskId = data.taskId
      taskInfoData.value.taskName = data.taskName
      taskInfoData.value.taskDescription = data.taskDescription
      taskInfoData.value.projectId = data.projectId
      queryEnvInfoParameter.value.projectId = data.projectId
      await getEnvInfoData()
      taskInfoData.value.crontab = data.crontab
      taskInfoData.value.caseList = data.caseList
      taskInfoData.value.envId = data.envInfo.envId
      taskInfoData.value.notifyType = data.notifyType
      taskInfoData.value.notifyOnlyFail = data.notifyOnlyFail
      taskInfoData.value.notifyReceiver = data.notifyReceiver
      taskInfoData.value.status = data.status
      taskInfoData.value.caseList.forEach(function (item, index) {
        item.index = index
      })
    }
  } catch (error) {
    console.log(error)
  }
}

async function getEnvInfoData() {
  try {
    // 发请求
    const {success, data} = await queryValidEnvWithProjectIdApi(queryEnvInfoParameter.value)
    if (success) {
      envList.value = data
    }
  } catch (error) {
    console.log(error)
  }
}

async function getAllValidUserBaseInfo() {
  try {
    // 发请求
    const {success, data} = await getAllValidUserBaseInfoApi()
    if (success) {
      userList.value = data
    }
  } catch (error) {
    console.log(error)
  }
}

let targetObj = ref()
let sourceObj = ref()
let rowId = ref()

function leftCustomRow(record, index) {
  return {
    style: {
      cursor: "pointer",
    },
    onclick: (event) => {
      // 兼容IE
      var ev = event || window.event;
      ev.target.draggable = true;
      taskInfoData.value.caseList.push(record)
      taskInfoData.value.caseList.forEach(function (item, index) {
        item.index = index
      })
    },
  }
}

function rightCustomRow(record, index) {
  return {
    style: {
      cursor: "move",
    },
    // 鼠标移入
    onMouseenter: (event) => {
      // 兼容IE
      var ev = event || window.event;
      ev.target.draggable = true;
    },
    // 开始拖拽
    onDragstart: (event) => {
      // 兼容IE
      var ev = event || window.event;
      // 阻止冒泡
      ev.stopPropagation();
      // 得到源目标数据
      sourceObj.value = record;
    },
    // 拖动元素经过的元素
    onDragover: (event) => {
      // 兼容 IE
      var ev = event || window.event;
      // 阻止默认行为
      ev.preventDefault();
      // 得到目标数据
      targetObj.value = record;
      // 拖动后同步至stata
      const targetRow = taskInfoData.value.caseList.splice(sourceObj.value.index, 1)[0];
      // 更新到表格数据
      taskInfoData.value.caseList.splice(targetObj.value.index, 0, targetRow);
      taskInfoData.value.caseList.forEach(function (item, index) {
        item.index = index
      })
      const container = document.querySelector('.rightTable'); // 选择容器元素
      const list = container.getElementsByClassName('ant-table-row')
      const node = document.getElementsByClassName('target')
      if (node.length) {
        node[0].classList.remove('target')
        rowId.value = record.index
      }
      list[index].classList.add('target')
    },
    // 鼠标松开
    onDrop: (event) => {
      // 兼容IE
      var ev = event || window.event;
      // 阻止冒泡
      ev.stopPropagation();

      // rowId.value=undefined
      const node = document.getElementsByClassName('target')
      if (node.length) {
        node[0].classList.remove('target')
      }
    },
  };
}

function deleteCase(recordIndex) {
  // 拖动后同步至stata
  taskInfoData.value.caseList.splice(recordIndex, 1);
  // 更新到表格数据
  taskInfoData.value.caseList.forEach(function (item, index) {
    item.index = index
  })
}


let queryCaseInfoParameter = ref({
  projectId: undefined,
  pageNum: 1,
  pageSize: 10
})

let leftPagination = ref({
  current: 1,
  showSizeChanger: false,
  showQuickJumper: false,
  pageSize: 10,
  total: 0,
  onChange: (pageNum) => getCaseInfoData(pageNum),
  showTotal: (total) => `总共有 ${total} 条数据`,
  hideOnSinglePage: true
})

let caseInfoData = ref([])

async function getCaseInfoData(pageNum) {
  try {
    leftPagination.value.current = pageNum
    queryCaseInfoParameter.value.pageNum = pageNum
    // 发请求
    const {success, data} = await queryAnyCaseWithProjectIdApi(queryCaseInfoParameter.value)
    if (success) {
      caseInfoData.value = data.allCaseInfo
      leftPagination.value.total = data.total
    }
  } catch (error) {
    console.log(error)
  }
}

function saveTask() {
  if (!taskInfoData.value.taskId) {
    insertTaskApi(taskInfoData.value).then(response => {
      if (response.success) {
        taskInfoData.value.taskId = response.data
        queryTaskInfoParameter.value.taskId = response.data
        runTaskParameter.value.taskId=response.data
        getTaskInfoData()
        message.success('新增成功');
      } else {
        message.error('新增失败');
      }
    }).catch(error => {
      message.error('新增失败,', error);
    })
  } else if (taskInfoData.value.taskId) {
    updateTaskApi(taskInfoData.value).then(response => {
      if (response.success) {
        getTaskInfoData()
        message.success('更新成功');
      } else {
        message.error('更新失败');
      }
    }).catch(error => {
      message.error('更新失败,', error);
    })
  }
}

function runTask(){
  runTaskApi(runTaskParameter.value).then(response => {
    if (response.success) {
      message.success('执行成功,测试报告id：'+response.data)
    } else {
      message.error('执行失败')
    }
  }).catch(error => {
    message.error('执行失败,', error)
  })
}

onBeforeMount(() => {
  getAllValidUserBaseInfo()
  if (route.query.type === "1") {
    taskInfoData.value.projectId = selectProjectId.value
    queryEnvInfoParameter.value.projectId = taskInfoData.value.projectId
    getEnvInfoData()
  } else if (route.query.type === "2") {
    if (route.query.taskId) {
      queryTaskInfoParameter.value.taskId = parseInt(route.query.taskId)
      runTaskParameter.value.taskId=parseInt(route.query.taskId)
      getTaskInfoData()
    }
  }
  if (selectProjectId.value) {
    queryCaseInfoParameter.value.projectId = selectProjectId.value
    getCaseInfoData(1)
  }
})

</script>

<style>
.target {
  background: #F2F2F2;
}

.steps-content {
  margin: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  padding: 20px;
}
</style>