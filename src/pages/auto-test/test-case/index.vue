<script setup>
import { onBeforeMount } from 'vue';
import { queryCaseWithProjectApi } from '~/api/auto-test/test-case.js';
import { queryEnvWithProjectIdApi } from '~/api/auto-test/env.js';
import { DownOutlined } from '@ant-design/icons-vue';


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
];

let caseInfoData = ref([])
let envList = ref([])
let queryCaseInfoParameter = ref({
    projectId: 1,
    pageNum: 1,
    pageSize: 10
})
let queryEnvInfoParameter = ref({
    projectId: 1
})

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

async function getCaseInfoData(pageNum) {
    try {
        pagination.value.current = pageNum
        queryCaseInfoParameter.value.pageNum = pageNum
        // 发请求
        const { success, data } = await queryCaseWithProjectApi(queryCaseInfoParameter.value)
        if (success) {
            caseInfoData.value = data.allCaseInfo
            pagination.value.total = data.total
        }
    } catch (error) {
        console.log(error)
    }
}

async function getEnvInfoData() {
    try {
        // 发请求
        const { success, data } = await queryEnvWithProjectIdApi(queryEnvInfoParameter.value)
        if (success) {
            envList.value = data
        }
    } catch (error) {
        console.log(error)
    }
}

const actionCase = ({ key }) => {
    console.log(`Click on item ${key}`);
};




onBeforeMount(() => {
    getCaseInfoData(1)
    getEnvInfoData()
})


</script>

<template>
    <div>
        <a-card :bordered="false">
            <a-table :columns="columns" :data-source="caseInfoData" :pagination="pagination">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'status'">
                        <span>
                            <a-switch v-model:checked="record.status" checked-children="启用" :checkedValue='0'
                                un-checked-children="停用" :unheckedValue='1' />
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
                            <a>编辑</a>
                            <a-divider type="vertical" />
                            <a>删除</a>
                            <a-divider type="vertical" />
                            <a-dropdown>
                                <a>执行
                                    <DownOutlined />
                                </a>
                                <template #overlay>
                                    <a-menu @click="actionCase">
                                        <a-menu-item v-for="env in envList" :key="env.envId">
                                            {{ env.envName }}
                                        </a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>

                        </span>
                    </template>
                </template>
            </a-table>
        </a-card>
    </div>
</template>

  
  
<style scoped>
.trend-container2 {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 900px;
    padding-bottom: 0px;
}
</style>