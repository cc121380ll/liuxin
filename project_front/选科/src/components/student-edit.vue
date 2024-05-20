<template>
	<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
		<el-form-item label="姓名" prop="name">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="性别" prop="sex">
			<el-input v-model.number="form.sex"></el-input>
		</el-form-item>
		<el-form-item label="学号" prop="sno">
			<el-input v-model="form.sno"></el-input>
		</el-form-item>
		<el-form-item label="年纪" prop="grade">
			<el-input v-model="form.grade"></el-input>
		</el-form-item>
		<el-form-item label="行政班级" prop="class">
			<el-input v-model="form.class"></el-input>
		</el-form-item>
		<el-form-item label="班主任" prop="teacher">
			<el-input v-model="form.teacher"></el-input>
		</el-form-item>
		<el-form-item label="创建时间" prop="created_time">
			<el-date-picker type="date" v-model="form.created_time" value-format="YYYY-MM-DD"></el-date-picker>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="saveEdit(formRef)">保 存</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" setup>
import { ElMessage, FormInstance, FormRules, UploadProps } from 'element-plus';
import { ref } from 'vue';

const props = defineProps({
	data: {
		type: Object,
		required: true
	},
	edit: {
		type: Boolean,
		required: false
	},
	update: {
		type: Function,
		required: true
	}
});

const defaultData = {
	id: '',
	name: '',
	sno: '',
	grade: '',
	class: '',
	teacher:'',
	created_time: new Date()
};

const form = ref({ ...(props.edit ? props.data : defaultData) });

const rules: FormRules = {
	name: [{ required: true, message: '姓名', trigger: 'blur' }],
	sno: [{ required: true, message: '学号', trigger: 'blur' }],
	sex: [{ required:false, message: '性别', trigger: 'blur' }],
};
const formRef = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(valid => {
		if (!valid) return false;
		props.update(form.value);
		ElMessage.success('保存成功！');
	});
};

</script>

<style>
.avatar-uploader .el-upload {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
	border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
</style>
