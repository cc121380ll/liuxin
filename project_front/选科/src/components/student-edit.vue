<template>
	<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
		<el-form-item label="姓名" prop="name">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="性别" prop="gender">
      <el-select v-model="form.gender">
        <el-option value="男"/>
        <el-option value="女"/>
      </el-select>
		</el-form-item>
		<el-form-item label="学号" prop="studentNumber">
			<el-input v-model="form.studentNumber"></el-input>
		</el-form-item>
		<el-form-item label="年级" prop="grade">
      <el-select v-model="form.grade">
        <el-option value="一年级"/>
        <el-option value="二年级"/>
        <el-option value="三年级"/>
      </el-select>
		</el-form-item>
		<el-form-item label="行政班级" prop="_class">
			<el-input v-model="form._class" placeholder="请按照“一班”类似格式输入"></el-input>
		</el-form-item>
		<el-form-item label="班主任" prop="classTeacher">
			<el-input v-model="form.classTeacher"></el-input>
		</el-form-item>
    <el-form-item label="班主任电话" prop="classTeacherPhone">
			<el-input v-model="form.classTeacherPhone"></el-input>
		</el-form-item>
<!--		<el-form-item label="创建时间" prop="created_time">
			<el-date-picker type="date" v-model="form.created_time" value-format="YYYY-MM-DD"></el-date-picker>
		</el-form-item>-->
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
  gender: '',
  studentNumber: '',
	grade: '',
  _class: '',
  classTeacher:'',
  classTeacherPhone:'',
};

const form = ref({ ...(props.edit ? props.data : defaultData) });

const rules: FormRules = {
	name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    {
      pattern: /^(?:[\u4e00-\u9fa5·]{2,16})$/,
      message:'请输入正确的姓名',
      trigger:'blur'
    }
  ],
	studentNumber: [{ required: true, message: '请输入学号', trigger: 'blur' }],
	gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
  grade: [{required: true, message: '请选择年级', trigger: 'blur' }],
  _class: [
    {required: true, message: '请输入班级', trigger: 'blur' },
    {
      pattern: /^.*?班$/,
      message:'请输入正确的班级',
      trigger:'blur'
    }
  ],
  classTeacher: [
    { required: true, message: '请输入班主任名', trigger: 'blur' },
    {
      pattern: /^(?:[\u4e00-\u9fa5·]{2,16})$/,
      message:'请输入正确的姓名',
      trigger:'blur'
    }
  ],
  classTeacherPhone: [
    {
      required: true,
      message: '请输入班主任手机号',
      trigger: 'blur',
    },
    {
      pattern:/^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
      message:'请输入正确的手机号',
      trigger:'blur'
    }
  ]
};
const formRef = ref<FormInstance>();
const saveEdit = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.validate(valid => {
		if (!valid) return false;
		props.update(form.value);
		//ElMessage.success('保存成功！');
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
