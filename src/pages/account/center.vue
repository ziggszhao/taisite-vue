<script setup>
import basicSetting from './components/basic-setting.vue'
import securitySetting from './components/security-setting.vue'
import messageSetting from './components/message-setting.vue'
import {getUserInfoApi, updateUserInfo} from "~/api/common/user.js";
import {UploadOutlined} from '@ant-design/icons-vue'
import {message, Upload} from "ant-design-vue";
import {useUserStore} from "~/stores/user.js";


onBeforeMount(() => {
  getUserInfo()
  baseUrl.value=import.meta.env.VITE_APP_BASE_URL
})

// 获取
let userInfo = ref({})
const userStore = useUserStore()
const getUserInfo = async () => {
  // 获取用户信息
  const {data} = await getUserInfoApi()
  userInfo.value = data
  userInfo.value.userAvatar = userInfo.value.userAvatar + '?' + Math.random()
}

const selectedKeys = ref('1')
const formRef = ref()
const labelCol = {span: 0}
const wrapperCol = {span: 13}
const baseUrl=ref('')
const rules = {
  nickName: [
    {required: true, message: '请输入花名', trigger: 'change'},
    {min: 2, max: 8, message: '花名长度是2-8', trigger: 'blur'},
  ],
  userName: [{required: true, message: '请输入姓名', trigger: 'change'},
    {min: 2, max: 5, message: '姓名长度是2-5', trigger: 'blur'},],
  userGender: [{required: true, message: '请选择性别', trigger: 'change'}],
  userDescription: [{required: true, message: '请输入简介', trigger: 'blur'}],
};

function onSubmit() {
  formRef.value
      .validate()
      .then(async () => {
        // console.log('values', formState, toRaw(formState))
        const {success, data} = await updateUserInfo(userInfo.value)
        if (success && data) {
          message.success('更新成功');
          // 获取用户信息
          await userStore.getUserInfo();
          getUserInfo()
        } else {
          message.error('更新失败');
        }
      })
      .catch((error) => {
        console.log('error', error)
      })
}

const headers = {
  'Access-Token': useAuthorization().value
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 200;
  if (!isLt2M) {
    message.error('Image must smaller than 200MB!');
  }
  return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
};

function handleChange(info) {
  // console.log(fileList)
  if (info.file.status !== 'uploading') {
    console.log(info.file, info.fileList);
  }

  if (info.file.status === 'done') {
    message.success(`${info.file.name} file uploaded successfully`);
    setTimeout(async () => {
      // 获取用户信息
      await userStore.getUserInfo()
      getUserInfo()
    }, 1000);

  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} file upload failed.`);
  }
}
</script>

<template>
  <div>
    <a-row :gutter="16">
      <a-col :xxl="6" :xl="7" :lg="9" :md="10" :sm="24" :xs="24">
        <a-card :bordered="false" style="height:680px">
          <div style="text-align: center;">
            <div class="flex flex-col items-center">
              <a-avatar :size="100">
                <template #icon>
                  <img :src="userInfo.userAvatar" alt="">
                </template>
              </a-avatar>
              <h1 class="mt-4">{{ userInfo.nickName }}</h1>
              <div class="mt-4">{{ userInfo.userDescription }}</div>
            </div>
          </div>
          <div class="mt-4">
            <a-space>
              <UploadOutlined/>
              <div class="ele-cell-content">资深前端工程师</div>
            </a-space>
            <a-space>
              <UploadOutlined/>
              <div class="ele-cell-content">资深前端工程师</div>
            </a-space>
          </div>
          <a-divider dashed/>
          <h6>标签</h6>
          <a-tag>很有想法的</a-tag>
          <a-tag>专注设计</a-tag>
          <a-tag>辣~</a-tag>
          <a-tag>大长腿</a-tag>
          <a-tag>川妹子</a-tag>
          <a-tag>海纳百川</a-tag>
        </a-card>
      </a-col>
      <a-col :xxl="18" :xl="17" :lg="15" :md="14" :sm="24" :xs="24">
        <a-card style="height:680px">
          <a-tabs v-model:active-key="selectedKeys" size="large">
            <a-tab-pane key="1" tab="基本信息">
              <a-card :bordered="false">
                <a-row>
                  <a-col :span="12">
                    <a-form ref="formRef" :model="userInfo" :rules="rules" :label-col="labelCol"
                            :wrapper-col="wrapperCol">
                      <a-form-item :label-col="{ span: 24 }" label="花名" name="nickName">
                        <a-input v-model:value="userInfo.nickName" placeholder="请输入你的花名" :disabled="true"
                                 style="width: 320px;"/>
                      </a-form-item>
                      <a-form-item :label-col="{ span: 24 }" label="姓名" name="userName">
                        <a-input v-model:value="userInfo.userName" placeholder="请输入你的姓名" style="width: 320px;"/>
                      </a-form-item>
                      <a-form-item label="性别" :label-col="{ span: 24 }" name="userGender">
                        <a-select v-model:value="userInfo.userGender" style="width: 320px">
                          <a-select-option :value="0">女</a-select-option>
                          <a-select-option :value="1">男</a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item name="userDescription" label="用户简介" :label-col="{ span: 24 }">
                        <a-textarea v-model:value="userInfo.userDescription" placeholder="请输入用户简介"/>
                      </a-form-item>
                      <a-form-item>
                        <a-button type="primary" @click="onSubmit">
                          提交
                        </a-button>
                      </a-form-item>
                    </a-form>
                  </a-col>
                  <a-col :span="4">
<!--                    <p>-->
<!--                      用户头像-->
<!--                    </p>-->
                    <div class="flex flex-col items-center">
                      <a-avatar :size="100">
                        <template #icon>
                          <img :src="userInfo.userAvatar" alt="">
                        </template>
                      </a-avatar>
                      <a-upload name="file" :headers="headers" :max-count="1" :before-upload="beforeUpload"
                                @change="handleChange"
                                :action="baseUrl+'/api/user/uploadUserAvatar'"
                                :show-upload-list="false">
                        <a-button class="mt-4">
                          <UploadOutlined/>
                          上传头像
                        </a-button>
                      </a-upload>
                    </div>
                  </a-col>
                </a-row>
              </a-card>
            </a-tab-pane>
            <a-tab-pane key="2" tab="安全设置">
              <securitySetting/>
            </a-tab-pane>
            <a-tab-pane key="3" tab="新消息通知">
              <messageSetting/>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped lang="less">

</style>
