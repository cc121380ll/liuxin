<template>
  <div class="zhuce-wrap">
    <div class="ms-zhuce">
      <div class="ms-title">新高考选科平台</div>
      <el-form :model="param" :rules="rules" ref="zhuce" @validate="onValidate" label-width="0px" class="ms-content">
        <el-form-item prop="info">
          <div style="display: flex; gap: 5px">
            <el-cascader
                placeholder="选择省市区"
                :options="options"
                v-model="param.info.zone"
                filterable
            />
            <el-input v-model="param.info.school" placeholder="请输入学校">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="param.phone" placeholder="请输入手机号">
            <template #prepend>
              <el-button :icon="Iphone"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              placeholder="请输入6-16位密码,区分大小写"
              v-model="param.password"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
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
              @keyup.enter="submitForm"
          >
            <template #append>
              <el-button
                  @click="send(param.phone)"
                  :disabled="!isPhoneValid || coldTime > 0"
              > {{coldTime > 0 ? '请稍后 ' + coldTime + ' 秒' : '获取验证码'}}</el-button>
            </template >
          </el-input>
        </el-form-item>
        <div class="register-bottom">
          <el-button style="width: 180px" type="primary" @click="submitForm">注册</el-button>
          <a href="" style="float: right; font-size: 12px;">使用已有账户登录</a>
        </div>
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
import {Iphone, Lock} from "@element-plus/icons-vue";
import {get, post} from "../net/index.js";
import cities from "../assets/cities.json"

interface LoginInfo {
  info:{
    zone: string[];
    school: string;
  };
  phone: string;
  password: string;
	code:string;
	confirm:string;
}

const isPhoneValid = ref(false)
const coldTime = ref(0)
const router = useRouter();
const param = reactive<LoginInfo>({
  info: {
    zone: [],
    school: ''
  },
  phone: '',
  password: '',
  code: '',
  confirm: ''
});
const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== param.password) {
    callback(new Error("两次输入的密码不一致"))
  } else {
    callback()
  }
}
const rules: FormRules = {
    phone: [
      {
            required: true,
            message: '请输入手机号',
            trigger: 'blur',
      },
      {
        pattern:/^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
        message:'请输入正确的手机号',
        trigger:'blur'
      }
    ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
	confirm:[
    {required:true,message:'请确认密码',trigger:'blur'},
    { validator: validatePassword, trigger: ['blur', 'change'] }
  ],
	code:[{required:true,message:'请输入验证码',trigger:'blur'}],
};
const permiss = usePermissStore();
const zhuce = ref<FormInstance>();
const options = ref(cities);
const onValidate = (prop, isValid) => {
  if(prop === 'phone')
    isPhoneValid.value = isValid
}
const send = (phone) => {
  coldTime.value = 60
  get(`/api/auth/ask-code?phone=${phone}&type=register`, () => {
    ElMessage.success('验证码已发送到手机')
    const handle = setInterval(() => {
      coldTime.value--
      if(coldTime.value === 0) {
        clearInterval(handle)
      }
    }, 1000)
  }, (message) => {
    ElMessage.warning(message)
    coldTime.value = 0
  })
}
const submitForm = () =>{
  post('/api/auth/register',{
    province:param.info.zone[0],
    city:param.info.zone[1],
    county:param.info.zone[2],
    schoolName:param.info.school,
    phone:param.phone,
    password:param.password,
    code:param.code
  },()=>{
    ElMessage.success("注册成功");
    router.push('/login');
  })
}
const tags = useTagsStore();
tags.clearTags();


</script>

<style scoped>
.register-bottom{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
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

