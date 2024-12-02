<template>
  <div>
    <div v-if="data" class="stu_view">
      <el-descriptions title="" :column="1" border>
        <el-descriptions-item>
          <template #label> 姓名 </template>
          {{ data.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> 初始密码 </template>
          {{ data.password }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label> 选课信息 </template>
          {{ data.subject == null ? '学生未选择选课' : data.subject }}
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
.stu_view{
  padding: 20px;
}
</style>