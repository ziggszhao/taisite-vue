<script setup>
import {UploadOutlined} from '@ant-design/icons-vue'
import {updateUserInfo} from '~/api/common/user'
import {message, Upload} from 'ant-design-vue';

let {userInfo,getUserInfo} = defineProps(['userInfo','getUserInfo'])

onBeforeMount(() => {
  console.log(userInfo)
  // formState.userId = userInfo.userId
  // formState.nickName = userInfo.nickName
  // formState.userName = userInfo.userName
  // formState.userDescription = userInfo.userDescription
  // formState.userGender = userInfo.userGender
})

// 获取
const userStore = useUserStore()
const formRef = ref()
const labelCol = {span: 0}
const wrapperCol = {span: 13}
const formState = reactive({
  userId: userStore.userInfo.userId,
  nickName: userStore.userInfo.nickName,
  userName: userStore.userInfo.userName,
  userDescription: userStore.userInfo.userDescription,
  userGender: userStore.userInfo.userGender
})

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
        const {success, data} = await updateUserInfo(formState)
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
  <a-card :bordered="false">
    <a-row>
      <a-col :span="12">
        <a-form ref="formRef" :model="formState" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item :label-col="{ span: 24 }" label="花名" name="nickName">
            <a-input v-model:value="formState.nickName" placeholder="请输入你的花名" :disabled="true"
                     style="width: 320px;"/>
          </a-form-item>
          <a-form-item :label-col="{ span: 24 }" label="姓名" name="userName">
            <a-input v-model:value="formState.userName" placeholder="请输入你的姓名" style="width: 320px;"/>
          </a-form-item>
          <a-form-item label="性别" :label-col="{ span: 24 }" name="userGender">
            <a-select v-model:value="formState.userGender" style="width: 320px">
              <a-select-option :value="0">女</a-select-option>
              <a-select-option :value="1">男</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item name="userDescription" label="用户简介" :label-col="{ span: 24 }">
            <a-textarea v-model:value="formState.userDescription" placeholder="请输入用户简介"/>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" @click="onSubmit">
              提交
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :span="4">
        <p>
          用户头像
        </p>
        <div class="flex flex-col items-center">
          <a-avatar :size="100">
            <template #icon>
              <img :src="userStore.userInfo.userAvatar" alt="">
            </template>
          </a-avatar>
          <a-upload name="file" :headers="headers" :max-count="1" :before-upload="beforeUpload" @change="handleChange"
                    action="http://127.0.0.1:9999/api/user/uploadUserAvatar" :show-upload-list="false">
            <a-button class="mt-4">
              <UploadOutlined/>
              上传头像
            </a-button>
          </a-upload>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>
