<template>
  <a-descriptions bordered>
    <a-descriptions-item label="姓名" style="height: 100px">赵志远</a-descriptions-item>
    <a-descriptions-item label="性别">男</a-descriptions-item>
    <a-descriptions-item label="照片"><a-avatar src="https://taisite-1251159423.cos.ap-shanghai.myqcloud.com/logo/id_photo.jpg" :size="120" shape="square"/></a-descriptions-item>
    <a-descriptions-item label="年龄" style="height: 100px">28</a-descriptions-item>
    <a-descriptions-item label="联系方式">15821828866</a-descriptions-item>
    <a-descriptions-item label="邮箱" >16578115@qq.com</a-descriptions-item>
    <a-descriptions-item label="工作经验" style="height: 100px">5年</a-descriptions-item>
    <a-descriptions-item label="期望岗位">测试开发工程师</a-descriptions-item>
    <a-descriptions-item label="工作地点">上海</a-descriptions-item>
    <a-descriptions-item label="技能">
      <!--技能:WEB后端开发-->
      <div>
        <a-card >
          <span>【WEB后端开发】</span>
          <a-tag color="#108ee9">熟练掌握</a-tag>
          <a-timeline style="margin-top: 20px">
            <a-timeline-item>熟练使用Spring Boot、SpringMVC等主流框架，熟悉Restful 风格API设计</a-timeline-item>
            <a-timeline-item>熟练使用数据库操作框架Mybatis，掌握SQL语句增删改查</a-timeline-item>
            <a-timeline-item>熟练使用Websocket，并使用websocket进行服务端与客户端实时数据传输</a-timeline-item>
            <a-timeline-item>熟练使用Jwt等用户鉴权产品</a-timeline-item>
            <a-timeline-item>熟悉API开发基本流程，熟悉Restful 风格API设计</a-timeline-item>
            <a-timeline-item>熟练使用非关系型数据库Redis，有Redis实际项目开发使用经验</a-timeline-item>
            <a-timeline-item>熟练使用消息中间件Rocket MQ、kafka等开源中间件，有Rocket MQ实际项目开发使用经验</a-timeline-item>
            <a-timeline-item>掌握Spring cloud，正学习Spring cloud在企业大型应用中的应用，以及大型应用的微服务化及服务治理知识学习，有开源Spring cloud项目</a-timeline-item>
          </a-timeline>
        </a-card>
        <a-card >
          <span>【WEB前端开发】</span>
          <a-tag color="#108ee9">掌握</a-tag>
          <a-timeline style="margin-top: 20px">
            <a-timeline-item>熟悉前端技术HTML、JS、CSS，有实际项目中的前端开发、维护经验</a-timeline-item>
            <a-timeline-item>熟练掌握前端流行框架Vue2、VUE3</a-timeline-item>
            <a-timeline-item>熟练使用Websocket，并使用其进行服务端与客户端实时数据传输</a-timeline-item>
            <a-timeline-item>了解TypeScript等技术</a-timeline-item>
          </a-timeline>
        </a-card>
        <a-card >
          <span>【测试技能】</span>
          <a-tag color="#108ee9">熟练掌握</a-tag>
          <a-timeline style="margin-top: 20px">
            <a-timeline-item>掌握linux操作系统知识，掌握SQL语句增删改查</a-timeline-item>
            <a-timeline-item>熟练掌握常用的测试工具，如：Postman、Jmeter、Charles等</a-timeline-item>
            <a-timeline-item>具有自动化测试研发能力</a-timeline-item>
          </a-timeline>
        </a-card>
      </div>
    </a-descriptions-item>
  </a-descriptions>
</template>
<script setup lang="ts">
</script>