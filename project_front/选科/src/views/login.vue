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

/*interface LoginInfo {
    username: string;
    password: string;
}

const lgStr = localStorage.getItem('login-param');
const defParam = lgStr ? JSON.parse(lgStr) : null;
const checked = ref(lgStr ? true : false);

const router = useRouter();
const param = reactive<LoginInfo>({
    username: defParam ? defParam.username : '',
    password: defParam ? defParam.password : '',
});

const rules: FormRules = {
    username: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        },
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const permiss = usePermissStore();

const login = ref<FormInstance>();*/

// const submitForm1 = (formEl: FormInstance | undefined, param: any, checked: Ref<boolean>) => {
//     if (!formEl) return;
    
//     formEl.validate((valid: boolean) => {
//         if (valid) {
//             const username = param.username; // 获取用户名
//             ElMessage.success('登录成功');
//             localStorage.setItem('ms_username', username); // 保存用户名到本地存储
//             const keys = permiss.defaultList[username === 'admin' ? 'admin' : 'user']; // 根据用户名获取权限列表
//             permiss.handleSet(keys); // 处理权限
//             localStorage.setItem('ms_keys', JSON.stringify(keys)); // 保存权限列表到本地存储

//             // 调用登录接口
//             loginApi(param).then((_response: any) => {
//                 router.push('/'); // 登录成功后跳转到首页
//             }).catch((_error: any) => {
//                 console.error('登录失败', _error); // 打印错误信息
//             });

//             // 根据记住密码选项保存登录参数到本地存储
//             if (checked.value) {
//                 localStorage.setItem('login-param', JSON.stringify(param));
//             } else {
//                 localStorage.removeItem('login-param');
//             }
//         } else {
//             ElMessage.error('登录失败');
//             console.error('表单验证未通过'); // 打印错误信息
//         }
//     });
// };
// const login = ref<FormInstance>();
/*const submitForm1 = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid: boolean) => {
        if (valid) {
            ElMessage.success('登录成功');
            localStorage.setItem('ms_username', param.username);
            const keys = permiss.defaultList[param.username == 'admin' ? 'admin' : 'user'];
            permiss.handleSet(keys);
            localStorage.setItem('ms_keys', JSON.stringify(keys));
			router.push('/');
            if (checked.value) {
                localStorage.setItem('login-param', JSON.stringify(param));
            } else {
                localStorage.removeItem('login-param');
            }
        } else {
            ElMessage.error('登录失败');
            return false;
        }
    });
};

const tags = useTagsStore();
tags.clearTags();*/

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

