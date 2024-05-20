<!-- 个人中心 -->
<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="12">
				<el-card shadow="hover">
					<template #header>
						<div class="clearfix">
							<span>基础信息</span>
						</div>
					</template>
					<div class="info">
						<div class="info-image" @click="showDialog">
							<el-avatar :size="100" :src="avatarImg" />
							<span class="info-edit">
								<i class="el-icon-lx-camerafill"></i>
							</span>
						</div>
						<div class="info-name">{{ name }}</div>
					</div>
				</el-card>
			</el-col>
			<el-col :span="12">
				<el-card shadow="hover">
					<template #header>
						<div class="clearfix">
							<span>账户编辑</span>
						</div>
					</template>
					<el-form label-width="90px">
						<el-form-item label="用户名："> {{ name }} </el-form-item>
						<el-form-item label="旧密码：">
							<el-input type="password" v-model="form.old"></el-input>
						</el-form-item>
						<el-form-item label="新密码：">
							<el-input type="password" v-model="form.new"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" @click="onSubmit">保存</el-button>
						</el-form-item>
					</el-form>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="user">
import { reactive, ref } from 'vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import avatar from '../assets/img/img.jpg';
import { ElMessage, FormInstance, FormRules, UploadProps } from 'element-plus';

const name = localStorage.getItem('ms_username');
const form = reactive({
	old: '',
	new: '',
});
const onSubmit = async () => {
  try {
    // 模拟提交表单的 API 请求，实际应根据具体情况调用后端 API
    const response = await api.updatePassword(name, form.old, form.new);
    
    // 处理请求结果
    if (response.success) {
      ElMessage.success('保存成功！');
    } else {
      ElMessage.error('保存失败，请重试！');
    }
  } catch (error) {
    console.error('保存失败：', error);
    ElMessage.error('保存失败，请重试！');
  }
};


const api = {
  async updatePassword(username: string, oldPassword: string, newPassword: string) {
    try {
      const response = await fetch('https://localhost:8083/api/school-system/reset/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          oldPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update password:', error);
      throw error;
    }
  }
};

// const onSubmit = (formEl:FormInstance|undefined) => {
// 	if (!formEl) return;
// 	formEl.validate(valid => {
// 		if (!valid) return false;
// 		props.update(form.value);
// 		ElMessage.success('保存成功！');
// };


const avatarImg = ref(avatar);
const imgSrc = ref('');
const cropImg = ref('');
const dialogVisible = ref(false);
const cropper: any = ref();

const showDialog = () => {
	dialogVisible.value = true;
	imgSrc.value = avatarImg.value;
};

const setImage = (e: any) => {
	const file = e.target.files[0];
	if (!file.type.includes('image/')) {
		return;
	}
	const reader = new FileReader();
	reader.onload = (event: any) => {
		dialogVisible.value = true;
		imgSrc.value = event.target.result;
		cropper.value && cropper.value.replace(event.target.result);
	};
	reader.readAsDataURL(file);
};

const cropImage = () => {
	cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
};

const saveAvatar = () => {
	avatarImg.value = cropImg.value;
	dialogVisible.value = false;
};
</script>

<style scoped>
.info {
	text-align: center;
	padding: 35px 0;
}
.info-image {
	position: relative;
	margin: auto;
	width: 100px;
	height: 100px;
	background: #f8f8f8;
	border: 1px solid #eee;
	border-radius: 50px;
	overflow: hidden;
}

.info-edit {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	opacity: 0;
	transition: opacity 0.3s ease;
}
.info-edit i {
	color: #eee;
	font-size: 25px;
}
.info-image:hover .info-edit {
	opacity: 1;
}
.info-name {
	margin: 15px 0 10px;
	font-size: 24px;
	font-weight: 500;
	color: #262626;
}
.crop-demo-btn {
	position: relative;
}
.crop-input {
	position: absolute;
	width: 100px;
	height: 40px;
	left: 0;
	top: 0;
	opacity: 0;
	cursor: pointer;
}
</style>
