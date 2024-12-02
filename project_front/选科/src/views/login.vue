<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">新高考选科平台</div>
            <el-form :model="form" :rules="rules" ref="formRef" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="用户名">
                        <template #prepend>
                            <el-button :icon="User"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="form.password"
                        @keyup.enter="userLogin()"
                    >
                        <template #prepend>
                            <el-button :icon="Lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
				<div class="tips">
					<el-link @click="$router.push('/register')" target="_blank" :underline="false">注册账户</el-link>
<!--					<el-link @click="" target="_blank" :underline="false" style="float: right;">忘记密码</el-link>-->
				</div>
                <div class="login-btn">
                    <el-button type="primary" @click="userLogin()">登录</el-button>
                </div>
                <el-checkbox class="login-tips" v-model="form.remember" label="记住密码" size="large" />
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, Ref } from 'vue';
import { useTagsStore } from '../store/tags';
import { usePermissStore } from '../store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { Lock, User } from '@element-plus/icons-vue';
import {login} from "../net/index.js";
import router from "../router/index.js";

const formRef = ref()
const form = reactive({
  username: '',
  password: '',
  remember: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名' }
  ],
  password: [
    { required: true, message: '请输入密码'}
  ]
}

function userLogin() {
  formRef.value.validate((isValid) => {
    if (isValid) {
      login(form.username, form.password, form.remember, () => router.push("/"))

    }
  });
}

</script>

<style scoped>
.login-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #333;
    font-weight: bold;
    padding-top: 10px;
}
.ms-login {
    width: 350px;
    border-radius: 5px;
    background: #fff;
}
.ms-content {
    padding: 10px 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #333;
}
.tips{
	font-size:20px;
	color: blue;
	margin-bottom: 10px;

}
</style>

