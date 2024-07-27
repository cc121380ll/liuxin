<template>
  <div class="teacher-details">
    <div v-if="data">
      <p class="info-item"><strong>账号：</strong>{{data.username}}</p>
      <p class="info-item"><strong>密码：</strong>{{data.password}}</p>
    </div>
    <div v-else>
      <p>老师的信息当前不可用。</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style scoped>
.info-item {
  margin-bottom: 20px; /* 增加底部外边距 */
}
</style>
