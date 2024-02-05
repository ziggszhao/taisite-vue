<template>
  <div>
    <a-card :bordered="true">
      <a-space>
        <a-input
            ref="searchInputRef"
            placeholder="请输入项目名称查询"
            allow-clear
            v-model:value="searchInput"
            @change="search"/>
        <a-button ref="insertButtonRef" type="primary" @click="insertModal">新增环境</a-button>
      </a-space>
    </a-card>
    <a-card :bordered="true">
      <a-table ref="envTableRef" :columns="columns" :data-source="envInfoViewData" :pagination="pagination">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
                        <span>
                            <a-switch v-model:checked="record.status" checked-children="启用" :checkedValue='0'
                                      un-checked-children="停用" :unheckedValue='1'
                                      @change="changeEnvStatus(record.envId)"/>
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
                            <a @click="updateModal(record)">编辑</a>
                            <a-divider type="vertical"/>
                           <a-popconfirm
                               title="确认删除？"
                               ok-text="确认"
                               cancel-text="取消"
                               @confirm="deleteEnv(record.envId)"
                           >
                            <a>删除</a>
                             </a-popconfirm>
                        </span>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal v-if="showModal" v-model:open="showModal" title="环境配置" style="width: 800px" @ok="actionEnv"
             okText="保存">
      <a-form
          ref="envFormRef"
          :model="envInfoRequestParameters"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 16 }"
      >
        <a-form-item
            label="环境名称："
            name="envName"
            :rules="[
            { validator: checkName, trigger: 'change'}
            ]"
        >
          <a-input v-model:value="envInfoRequestParameters.envName"/>
        </a-form-item>
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="HTTP配置">
            <div style="margin-left: 10px;margin-right: 10px">
              <div style="font-size: 16px;font-weight: bold;">环境信息</div>
              <a-form-item
                  label="环境域名："
                  name="envUrl"
                  :rules="[
            { validator: checkUrl, trigger: 'change'}
            ]"
              >
                <a-input v-model:value="envInfoRequestParameters.envUrl"/>
              </a-form-item>
              <a-form-item
                  label="环境描述："
                  name="envDescription"
              >
                <a-input v-model:value="envInfoRequestParameters.envDescription"/>
              </a-form-item>
            </div>
            <nameValue :nameValueInfo="envInfoRequestParameters.envHeader" name="请求头：" source='headersEdit'/>
          </a-tab-pane>
          <a-tab-pane key="2" tab="通用配置">
            <nameValue :nameValueInfo="envInfoRequestParameters.envParameters" name="请求参数："
                       source='envParametersEdit'/>
          </a-tab-pane>
          <a-tab-pane key="3" tab="数据库配置">
            <a-result title="努力建设中..." sub-title="请再给我一点点时间..."/>
          </a-tab-pane>
        </a-tabs>
      </a-form>
    </a-modal>
    <a-tour v-model:current="current" :open="tourOpen" :steps="steps" @close="handleTourOpen(false)" />
  </div>
</template>

<script setup>
import {onBeforeMount} from 'vue';
import {
  queryAnyEnvWithProjectIdApi,
  updateEnvApi,
  insertEnvApi,
  changeEnvStatusApi,
  deleteEnvApi
} from '~/api/auto-test/env.js';
import nameValue from '@/pages/auto-test/components/name-value.vue'
import {message} from 'ant-design-vue';
import {useTourHistory} from "~/composables/tour-history.js";
import {useRoute} from "vue-router";

const columns = [
  {
    title: '环境ID',
    dataIndex: 'envId',
    key: 'envId',
    align: 'center',
    width: 80
  },
  {
    title: '环境名称',
    dataIndex: 'envName',
    key: 'envName',
    align: 'center',
    ellipsis: true
  },
  {
    title: '备注',
    dataIndex: 'envDescription',
    key: 'envDescription',
    align: 'center',
    ellipsis: true
  },
  {
    title: '状态',
    dataIndex: 'status',
    align: 'center',
    key: 'status',
  },
  {
    title: '创建人',
    dataIndex: 'createdBy',
    key: 'createdBy',
    align: 'center',
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
    align: 'center',
    ellipsis: true
  },
  {
    title: '更新人',
    dataIndex: 'updatedBy',
    key: 'updatedBy',
    align: 'center',
    ellipsis: true
  },
  {
    title: '更新时间',
    dataIndex: 'updatedTime',
    key: 'updatedTime',
    align: 'center',
    ellipsis: true
  },
  {
    title: '操作',
    key: 'action',
    align: 'center',
    width: 200
  },
];

