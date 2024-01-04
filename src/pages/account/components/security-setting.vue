<script setup>
import { queryUserMaskBindInfoApi } from '~/api/common/user'
import { QqOutlined, WechatOutlined, TaobaoOutlined,DingdingOutlined,AlipayCircleOutlined} from '@ant-design/icons-vue'


let listData = ref([])

async function queryUserBindInfo() {
  const { success, data } = await queryUserMaskBindInfoApi()
  if (success) {
    listData.value = data
  }
}


onBeforeMount(() => {
  queryUserBindInfo()
})

</script>

<template>
  <a-card :bordered="false">
    <a-list item-layout="horizontal" :data-source="listData">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #title>{{ item.title }}</template>
            <template #description>
              <span class="security-list-description">{{ item.description }}</span>
              <span class="security-list-value">{{ item.value }}</span>
            </template>
            <template #avatar>
              <QqOutlined v-if="item.type === 'qq'" class="bind-icon" style=" color: #1890FF " />
              <WechatOutlined v-if="item.type === 'weChat'" class="bind-icon" style=" color: #1AAD19" />
              <AlipayCircleOutlined v-if="item.type === 'AliPay'" class="bind-icon" style="color: #178bf5 " />
              <TaobaoOutlined v-if="item.type === 'taobao' " style="color: #ff4000;" class="bind-icon" />
              <DingdingOutlined v-if="item.type === 'dingding' " style="color: #fff;" class="bind-icon" />
            </template>
          </a-list-item-meta>
          <template #actions>
            <a>{{ item.value ? '修改' : '去绑定' }}</a>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<style scoped lang="less">
:deep(.ant-card-body) {
  padding-left: 0 !important;
}

.list-item-meta {
  align-items: center;
}

.bind-icon {
  padding-left: 10px;
  font-size: 30px;
}
</style>
