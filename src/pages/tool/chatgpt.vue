<template>
  <div style="margin-bottom: 90px;">
    <a-list item-layout="horizontal" :data-source="messageList" :locale="locale">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #description>
              <MdPreview :modelValue="item.content"/>
              <!--                <MdPreview :modelValue="message.content"/>-->
            </template>
            <template #title>
              <a v-if="item.role==='assistant'">ChatGPT</a>
              <a v-else>You</a>
            </template>
            <template #avatar>
              <a-avatar v-if="item.role==='assistant'"
                        src="https://taisite-1251159423.cos.ap-shanghai.myqcloud.com/logo/chatGPT.jpg"/>
              <a-avatar v-else :src="userStore.userInfo.userAvatar"/>
            </template>
          </a-list-item-meta>
        </a-list-item>

      </template>
      <a-list-item v-if="message.content!==''">
        <a-list-item-meta>
          <template #description>
            <MdPreview :modelValue="message.content"/>
            <!--                <MdPreview :modelValue="message.content"/>-->
          </template>
          <template #title>
            <a v-if="message.role==='assistant'">ChatGPT</a>
            <a v-else>You</a>
          </template>
          <template #avatar>
            <a-avatar v-if="message.role==='assistant'"
                      src="https://taisite-1251159423.cos.ap-shanghai.myqcloud.com/logo/chatGPT.jpg"/>
            <a-avatar v-else :src="userStore.userInfo.userAvatar"/>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
    <a-result
        v-if="messageList.length===0"
        status="success"
        title="SSE已连接，请在下方发起提问吧"
    />
    <div :class="bottomClass" style=" position: fixed;bottom: 100px;right:0">
      <a-row align="middle" justify="space-around">
        <a-col :span="17" :offset="2">
          <a-textarea
              v-model:value="requestMessage.msg"
              placeholder="请输入你想问的问题"
              :auto-size="{ minRows: 1, maxRows: 5 }"
          />
        </a-col>
        <a-col :span="4">
          <a-button type="primary" @click="action">提问</a-button>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import {EventSourcePolyfill} from 'event-source-polyfill';
import {useAuthorization} from "~/composables/authorization.js";
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import {chatGptRequestApi} from "~/api/tool/chatgpt.js";
import {useUserStore} from "~/stores/user.js";
import {useAppStore} from "~/stores/app.ts";
import {useLayoutState} from "~/layouts/basic-layout/context";

const locale = ref({
  emptyText:" "
})

let requestMessage = ref({
  msg: ''
})

let messageList = ref([])

let message = ref({
  content: '',
  role: '',
  id: '',
  timestamp: ''
})

let bottomClass = ref('')
let source = ref()
const token = useAuthorization()
const userStore = useUserStore()
const appStore = useAppStore()
const {isMobile } = useLayoutState()


appStore.$subscribe((mutate, state) => {
  if (state.layoutSetting.collapsed||isMobile.value) {
    bottomClass.value = 'inputChatNoExpand'
  } else {
    bottomClass.value = 'inputChatExpand'
  }
})

watch(isMobile, (newValue, oldValue) => {
  if (newValue) {
    bottomClass.value = 'inputChatNoExpand'
  } else {
    bottomClass.value = 'inputChatExpand'
  }
}, {deep: true, immediate: true})

async function action() {
  if(requestMessage.value.msg!=='') {
    if(requestMessage.value.msg.trim()!=='') {
      let message1 = {
        content: '',
        role: '',
        id: '',
        timestamp: ''
      }
      message1.content = requestMessage.value.msg
      message1.role = 'user'
      message1.id = Date.now()
      message1.timestamp = Date.now()
      await chatGptRequestApi(requestMessage.value)
      requestMessage.value.msg = ''
      messageList.value.push(message1)
    }
  }
}

const SSE = () => {
  if (window.EventSource) {
    source.value = new EventSourcePolyfill(import.meta.env.VITE_APP_BASE_URL+'/api/user/createSse', {
      headers: {
        'Access-Token': token.value
      },
      heartbeatTimeout: 120000
    })
    /**
     * 连接一旦建立，就会触发open事件
     */
    source.value.onopen = function (e) {
      console.log('建立连接',e)
    }
    /**
     * 客户端收到服务器发来的数据
     */
    source.value.onmessage = function (event) {
      console.log(event)
      if (event.lastEventId === "[TOKENS]") {
        //结束前会返回tokens
        message.value.content = message.value.content + event.data
        return;
      }
      if (event.lastEventId === 'DONE') {
        message.value.id = event.lastEventId
        message.value.timestamp = Date.now()
        messageList.value.push(message.value)
        message.value = {
          content: '',
          role: '',
          id: '',
          timestamp: ''
        }
      }
      if (event.data.startsWith('{')) {
        let data = JSON.parse(event.data)
        if (data.role !== undefined) {
          message.value.role = data.role
        }
        if (data.content !== undefined) {
          message.value.content += data.content
        }
      }
    }
    /**
     * 如果发生通信错误（比如连接中断），就会触发error事件
     */
    source.value.onerror = function (e) {
      if (e.readyState === EventSource.CLOSED) {
        console.log(e)
      } else {
        console.log(e)
      }
    }
  } else {
    console.log('浏览器不支持SSE')
  }
}


onBeforeMount(() => {
  if (appStore.layoutSetting.collapsed||isMobile.value) {
    bottomClass.value = 'inputChatNoExpand'
  } else{
    bottomClass.value = 'inputChatExpand'
  }
  SSE()
})

onUnmounted(() => {
  source.value.close() // 卸载
})
</script>

<style>
.inputChatNoExpand {
  left: 0;
}

.inputChatExpand {
  left: 200px;
}
</style>