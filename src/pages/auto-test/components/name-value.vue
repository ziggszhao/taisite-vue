<template>
  <div style="margin-left: 10px;margin-right: 10px">
    <div style="font-size: 16px;font-weight: bold;">{{ name }}</div>
    <div>
      <a-table
          :columns="columns"
          :data-source="nameValueInfo"
          :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a-input v-model:value="record.name" allow-clear/>
          </template>
          <template v-if="column.key === 'value'">
            <a-input v-model:value="record.value" allow-clear/>
          </template>
          <template v-if="column.key === 'description'">
            <a-input v-model:value="record.description" allow-clear/>
          </template>
          <template v-if="column.key === 'action'">
            <a @click="deleteRow(record)">删除</a>
          </template>
        </template>
      </a-table>
    </div>
    <a-button type="dashed" block style="height: 40px" @click="insertRow">
      <PlusOutlined/>
      添加一行数据
    </a-button>
  </div>
</template>

<script setup>
import {PlusOutlined} from '@ant-design/icons-vue'

let {
  name,
  nameValueInfo
} = defineProps(['name', 'nameValueInfo'])

const columns = ref([
  {
    title: 'NAME',
    align: 'center',
    width: 70,
    ellipsis: true,
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'VALUE',
    align: 'center',
    width: 80,
    ellipsis: true,
    dataIndex: 'value',
    key: 'value'
  },
  {
    title: 'DESCRIPTION',
    align: 'center',
    width: 80,
    ellipsis: true,
    dataIndex: 'description',
    key: 'description'
  },
  {
    title: '操作',
    align: 'center',
    width: 80,
    key: 'action',
    ellipsis: true,
  }
])

function insertRow() {
  const nameValueRow = ref({
    name: '',
    value: ''
  })
  nameValueInfo.push(nameValueRow.value)
}

function deleteRow(record) {
  nameValueInfo.splice(nameValueInfo.indexOf(record), 1)
}

</script>