<template>
	<el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
		<el-form-item label="选科组合" prop="subjects" v-model="form.subjects">
		        <el-checkbox-group v-model="form.subjects">
		            <el-checkbox label="物理 化学 生物" v-model="form.subjects" ></el-checkbox>
		            <el-checkbox label="物理 化学 历史" v-model="form.subjects" ></el-checkbox>
		            <el-checkbox label="物理 化学 政治" v-model="form.subjects" ></el-checkbox>
					<el-checkbox label="物理 化学 地理" v-model="form.subjects" ></el-checkbox>
					<el-checkbox label="化学 政治 生物" v-model="form.subjects" ></el-checkbox>
					<el-checkbox label="化学 政治 地理" v-model="form.subjects" ></el-checkbox>
					<el-checkbox label="化学 政治 历史" v-model="form.subjects" ></el-checkbox>
					<el-checkbox label="政治 历史 生物" v-model="form.subjects" ></el-checkbox>
					<el-checkbox label="政治 历史 地理" v-model="form.subjects" ></el-checkbox>
					<el-checkbox label="政治 历史 地理" v-model="form.subjects" ></el-checkbox>
					<el-checkbox label="地理 化学 生物" v-model="form.subjects" ></el-checkbox>
					<el-checkbox label="地理 化学 历史" v-model="form.subjects" ></el-checkbox>
					<el-checkbox label="地理 化学 政治" v-model="form.subjects" ></el-checkbox>
					<el-checkbox label="生物 化学 政治" v-model="form.subjects" ></el-checkbox>
					<el-checkbox label="生物 化学 地理" v-model="form.subjects" ></el-checkbox>
					<el-checkbox label="生物 化学 物理" v-model="form.subjects" ></el-checkbox>
		        </el-checkbox-group>
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
import { ref,reactive } from 'vue';

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
	subjects: [],
	created_time: new Date()
};

const query=reactive({
	subjects:['']
})

const form = ref({ ...(props.edit ? props.data : defaultData) });

const rules: FormRules = {
	subjects: [{ required: true, message: '请选择选科组合', trigger: 'blur' }],
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

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
	form.value.thumb = URL.createObjectURL(uploadFile.raw!);
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
