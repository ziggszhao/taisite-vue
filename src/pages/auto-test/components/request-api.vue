<template>
  <div>
    <a-form
        ref="caseRequestFormRef"
        :model="caseInfoData"
    >
      <a-row>
        <a-col :span="8">
          <a-form-item
              label="请求方式："
              name="caseRequestMethod"
              :rules="[{required: true, message: '请选择请求方式', trigger: 'change'}]"
          >
            <a-select v-model:value="caseInfoData.caseRequestMethod" style="width: 160px;">
              <a-select-option value="GET">
                GET
              </a-select-option>
              <a-select-option value="POST">
                POST
              </a-select-option>
              <a-select-option value="PUT">
                PUT
              </a-select-option>
              <a-select-option value="DELETE">
                DELETE
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item
              label="请求地址："
              name="caseRequestUrl"
              :rules="[{required: true, message: '请填写请求地址', trigger: 'change'}]"
          >
            <a-input v-model:value="caseInfoData.caseRequestUrl"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-item
              label="请求前等待（单位：ms）："
              name="beforeRequestDelay"
              :rules="[{required: true, message: '请填写等待时间', trigger: 'change'}]"
              :wrapper-col="{ span: 8 }"
          >
            <a-input-number v-model:value="caseInfoData.beforeRequestDelay" :min="0" :max="9999" :controls="false"
                            addon-after="ms"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
              label="请求后等待（单位：ms）："
              name="afterRequestDelay"
              :rules="[{required: true, message: '请填写等待时间', trigger: 'change'}]"
              :wrapper-col="{ span: 8 }"
          >
            <a-input-number v-model:value="caseInfoData.afterRequestDelay" :min="0" :max="9999" :controls="false"
                            addon-after="ms"/>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
              label="失败重试次数："
              name="retryTimes"
              :rules="[{required: true, message: '请填写失败重试次数', trigger: 'change'}]"
              :wrapper-col="{ span: 8 }"
          >
            <a-input-number v-model:value="caseInfoData.retryTimes" :min="0" :max="3" :controls="false"
                            addon-after="次"/>
          </a-form-item>
        </a-col>
      </a-row>
      <a-tabs v-model:activeKey="requestActiveKey">
        <a-tab-pane key="1" tab="Params">
          <nameValue :nameValueInfo="paramsList" source="urlParamsEdit" :updateNameValue="updateRequestUrl"/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="Headers">
          <nameValue :nameValueInfo="caseInfoData.caseRequestHeader" source="headersEdit"/>
        </a-tab-pane>
        <a-tab-pane key="3" tab="Body">
          <div style="display: flex;justify-content: flex-end;align-items:center">
            <div style="margin-right: auto;">
              <a-radio-group v-model:value="caseInfoData.caseRequestBodyType" style="margin: 20px">
                <a-radio :value="0">
                  none
                </a-radio>
                <a-radio :value="1" :disabled="true">
                  form-data(待支持)
                </a-radio>
                <a-radio :value="2" :disabled="true">
                  x-www-form-urlencoded(待支持)
                </a-radio>
                <a-radio
                    v-if="caseInfoData.caseRequestBodyType===3
                ||caseInfoData.caseRequestBodyType===0
                ||caseInfoData.caseRequestBodyType===1
                ||caseInfoData.caseRequestBodyType===2
                ||caseInfoData.caseRequestBodyType===8
                ||caseInfoData.caseRequestBodyType===9"
                    :value="3">
                  raw
                </a-radio>
                <a-radio
                    v-if="caseInfoData.caseRequestBodyType===4"
                    :value="4">
                  raw
                </a-radio>
                <a-radio
                    v-if="caseInfoData.caseRequestBodyType===5"
                    :value="5">
                  raw
                </a-radio>
                <a-radio
                    v-if="caseInfoData.caseRequestBodyType===6"
                    :value="6">
                  raw
                </a-radio>
                <a-radio
                    v-if="caseInfoData.caseRequestBodyType===7"
                    :value="7">
                  raw
                </a-radio>
                <a-radio :value="8" :disabled="true">
                  binary(待支持)
                </a-radio>
                <a-radio :value="9" :disabled="true">
                  GraphQL(待支持)
                </a-radio>
              </a-radio-group>
              <a-dropdown
                  v-if="caseInfoData.caseRequestBodyType===3
                ||caseInfoData.caseRequestBodyType===4
                ||caseInfoData.caseRequestBodyType===5
                ||caseInfoData.caseRequestBodyType===6
                ||caseInfoData.caseRequestBodyType===7">
                <a class="ant-dropdown-link" @click.prevent>
                  {{ caseRequestBodyTypeStr }}
                  <DownOutlined/>
                </a>
                <template #overlay>
                  <a-menu @click="changeRequestBodyType">
                    <a-menu-item key="3">
                      Text
                    </a-menu-item>
                    <a-menu-item key="4">
                      JavaScript
                    </a-menu-item>
                    <a-menu-item key="5">
                      JSON
                    </a-menu-item>
                    <a-menu-item key="6">
                      HTML
                    </a-menu-item>
                    <a-menu-item key="7">
                      XML
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
            <div>
              <a
                  @click="prettyFormat"
                  v-if="caseInfoData.caseRequestBodyType===4
                ||caseInfoData.caseRequestBodyType===5
                ||caseInfoData.caseRequestBodyType===6
                ||caseInfoData.caseRequestBodyType===7"
              >Beautify(美化格式)</a>
            </div>
          </div>
          <div style="height: 257px;text-align: center;line-height: 257px;font-size: 20px"
               v-if="caseInfoData.caseRequestBodyType===0">This request does not have a body
          </div>
          <v-ace-editor
              v-if="caseInfoData.caseRequestBodyType===3
                ||caseInfoData.caseRequestBodyType===4
                ||caseInfoData.caseRequestBodyType===5
                ||caseInfoData.caseRequestBodyType===6
                ||caseInfoData.caseRequestBodyType===7"
              v-model:value="caseInfoData.caseRequestBody"
              style="height: 300px;font-size: 16px"
              ref="requestBodyEditor"
              :lang="lang"
              :theme="theme"
              placeholder="Please enter the body."
              :options="{
                useWorker: true,
                enableBasicAutocompletion: true,// 启用基本自动完成
                enableSnippets: true,// 启用代码段
                enableLiveAutocompletion: true,// 启用实时自动完成
                showPrintMargin: false, //去除编辑器里的竖线
                showLineNumbers:true //显示行号
              }"
          />
        </a-tab-pane>
      </a-tabs>
    </a-form>
  </div>
