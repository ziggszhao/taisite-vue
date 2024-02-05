<template>
  <div>
    <a-card :bordered="true">
      <a-space>
        <a-input
            ref="searchInputRef"
            placeholder="请输入函数名称查询"
            allow-clear
            v-model:value="searchInput"
        />
        <a-button type="primary" @click="search">查询</a-button>
        <a-button type="primary" @click="reset">重置</a-button>
      </a-space>
    </a-card>
    <a-card :bordered="true">
      <a-table :columns="columns" :data-source="functionViewData" :pagination="pagination">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <span>
              <a @click="copyToClipboard(record.functionMethod)">一键复制</a>
            </span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>

import {message} from "ant-design-vue";

let searchInput = ref('')
function search() {
  functionViewData.value = functionData.value.filter(item =>
      item.functionName.toLowerCase().includes(searchInput.value.toLowerCase())
  )
}

function reset() {
  searchInput.value=''
  search()
}

const columns = [
  {
    title: 'id',
    dataIndex: 'functionId',
    key: 'functionId',
  },
  {
    title: '函数名称',
    dataIndex: 'functionName',
    key: 'functionName',
  },
  {
    title: '函数参数',
    dataIndex: 'functionParameters',
    key: 'functionParameters',
  },
  {
    title: '函数说明',
    dataIndex: 'functionDescription',
    key: 'functionDescription',
  },
  {
    title: '函数使用方法',
    dataIndex: 'functionMethod',
    key: 'functionMethod',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
  }
];
let functionViewData = ref([])
const functionData = ref([
  {
    functionId:1,
    functionName:'getCustomizedLengthRandom',
    functionParameters:'(int length)',
    functionDescription:'生成指定长度随机数',
    functionMethod:'${getCustomizedLengthRandom(length)}'
  },
  {
    functionId:2,
    functionName:'getCustomizedRangeRandom',
    functionParameters:'(int min,int max)',
    functionDescription:'生成指定范围随机数',
    functionMethod:'${getCustomizedRangeRandom(min,max)}'
  },
  {
    functionId:3,
    functionName:'getTimeMillis',
    functionParameters:'()',
    functionDescription:'生成当前时间毫秒级时间戳',
    functionMethod:'${getTimeMillis()}'
  }
])

let pagination = ref({
  defaultPageSize: 10,
  hideOnSinglePage: true
})

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
      .then(function() {
        message.success("已复制到剪切板")
      })
      .catch(function(error) {
        message.error("复制失败")
      });
}

onBeforeMount(()=>{
  functionViewData.value = functionData.value.filter(item =>
      item.functionName.toLowerCase().includes(searchInput.value.toLowerCase())
  )
})
</script>



