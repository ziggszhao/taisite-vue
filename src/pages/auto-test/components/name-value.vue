<template>
  <div style="margin-left: 10px;margin-right: 10px">
    <div v-if="name" style="font-size: 16px;font-weight: bold;">{{ name }}</div>
    <div>
      <a-table
          :columns="columns"
          :data-source="nameValueInfo"
          :pagination="false"
      >
        <template #headerCell="{ column }">
          <template v-if="column.key === 'isTasKParameters'">
              <span>
                是否放入变量池
                <a-tooltip>
                  <template #title>默认在测试用例内生效，放入变量池后在测试任务内生效</template>
                  <QuestionCircleOutlined/>
                </a-tooltip>
              </span>
          </template>
        </template>
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'name'">
            <a-input v-if="source==='urlParamsEdit'" v-model:value="record.name" allow-clear
                     @change="updateNameValue"/>
            <a-input v-else-if="source==='headersEdit'||source==='envParametersEdit'" v-model:value="record.name"
                     allow-clear/>
            <a-input v-else-if="source==='caseParametersEdit'" v-model:value="record.name" allow-clear/>
            <span v-else-if="source==='extractEdit'">{{ record.name }}</span>
            <span v-else-if="source==='commonShow'">{{ record.name }}</span>
          </template>
          <template v-if="column.key === 'value'">
            <a-input v-if="source==='urlParamsEdit'" v-model:value="record.value" allow-clear
                     @change="updateNameValue"/>
            <a-input v-else-if="source==='headersEdit'||source==='envParametersEdit'" v-model:value="record.value"
                     allow-clear/>
            <a-input v-else-if="source==='caseParametersEdit'" v-model:value="record.value" allow-clear/>
            <span v-else-if="source==='commonShow'">{{ record.value }}</span>
          </template>
          <template v-if="column.key === 'isTasKParameters'">
            <a-checkbox v-model:checked="record.isTasKParameters">放入变量池</a-checkbox>
          </template>
          <template v-if="column.key === 'description'">
            <a-input v-model:value="record.description" allow-clear/>
          </template>
          <template v-if="column.key === 'source'">
            <span>{{ record.source }}</span>
          </template>
          <template v-if="column.key === 'type'">
            <span>{{ record.type }}</span>
          </template>
          <template v-if="column.key === 'expression'">
            <span>{{ record.expression }}</span>
          </template>
          <template v-if="column.key === 'operator'">
            <span>{{ record.operator }}</span>
          </template>
          <template v-if="column.key === 'expected'">
            <span>{{ record.expected }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <a v-if="source==='extractEdit'||source==='assertEdit'" @click="updateNameValue(index)">编辑</a>
            <a-divider v-if="source==='extractEdit'||source==='assertEdit'" type="vertical"/>
            <a @click="deleteRow(record)">删除</a>
          </template>
        </template>
      </a-table>
    </div>
    <a-button v-if="!(source==='extractEdit'||source==='assertEdit'||source==='commonShow')" type="dashed" block
              style="height: 40px" @click="insertRow">
      <PlusOutlined/>
      添加一行数据
    </a-button>
  </div>
</template>

<script setup>
import {PlusOutlined, QuestionCircleOutlined} from '@ant-design/icons-vue'


const props = defineProps({
  name: {
    type: String,
    default: '',
    required: false // 是否必传
  },
  nameValueInfo: {
    type: Array,
    default: () => [],
    required: true // 是否必传
  },
  source: {
    type: String,
    default: 'headers',
    required: false // 是否必传
  },
  updateNameValue: {
    type: Function,
    required: false // 是否必传
  }
})

let {
  name,
  nameValueInfo,
  source,
  updateNameValue
} = props

let columns = ref()

const headersEditColumns = ref([
  {
    title: 'NAME',
    align: 'center',
    ellipsis: true,
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'VALUE',
    align: 'center',
    ellipsis: true,
    dataIndex: 'value',
    key: 'value'
  },
  {
    title: 'DESCRIPTION',
    align: 'center',
    ellipsis: true,
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: '操作',
    align: 'center',
    key: 'action',
    ellipsis: true,
  }
])

const urlParamsEditColumns = ref([
  {
    title: 'NAME',
    align: 'center',
    ellipsis: true,
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'VALUE',
    align: 'center',
    ellipsis: true,
    dataIndex: 'value',
    key: 'value'
  },
  {
    title: '操作',
    align: 'center',
    key: 'action',
    ellipsis: true,
  }
])

const extractParametersEditColumns = ref([
  {
    title: '出参名称',
    dataIndex: 'name',
    key: 'name',
    width: '20%'
  },
  {
    title: '来源',
    dataIndex: 'source',
    key: 'source',
    width: '20%'
  },
  {
    title: '提取方法',
    dataIndex: 'type',
    key: 'type',
    width: '20%'
  },
  {
    title: '表达式',
    dataIndex: 'expression',
    key: 'expression',
    width: '20%'
  },
  {
    title: '操作',
    key: 'action',
    width: '20%'
  }
])

const assertEditColumns = ref([
  {
    title: '来源',
    dataIndex: 'source',
    key: 'source',
    width: '16%'
  },
  {
    title: '提取方法',
    dataIndex: 'type',
    key: 'type',
    width: '16%'
  },
  {
    title: '表达式',
    dataIndex: 'expression',
    key: 'expression',
    width: '16%'
  },
  {
    title: '比较方法',
    dataIndex: 'operator',
    key: 'operator',
    width: '16%'
  },
  {
    title: '预期结果',
    dataIndex: 'expected',
    key: 'expected',
    width: '16%'
  },
  {
    title: '操作',
    key: 'action',
  }
])

const caseParamsEditColumns = ref([
  {
    title: '变量名',
    align: 'center',
    ellipsis: true,
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '变量值',
    align: 'center',
    ellipsis: true,
    dataIndex: 'value',
    key: 'value'
  },
  {
    name: '是否放入变量池(默认在测试用例内生效，放入变量池后在任务内生效)',
    align: 'center',
    dataIndex: 'isTasKParameters',
    key: 'isTasKParameters'
  },
  {
    title: '操作',
    align: 'center',
    key: 'action',
    ellipsis: true,
  }
])

const commonShowColumns = ref([
  {
    title: 'NAME',
    align: 'center',
    ellipsis: true,
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'VALUE',
    align: 'center',
    ellipsis: true,
    dataIndex: 'value',
    key: 'value'
  }
])

function insertRow() {
  if (source === 'urlParamsEdit') {
    const nameValueRow = ref({
      name: '',
      value: ''
    })
    nameValueInfo.push(nameValueRow.value)
  } else if (source === 'headersEdit' || source === 'envParametersEdit') {
    const nameValueRow = ref({
      name: '',
      value: '',
      description: ''
    })
    nameValueInfo.push(nameValueRow.value)
  } else if (source === 'caseParametersEdit') {
    const nameValueRow = ref({
      name: '',
      value: '',
      isTasKParameters: false
    })
    nameValueInfo.push(nameValueRow.value)
  }
}

function deleteRow(record) {
  nameValueInfo.splice(nameValueInfo.indexOf(record), 1)
  if (source === 'urlParams') {
    updateNameValue()
  }
}

onBeforeMount(() => {
  if (source === 'urlParamsEdit') {
    columns.value = urlParamsEditColumns.value
  } else if (source === 'headersEdit' || source === 'envParametersEdit') {
    columns.value = headersEditColumns.value
  } else if (source === 'caseParametersEdit') {
    columns.value = caseParamsEditColumns.value
  } else if (source === 'extractEdit') {
    columns.value = extractParametersEditColumns.value
  } else if (source === 'assertEdit') {
    columns.value = assertEditColumns.value
  } else if (source === 'commonShow') {
    columns.value = commonShowColumns.value
  }
})
</script>