let selectProjectId = useSelectProjectId()
watch(() => selectProjectId, (newValue, oldValue) => {
  queryEnvInfoParameter.value.projectId = newValue
  getEnvInfoData(1)
}, {deep: true})
const envFormRef = ref();
let envInfoData = ref([])
let envInfoViewData = ref([])
let envInfoRequestParameters = ref({})
let modalType = ref(1)
let queryEnvInfoParameter = ref({
  projectId: undefined
})
let actionEnvInfoParameter = ref({
  envId: undefined
})
const activeKey = ref('1');
let showModal = ref(false)
let pagination = ref({
  defaultPageSize: 10,
  hideOnSinglePage: true
})
let searchInput = ref('')

async function getEnvInfoData() {
  try {
    // 发请求
    const {success, data} = await queryAnyEnvWithProjectIdApi(queryEnvInfoParameter.value)
    if (success) {
      envInfoData.value = data
      envInfoViewData.value = data
    }
  } catch (error) {
    console.log(error)
  }
}

async function changeEnvStatus(envId) {
  actionEnvInfoParameter.value.envId = envId
  try {
    // 发请求
    const {success} = await changeEnvStatusApi(actionEnvInfoParameter.value)
    if (success) {
      await getEnvInfoData()
    }
  } catch (error) {
    console.log(error)
  }
}

async function deleteEnv(envId) {
  actionEnvInfoParameter.value.envId = envId
  try {
    // 发请求
    const {success} = await deleteEnvApi(actionEnvInfoParameter.value)
    if (success) {
      await getEnvInfoData()
    }
  } catch (error) {
    console.log(error)
  }
}

function insertModal(record) {
  envInfoRequestParameters.value = {
    envName: '',
    envUrl: '',
    envHeader: [],
    envParameters: [],
    envDatabase: [],
    projectId: queryEnvInfoParameter.value.projectId
  }
  modalType.value = 1
  showModal.value = true
}

function updateModal(record) {
  envInfoRequestParameters.value = Object.assign({}, record)
  modalType.value = 2
  showModal.value = true
}

function actionEnv() {
  envFormRef.value
      .validate()
      .then(async () => {
        if (modalType.value === 1) {
          try {
            // 发请求
            const {success} = await insertEnvApi(envInfoRequestParameters.value)
            if (success) {
              message.success('新增成功');
              showModal.value = false
              await getEnvInfoData()
            } else {
              message.error('新增失败');
            }
          } catch (error) {
            message.error(error);
          }
        } else if (modalType.value === 2) {
          try {
            // 发请求
            const {success} = await updateEnvApi(envInfoRequestParameters.value)
            if (success) {
              message.success('更新成功');
              showModal.value = false
              await getEnvInfoData()
            } else {
              message.error('更新失败');
            }
          } catch (error) {
            message.error(error);
          }
        }
        clearSearchInput()
      })
      .catch(error => {
        message.error('请检查参数');
      });
}

const checkUrl = async (_rule, value) => {
  if (value.trim().length === 0) {
    return Promise.resolve();
  }
  if (!value.includes("https://") && !value.includes("http://")) {
    return Promise.reject('域名前请加上"https://"或"http://"');
  }
  return Promise.resolve();
};

const checkName = async (_rule, value) => {
  if (value.trim().length === 0) {
    return Promise.reject('请填写环境名称');
  }
  if (value.trim().length < 1 || value.trim().length > 10) {
    return Promise.reject('环境名称长度应为1-10之间');
  }
  return Promise.resolve();
};

function search() {
  envInfoViewData.value = envInfoData.value.filter(item =>
      item.envName.toLowerCase().includes(searchInput.value.toLowerCase())
  )
}

function clearSearchInput() {
  searchInput.value = ''
}

const route = useRoute()
let tourHistory = useTourHistory()
let insertButtonRef=ref()
let searchInputRef=ref()
let envTableRef=ref()
let tourOpen=ref(false)
let current = ref(0)
const steps = [
  {
    title: '查找环境',
    description: '在此输入查找环境.',
    target: () => searchInputRef.value && searchInputRef.value.$el,
  },
  {
    title: '新增环境',
    description: '点击新增环境.',
    target: () => insertButtonRef.value && insertButtonRef.value.$el,
  },
  {
    title: '环境列表',
    description: '所有环境都展示在表格内.',
    target: () => envTableRef.value && envTableRef.value.$el,
  }
]


function handleTourOpen(val){
  if(val){
    if(!tourHistory.value.includes(route.name)){
      tourOpen.value=true
      tourHistory.value.push(route.name)
    }
  }
  else{
    tourOpen.value = val;
  }
}

onBeforeMount(() => {
  if (selectProjectId.value) {
    queryEnvInfoParameter.value.projectId = selectProjectId.value
    getEnvInfoData()
  }
  handleTourOpen(true)
})
</script>
