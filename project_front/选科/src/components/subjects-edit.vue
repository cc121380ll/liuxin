<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="选科组合" prop="name">
      <el-checkbox-group v-model="form.name">
        <el-checkbox label="物理 化学 政治"></el-checkbox>
        <el-checkbox label="物理 化学 生物"></el-checkbox>
        <el-checkbox label="物理 化学 地理"></el-checkbox>
        <el-checkbox label="物理 政治 生物"></el-checkbox>
        <el-checkbox label="物理 政治 地理"></el-checkbox>
        <el-checkbox label="物理 生物 地理"></el-checkbox>
        <el-checkbox label="历史 生物 政治"></el-checkbox>
        <el-checkbox label="历史 化学 政治"></el-checkbox>
        <el-checkbox label="历史 地理 政治"></el-checkbox>
        <el-checkbox label="历史 化学 生物"></el-checkbox>
        <el-checkbox label="历史 生物 地理"></el-checkbox>
        <el-checkbox label="历史 化学 地理"></el-checkbox>
      </el-checkbox-group>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveEdit(formRef)">保 存</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import { ref, reactive } from 'vue';

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
  name: []
};

const form = ref({ ...(props.edit ? props.data : defaultData) });

const rules: FormRules = {
  name: [{ required: true, message: '请选择选科组合', trigger: 'change' }]
};

const formRef = ref<FormInstance>();

const saveEdit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (!valid) return false;
    props.update(form.value);
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
