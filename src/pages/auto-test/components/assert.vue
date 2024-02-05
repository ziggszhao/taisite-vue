<template>
  <div>
    <nameValue :nameValueInfo="caseInfoData.caseAsserts" source="assertEdit" :updateNameValue="updateModal"/>
    <a-button type="dashed" block style="height: 40px" @click="insertModal">
      <PlusOutlined/>
      添加一行数据
    </a-button>
    <a-modal v-if="showModal" v-model:open="showModal" title="编辑断言" @ok="actionCaseAssert"
             okText="保存">
      <a-form
          ref="caseAssertFormRef"
          :model="caseAssertRequestParameters"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
      >
        <a-form-item
            label="来源："
            name="source"
            :rules="[{required: true, message: '请选择来源', trigger: 'change'}]"
        >
          <a-select v-model:value="caseAssertRequestParameters.source">
            <a-select-option value="body">
              body
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
          <a-select v-model:value="caseAssertRequestParameters.type">
            <a-select-option value="jsonpath" :disabled="!selectBodyDisabled">
              jsonpath
            </a-select-option>
            <a-select-option value="regex" :disabled="!selectBodyDisabled">
              regex
            </a-select-option>
            <a-select-option value="K/V" :disabled="selectBodyDisabled">
              K/V
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="表达式："
            name="expression"
        >
          <a-input v-model:value="caseAssertRequestParameters.expression" :disabled="!selectBodyDisabled" allow-clear/>
        </a-form-item>
        <a-form-item
            label="比较方法："
            name="operator"
            :rules="[{required: true, message: '请选择比较方法', trigger: 'change'}]"
        >
          <a-select v-model:value="caseAssertRequestParameters.operator">
            <a-select-option value="==">
              ==
            </a-select-option>
            <a-select-option value="!=">
              !=
            </a-select-option>
            <a-select-option value=">=">
              >=
            </a-select-option>
            <a-select-option value=">">
              >
            </a-select-option>
            <a-select-option value="<=">
              <=
            </a-select-option>
            <a-select-option value="<">
              <
            </a-select-option>
            <a-select-option value="not contains">
              not contains
            </a-select-option>
            <a-select-option value="contains">
              contains
            </a-select-option>
            <a-select-option value="not exist">
              not exist
            </a-select-option>
            <a-select-option value="exist">
              exist
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
            label="预期结果："
            name="expected"
            :rules="[{required: true, message: '请填写预期结果', trigger: 'change'}]"
        >
          <a-input v-model:value="caseAssertRequestParameters.expected" allow-clear/>
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

let caseAssertFormRef=ref()
let showModal=ref(false)
let modalType = ref(1)
let caseAssertRequestParameters=ref({})
let actionIndex=ref()

function insertModal(record) {
  caseAssertRequestParameters.value = {
    source: 'body',
    type: 'jsonpath',
    expression: '',
    operator:'==',
    expected:''
  }
  modalType.value = 1
  showModal.value = true
}

let selectBodyDisabled = computed(() => {
  return caseAssertRequestParameters.value.source === 'body'
})

function updateModal(index) {
  actionIndex.value=index
  caseAssertRequestParameters.value =  Object.assign({}, caseInfoData.value.caseAsserts[index])
  modalType.value = 2
  showModal.value = true
}

function actionCaseAssert(){
  caseAssertFormRef.value
      .validate()
      .then(() => {
        if(modalType.value===1) {
          caseInfoData.value.caseAsserts.push(caseAssertRequestParameters.value)
        }
        else if(modalType.value===2) {
          caseInfoData.value.caseAsserts[actionIndex.value]=caseAssertRequestParameters.value
        }
        showModal.value = false
      })
      .catch(error => {
        message.error('请检查参数');
      });
}
</script>