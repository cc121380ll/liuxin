<template>
  <div>
    <div v-if="data" class="teacher_view">
      <el-descriptions title="" :column="1" border>
        <el-descriptions-item>
          <template #label> 手机号 </template>
          {{ data.username }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> 初始密码 </template>
          {{ data.password }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <div v-else>
      <p>当前学生信息不可用</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
});
</script>
<style scoped>
.teacher_view{
  padding: 20px;
}
</style>