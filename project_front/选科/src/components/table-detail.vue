<template>
	<el-descriptions title="" :column="2" border>
		<el-descriptions-item>
			<template #label> 姓名 </template>
			{{ data.name }}
		</el-descriptions-item>
		<el-descriptions-item>
			<template #label> 学号 </template>
			{{ data.sno }}
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
