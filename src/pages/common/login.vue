<script setup>
import {
  AlipayCircleFilled,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleFilled,
  UserOutlined,
  WeiboCircleFilled
} from '@ant-design/icons-vue'
import {delayTimer} from '@v-c/utils'
import {AxiosError} from 'axios'
import GlobalLayoutFooter from '~/layouts/components/global-footer/index.vue'
import {loginApi} from '@/api/common/login'
import {getQueryParam} from '~/utils/tools'
import pageBubble from '@/utils/page-bubble'
import {notification} from 'ant-design-vue';

const message = useMessage()
const appStore = useAppStore()
const {layoutSetting} = storeToRefs(appStore)
const router = useRouter()
const token = useAuthorization()
const loginModel = reactive({
  nickName: 'admin',
  userPassword: '123456',
  mobile: undefined,
  code: undefined,
  type: 'account',
  remember: true,
})
const {t} = useI18nLocale()
const formRef = shallowRef()
const codeLoading = shallowRef(false)
const resetCounter = 60
const submitLoading = shallowRef(false)
const errorAlert = shallowRef(false)
const bubbleCanvas = ref()
const {counter, pause, reset, resume, isActive} = useInterval(1000, {
  controls: true,
  immediate: false,
  callback(count) {
    if (count) {
      if (count === resetCounter)
        pause()
    }
  },
})

async function getCode() {
  codeLoading.value = true
  try {
    await formRef.value.validate(['mobile'])
    setTimeout(() => {
      reset()
      resume()
      codeLoading.value = false
      message.success('验证码是：123456')
    }, 3000)
  } catch (error) {
    codeLoading.value = false
  }
}

async function submit() {
  submitLoading.value = true
  try {
    await formRef.value?.validate()
    let params = undefined;

    if (loginModel.type === 'account') {
      params = {
        nickName: loginModel.nickName,
        userPassword: loginModel.userPassword,
        type: loginModel.type,
      }
    } else {
      params = {
        mobile: loginModel.mobile,
        code: loginModel.code,
        type: 'mobile',
      }
    }
    const {success, data} = await loginApi(params)
    if (success) {
      token.value = data.accessToken
      notification.success({
        message: '登录成功',
        description: '欢迎回来！',
        duration: 3,
      })
      // 获取当前是否存在重定向的链接，如果存在就走重定向的地址
      const redirect = getQueryParam('redirect', '/')
      await router.push({
        path: redirect,
        replace: true,
      })
    } else {
      errorAlert.value = true
      submitLoading.value = false
    }

    // loginApi(params).then(async response => {
    //   if (response.success) {
    //     token.value = response.data.accessToken
    //     notification.success({
    //       message: '登录成功',
    //       description: '欢迎回来！',
    //       duration: 3,
    //     })
    //     // 获取当前是否存在重定向的链接，如果存在就走重定向的地址
    //     const redirect = getQueryParam('redirect', '/')
    //     await router.push({
    //       path: redirect,
    //       replace: true,
    //     })
    //   }else{
    //     submitLoading.value = false
    //   }
    // })
  } catch (e) {
    if (e instanceof AxiosError)
      errorAlert.value = true

    submitLoading.value = false
  }
}

onMounted(async () => {
  await delayTimer(300)
  pageBubble.init(unref(bubbleCanvas))
})

onBeforeUnmount(() => {
  pageBubble.removeListeners()
})
</script>

