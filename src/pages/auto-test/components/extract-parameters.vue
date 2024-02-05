<template>
  <div>
    <nameValue :nameValueInfo="caseInfoData.caseExtractParameters" source="extractEdit"
               :updateNameValue="updateModal"/>
    <a-button type="dashed" block style="height: 40px" @click="insertModal">
      <PlusOutlined/>
      添加一行数据
    </a-button>
    <a-modal v-if="showModal" v-model:open="showModal" title="编辑提参" @ok="actionCaseExtract"
             okText="保存">
      <a-form
          ref="caseExtractFormRef"
          :model="caseExtractRequestParameters"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
      >
        <a-form-item
            label="出参名称："
            name="name"
            :rules="[{required: true, message: '请填写出参名称', trigger: 'change'}]"
        >
          <a-input v-model:value="caseExtractRequestParameters.name"/>
        </a-form-item>
        <a-form-item
            label="来源："
            name="source"
            :rules="[{required: true, message: '请选择来源', trigger: 'change'}]"
        >
          <a-select v-model:value="caseExtractRequestParameters.source">
            <a-select-option value="body">
              body
            </a-select-option>
            <a-select-option value="header">
              header
            </a-select-option>
            <a-select-option value="cookie">
              cookie
            </a-select-option>
            <a-select-option value="httpStatus">
              httpStatus
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="提取方式："
            name="type"
            :rules="[{required: true, message: '请选择提取方式', trigger: 'change'}]"
        >
          <a-select v-model:value="caseExtractRequestParameters.type">
            <a-select-option :disabled="!selectBodyDisabled" value="jsonpath">
              jsonpath
            </a-select-option>
            <a-select-option :disabled="!selectBodyDisabled" value="regex">
              regex
            </a-select-option>
            <a-select-option :disabled="selectBodyDisabled" value="K/V">
              K/V
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="表达式："
            name="expression"
            :rules="[{required: true, message: '请填写表达式', trigger: 'change'}]"
        >
          <a-input v-model:value="caseExtractRequestParameters.expression" allow-clear/>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import nameValue from "~/pages/auto-test/components/name-value.vue";
import {message} from "ant-design-vue";
import {PlusOutlined} from "@ant-design/icons-vue";

let caseInfoData = inject("caseInfoData")

let caseExtractFormRef = ref()
let showModal = ref(false)
let modalType = ref(1)
let caseExtractRequestParameters = ref({})
let actionIndex = ref()

let selectBodyDisabled = computed(() => {
  return caseExtractRequestParameters.value.source === 'body'
})


function insertModal(record) {
  caseExtractRequestParameters.value = {
    name: '',
    source: 'body',
    type: 'jsonpath',
    expression: ''
  }
  modalType.value = 1
  showModal.value = true
}

function updateModal(index) {
  actionIndex.value = index
  caseExtractRequestParameters.value = Object.assign({}, caseInfoData.value.caseExtractParameters[index])
  modalType.value = 2
  showModal.value = true
}

function actionCaseExtract() {
  caseExtractFormRef.value
      .validate()
      .then(() => {
        if (modalType.value === 1) {
          caseInfoData.value.caseExtractParameters.push(caseExtractRequestParameters.value)
        } else if (modalType.value === 2) {
          caseInfoData.value.caseExtractParameters[actionIndex.value] = caseExtractRequestParameters.value
        }
        showModal.value = false
      })
      .catch(error => {
        message.error('请检查参数');
      });
}
</script>