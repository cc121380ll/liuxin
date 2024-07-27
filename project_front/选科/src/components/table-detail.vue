<template>
	<el-descriptions title="" :column="2" border>
		<el-descriptions-item>
			<template #label> 姓名 </template>
			{{ data.name }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 初始密码 </template>
			{{ data.password }}
		</el-descriptions-item>
	</el-descriptions>
</template>

<script lang="ts" setup>
const props = defineProps({
	data: {
		type: Object,
		required: true
	}
});
</script>