<template>
  <div class="login-container">
    <div h-screen w-screen absolute z-10>
      <canvas ref="bubbleCanvas"/>
    </div>
    <div class="login-content flex-center">
      <div class="ant-pro-form-login-main rounded">
        <!-- 登录头部 -->
        <div
            class="flex-between h-15 px-4 mb-[2px]"
        >
          <div class="flex-end">
            <span class="ant-pro-form-login-logo">
              <img w-full h-full object-cover src="/logo.svg">
            </span>
            <span class="ant-pro-form-login-title">
              Taisite
            </span>
            <span class="ant-pro-form-login-desc">
              Taisite 是一个基于Vue 3.0的测试平台
            </span>
          </div>
          <div class="login-lang flex-center relative z-11">
            <span
                class="flex-center cursor-pointer text-16px"
                @click="appStore.toggleTheme(layoutSetting.theme === 'dark' ? 'light' : 'dark')"
            >
              <!-- 亮色和暗黑模式切换按钮 -->
              <template v-if="layoutSetting.theme === 'light'">
                <carbon-moon/>
              </template>
              <template v-else>
                <carbon-sun/>
              </template>
            </span>
            <!-- <SelectLang /> -->
          </div>
        </div>
        <a-divider m-0/>
        <!-- 登录主体 -->
        <div class="box-border flex min-h-[520px]">
          <!-- 登录框左侧 -->
          <div class="ant-pro-form-login-main-left min-h-[520px] flex-center  bg-[var(--bg-color-container)]">
            <img src="@/assets/images/login-left.png" class="h-5/6 w-5/6">
          </div>
          <a-divider m-0 type="vertical" class="ant-pro-login-divider  min-h-[520px]"/>
          <!-- 登录框右侧 -->
          <div class="ant-pro-form-login-main-right px-5 w-[335px] flex-center flex-col relative z-11">
            <div class="text-center py-6 text-2xl">
              欢迎使用 Taisite 测试平台
            </div>
            <a-form ref="formRef" :model="loginModel">
              <a-tabs v-model:activeKey="loginModel.type" centered>
                <a-tab-pane key="account" tab="账号密码登录"/>
                <a-tab-pane key="mobile" tab="手机号登录"/>
              </a-tabs>
              <!-- 判断是否存在error -->
              <a-alert
                  v-if="errorAlert && loginModel.type === 'account'" mb-24px
                  message="错误的用户名和密码" type="error" show-icon
              />
              <a-alert
                  v-if="errorAlert && loginModel.type === 'mobile'" mb-24px
                  :message="t('pages.login.phoneLogin.errorMessage')" type="error" show-icon
              />
              <template v-if="loginModel.type === 'account'">
                <div style="width: 295px">
                  <a-form-item name="nickName" :rules="[{ required: true, message: '用户名是必填项！' }]">
                    <a-input
                        v-model:value="loginModel.nickName" allow-clear
                        autocomplete="off"
                        placeholder="用户名: admin" size="large" @press-enter="submit"
                    >
                      <template #prefix>
                        <UserOutlined/>
                      </template>
                    </a-input>
                  </a-form-item>
                  <a-form-item name="userPassword" :rules="[{ required: true, message: '密码是必填项！' }]">
                    <a-input-password
                        v-model:value="loginModel.userPassword" allow-clear
                        placeholder="密码: 123456" size="large" @press-enter="submit"
                    >
                      <template #prefix>
                        <LockOutlined/>
                      </template>
                    </a-input-password>
                  </a-form-item>
                </div>
              </template>
              <template v-if="loginModel.type === 'mobile'">
                <a-form-item
                    name="mobile" :rules="[
                    { required: true, message: '手机号是必填项！' },
                    {
                      pattern: /^(86)?1([38][0-9]|4[579]|5[0-35-9]|6[6]|7[0135678]|9[89])[0-9]{8}$/,
                      message: '不合法的手机号！',
                    },
                  ]"
                >
                  <a-input
                      v-model:value="loginModel.mobile" allow-clear
                      placeholder="请输入手机号！" size="large" @press-enter="submit"
                  >
                    <template #prefix>
                      <MobileOutlined/>
                    </template>
                  </a-input>
                </a-form-item>
                <a-form-item name="code" :rules="[{ required: true, message: '验证码是必填项！' }]">
                  <div flex items-center>
                    <a-input
                        v-model:value="loginModel.code"
                        style="flex: 1 1 0%; transition: width 0.3s ease 0s; margin-right: 8px;" allow-clear
                        placeholder="请输入验证码！" size="large" @press-enter="submit"
                    >
                      <template #prefix>
                        <LockOutlined/>
                      </template>
                    </a-input>
                    <a-button :loading="codeLoading" :disabled="isActive" size="middle" @click="getCode">
                      <template v-if="!isActive">
                        获取验证码
                      </template>
                      <template v-else>
                        {{ resetCounter - counter }} 秒后重新获取
                      </template>
                    </a-button>
                  </div>
                </a-form-item>
              </template>
              <div class="mb-24px flex-between">
                <a-checkbox v-model:checked="loginModel.remember">
                  自动登录
                </a-checkbox>
                <a>忘记密码</a>
              </div>
              <a-button type="primary" block :loading="submitLoading" size="large" @click="submit">
                登录
              </a-button>
            </a-form>
            <!--            <a-divider>-->
            <!--              <span class="text-slate-500">其他登录方式 :</span>-->
            <!--            </a-divider>-->
            <!--            <div class="ant-pro-form-login-other">-->
            <!--              <AlipayCircleFilled class="icon" />-->
            <!--              <TaobaoCircleFilled class="icon" />-->
            <!--              <WeiboCircleFilled class="icon" />-->
            <!--            </div>-->
          </div>
        </div>
      </div>
    </div>
    <div py-24px px-50px fixed bottom-0 z-11 w-screen :data-theme="layoutSetting.theme" text-14px>
      <GlobalLayoutFooter
          :copyright="layoutSetting.copyright" icp="苏ICP备2023035009号-1"
      >
        <!--        <template #renderFooterLinks>-->
        <!--          <footer-links />-->
        <!--        </template>-->
      </GlobalLayoutFooter>
    </div>
  </div>
