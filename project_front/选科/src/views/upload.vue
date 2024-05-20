<!-- <template>
    <div class="container">
        <div class="content-title">支持拖拽</div>
        <div class="plugins-tips">
            Element Plus自带上传组件。 访问地址：
            <a href="https://element-plus.org/zh-CN/component/upload.html" target="_blank">Element Plus Upload</a>
        </div>
        <el-upload
            class="upload-demo"
            drag
            action="http://jsonplaceholder.typicode.com/api/posts/"
            multiple
            :on-change="handle"
        >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
            </div>
        </el-upload>

        <div class="content-title">支持裁剪</div>
        <div class="plugins-tips">
            vue-cropperjs：一个封装了 cropperjs 的 Vue 组件。 访问地址：
            <a href="https://github.com/Agontuk/vue-cropperjs" target="_blank">vue-cropperjs</a>。 示例请查看
            <router-link to="/user">个人中心</router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
const handle = (rawFile: any) => {
    console.log(rawFile);
};
</script>

<style scoped>
.content-title {
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
.upload-demo {
    width: 360px;
}
</style> -->

<template>
    <div class="zhuce-wrap">
        <div class="ms-zhuce">
            <div class="ms-title">新高考选科平台</div>
            <el-form :model="param" :rules="rules" ref="zhuce" label-width="0px" class="ms-content">
                <el-form-item prop="phone">
                    <el-input v-model="param.phone" placeholder="请输入手机号">
                        <template #prepend>
                            <el-button >手机号</el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="请输入6-16位密码,区分大小写"
                        v-model="param.password"
                        @keyup.enter="submitForm(zhuce)"
                    >
                        <template #prepend>
                            <el-button>密码</el-button>
                        </template>
                    </el-input>
                </el-form-item>
				<el-form-item prop="confirm">
					<el-input
					type="password"
					placeholder="确认密码"
					v-model="param.confirm"
					></el-input>
				</el-form-item>
				<el-form-item prop="code">
					<el-input
					    placeholder="请输入验证码"
					    v-model="param.code"
					>
					<template #append>
						<el-button>获取验证码</el-button>
					</template >
					</el-input>
				</el-form-item>
                <div class="zhuce-btn">
                    <el-button type="primary" @click="submitForm(zhuce)">注册</el-button>
                </div>
                <a href="" style="float: right; font-size: 12px;">使用已有账户登录</a>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useTagsStore } from '../store/tags';
import { usePermissStore } from '../store/permiss';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';


interface LoginInfo {
    phone: string;
    password: string;
	code:string;
	confirm:string;
}

const lgStr = localStorage.getItem('zhuce-param');
const defParam = lgStr ? JSON.parse(lgStr) : null;
const checked = ref(lgStr ? true : false);

const router = useRouter();
const param = reactive<LoginInfo>({
    phone: defParam ? defParam.phone : '',
    password: defParam ? defParam.password : '',
	code:defParam?defParam.code:'',
	confirm:defParam?defParam.confirm:'',
});

const rules: FormRules = {
    phone: [
        {
            required: true,
            message: '请输入手机号',
            trigger: 'blur',
        },
    ],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
	confirm:[{required:true,message:'请确认密码',trigger:'blur'}],
	code:[{required:true,message:'请输入验证码',trigger:'blur'}],
};
const permiss = usePermissStore();
const zhuce = ref<FormInstance>();
const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid: boolean) => {
        if (valid) {
            ElMessage.success('注册成功');
            localStorage.setItem('ms_username', param.phone);
            const keys = permiss.defaultList[param.phone == 'admin' ? 'admin' : 'user'];
            permiss.handleSet(keys);
            localStorage.setItem('ms_keys', JSON.stringify(keys));
            router.push('/');
            if (checked.value) {
                localStorage.setItem('zhuce-param', JSON.stringify(param));
            } else {
                localStorage.removeItem('zhuce-param');
            }
        } else {
            ElMessage.error('注册失败');
            return false;
        }
    });
};

const tags = useTagsStore();
tags.clearTags();


</script>

<style scoped>
.zhuce-wrap {
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
.ms-zhuce {
    width: 350px;
    border-radius: 5px;
    background: #fff;
}
.ms-content {
    padding: 10px 30px 30px;
}
.zhuce-btn {
    float:left;
	height: 50px;
	width: 150px;
}
.zhuce-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
</style>