</template>

<script setup>
import nameValue from "~/pages/auto-test/components/name-value.vue";
import {js_beautify, html_beautify} from 'js-beautify'
import {VAceEditor} from 'vue3-ace-editor';
import '~/config/ace-config.js';
import {DownOutlined} from '@ant-design/icons-vue';
import {isDark} from '~/composables/theme'


let caseInfoData = inject("caseInfoData")
let requestActiveKey = ref("1")
let paramsList = ref([])
let caseRequestBodyTypeStr = ref('')
let caseRequestFormRef = ref()
let lang = computed(() => {
  if (caseInfoData.value.caseRequestBodyType === 3) {
    return "text"
  } else if (caseInfoData.value.caseRequestBodyType === 4) {
    return "javascript"
  } else if (caseInfoData.value.caseRequestBodyType === 5) {
    return "json"
  } else if (caseInfoData.value.caseRequestBodyType === 6) {
    return "html"
  } else if (caseInfoData.value.caseRequestBodyType === 7) {
    return "xml"
  }
})
let theme = computed(() => {
  if (isDark.value) {
    return "one_dark"
  } else {
    return "github"
  }
})

function getParams(url) {
  paramsList.value.length = 0
  let queryString = url.split('?')[1];
  if (queryString) {
    // 创建URLSearchParams对象
    let urlSearchParams = new URLSearchParams(queryString);
    // 遍历所有的查询参数
    urlSearchParams.forEach((value, name) => {
      let params = {};
      params.name = name
      params.value = value
      paramsList.value.push(params)
    })
  }
}

function updateRequestUrl() {
  caseInfoData.value.caseRequestUrl = caseInfoData.value.caseRequestUrl.split('?')[0]
  if (paramsList.value.length !== 0) {
    caseInfoData.value.caseRequestUrl = caseInfoData.value.caseRequestUrl + '?' + paramsList.value[0].name + '=' + paramsList.value[0].value
    for (let i = 1, len = paramsList.value.length; i < len; i++) {
      caseInfoData.value.caseRequestUrl = caseInfoData.value.caseRequestUrl + '&' + paramsList.value[i].name + '=' + paramsList.value[i].value
    }
  }
}

function changeRequestBodyType({key}) {
  if (key === '3') {
    caseInfoData.value.caseRequestBodyType = 3
  } else if (key === '4') {
    caseInfoData.value.caseRequestBodyType = 4
  } else if (key === '5') {
    caseInfoData.value.caseRequestBodyType = 5
  } else if (key === '6') {
    caseInfoData.value.caseRequestBodyType = 6
  } else if (key === '7') {
    caseInfoData.value.caseRequestBodyType = 7
  }
}

watch(() => caseInfoData.value.caseRequestUrl, (newValue, oldValue) => {
  getParams(newValue)
}, {deep: true, immediate: true})

watch(() => caseInfoData.value.caseRequestBodyType, (newValue, oldValue) => {
  getCaseRequestBodyTypeStr(newValue)
}, {deep: true, immediate: true})

function getCaseRequestBodyTypeStr(caseRequestBodyType) {
  if (caseRequestBodyType === 3) {
    caseRequestBodyTypeStr.value = 'Text'
  } else if (caseRequestBodyType === 4) {
    caseRequestBodyTypeStr.value = 'JavaScript'
  } else if (caseRequestBodyType === 5) {
    caseRequestBodyTypeStr.value = 'JSON'
  } else if (caseRequestBodyType === 6) {
    caseRequestBodyTypeStr.value = 'HTML'
  } else if (caseRequestBodyType === 7) {
    caseRequestBodyTypeStr.value = 'XML'
  } else {
    caseRequestBodyTypeStr.value = 'Text'
  }
}

function prettyFormat() {
  if (caseInfoData.value.caseRequestBodyType === 4 || caseInfoData.value.caseRequestBodyType === 5) {
    caseInfoData.value.caseRequestBody = js_beautify(caseInfoData.value.caseRequestBody)
  } else if (caseInfoData.value.caseRequestBodyType === 6) {
    caseInfoData.value.caseRequestBody = html_beautify(caseInfoData.value.caseRequestBody)
  }
}

defineExpose({caseRequestFormRef})
</script>