</template>

<style lang="less" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: auto;
  background: var(--bg-color-container);
}

.login-lang {
  height: 40px;
  line-height: 44px;
}

.login-content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.ant-pro-form-login-container {
  display: flex;
  flex: 1 1;
  flex-direction: column;
  height: 100%;
  padding: 32px 0;
  overflow: auto;
  background: inherit
}

.ant-pro-form-login-header a {
  text-decoration: none
}

.ant-pro-form-login-title {
  color: var(--text-color);
  font-weight: 600;
  font-size: 33px;
  line-height: 1;
}

.ant-pro-form-login-logo {
  width: 44px;
  height: 44px;
  margin-right: 16px;
  vertical-align: top
}

.ant-pro-form-login-desc {
  color: var(--text-color-1);
  font-size: 14px;
  margin-left: 16px
}

.ant-pro-form-login-main-right {
  .ant-tabs-nav-list {
    margin: 0 auto;
    font-size: 16px;
  }

  .ant-pro-form-login-other {
    line-height: 22px;
    text-align: center
  }

}

.ant-pro-form-login-main {
  box-shadow: var(--c-shadow);
}

.icon {
  margin-left: 8px;
  color: var(--text-color-2);
  font-size: 24px;
  vertical-align: middle;
  cursor: pointer;
  transition: color .3s;

  &:hover {
    color: var(--pro-ant-color-primary);
  }
}

.login-media(@width:100%) {
  .ant-pro-form-login-main {
    width: @width;
  }
  .ant-pro-form-login-main-left {
    display: none;
  }
  .ant-pro-form-login-main-right {
    width: 100%;
  }
  .ant-pro-form-login-desc {
    display: none;
  }
}

@media (min-width: 992px) {
  .ant-pro-form-login-main-left {
    width: 700px;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  .ant-pro-login-divider {
    display: none;
  }

  .login-media(400px)
}

@media screen and (max-width: 767px) {
  .login-media(350px);

  .ant-pro-login-divider {
    display: none;
  }
}
</style>
