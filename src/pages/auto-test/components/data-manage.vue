<template>
  <div>
    <nameValue :nameValueInfo="caseInfoData.caseParameters" source="caseParametersEdit"/>
  </div>

</template>

<script setup>
import nameValue from "~/pages/auto-test/components/name-value.vue";

let caseInfoData = inject("caseInfoData")

</script>