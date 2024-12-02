<template>
	<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
		<el-form-item label="姓名" prop="name" class="form-items">
			<el-input v-model="form.name"></el-input>
		</el-form-item>
		<el-form-item label="性别" prop="gender" class="form-items">
      <el-select v-model="form.gender">
        <el-option value="男"/>
        <el-option value="女"/>
      </el-select>
		</el-form-item>
		<el-form-item label="学号" prop="studentNumber" class="form-items">
			<el-input v-model="form.studentNumber"></el-input>
		</el-form-item>
		<el-form-item label="年级" prop="grade" class="form-items">
      <el-select v-model="form.grade">
        <el-option value="一年级"/>
        <el-option value="二年级"/>
        <el-option value="三年级"/>
      </el-select>
		</el-form-item>
		<el-form-item label="行政班级" prop="_class" class="form-items">
     <el-input v-model="form._class"></el-input>
		</el-form-item>
		<el-form-item label="账户状态" prop="status" class="form-items">
			<el-switch
				v-model="form.status"
				:active-value="1"
				:inactive-value="0"
				active-text="启用"
				inactive-text="停用"
			></el-switch>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" style="width: 280px" @click="saveEdit(formRef)">保 存</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" setup>
import { ElMessage, FormInstance, FormRules } from 'element-plus';
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
  status: 0,
  updatedTime: new Date()
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
  ]
};
const formRef = ref<FormInstance>();

const saveEdit = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    
    return new Promise((resolve, reject) => {
        formEl.validate(valid => {
            if (!valid) {
                reject('表单验证失败');
                return;
            }
            
            // 调用更新接口
            props.update(form.value);
            ElMessage.success('保存成功！');
            // 调用添加学生接口
          /*  studentsAddApi(form.value).then((_response: any) => {
                resolve(_response); // 返回添加学生接口的响应
            }).catch((_error: any) => {
                console.error('保存失败', _error); // 打印错误信息
                reject(_error); // 返回错误信息
            });*/
        });
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
.form-items{
  width: 380px;
}
</style>
