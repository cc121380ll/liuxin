<template>
  <el-form ref="formRef" :model="form" :rules="resetPasswordRules" label-width="100px">
    <el-form-item label="重置密码" prop="password" class="form-items">
      <el-input v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 280px" @click="submitResetPassword(formRef)">重置密码</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ElMessage, FormInstance, FormRules } from 'element-plus';
import {reactive, ref} from 'vue';


const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  edit:{
    type:Boolean,
    required:true
  },
  update: {
    type: Function,
    required: true
  }
});
const defaultData = {
  password:''
}
const form = ref({ ...(props.edit ? props.data : defaultData) })
const resetPasswordRules: FormRules = {
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

const formRef = ref<FormInstance>();




const submitResetPassword = (formEl: FormInstance | undefined) => {
  if (!formEl) return;

  formEl.validate(valid => {
    if (!valid) {
      ElMessage.error('密码重置失败');
      return;
    }

// 这里应该有一个API调用来重置密码
    console.log('提交的原密码:', form.value.password);
    props.update(form.value);
// 实际的API调用逻辑应该在这里
    ElMessage.success('密码重置成功！');
  });
};
</script>

<style>
.form-items {
  width: 380px;
}
</style>