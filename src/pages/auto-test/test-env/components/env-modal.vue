<template>

  <a-form
      :model="envInfo"
      :label-col="{ span: 3 }"
      :wrapper-col="{ span: 16 }"
  >
    <a-form-item
        label="环境名称："
        name="envName"
        :rules="[
            { required: true, message: '环境名称不可为空', trigger: 'change'},
            { min: 1,max: 10, message: '长度在1-10之间', trigger: 'change'}
            ]"
    >
      <a-input v-model:value="envInfo.envName"/>
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
            <a-input v-model:value="envInfo.envUrl"/>
          </a-form-item>
          <a-form-item
              label="环境描述："
              name="envDescription"
          >
            <a-input v-model:value="envInfo.envDescription"/>
          </a-form-item>
        </div>
        <nameValue :nameValueInfo="envInfo.envHeader" name="请求头："/>
      </a-tab-pane>
      <a-tab-pane key="2" tab="通用配置">
        <nameValue :nameValueInfo="envInfo.envParameters" name="请求参数："/>
      </a-tab-pane>
      <a-tab-pane key="3" tab="数据库配置">敬请期待</a-tab-pane>
    </a-tabs>
  </a-form>
</template>

<script setup>
import nameValue from '@/pages/auto-test/components/name-value.vue'

let {envInfo, actionModal} = defineProps(['envInfo', 'actionModal'])


const activeKey = ref('1');


const checkUrl = async (_rule, value) => {
  if (value.trim().length === 0) {
    return Promise.resolve();
  }
  if (!value.includes("https://") && !value.includes("http://")) {
    return Promise.reject('域名前请加上"https://"或"http://"');
  }
  return Promise.resolve();
};

</script>