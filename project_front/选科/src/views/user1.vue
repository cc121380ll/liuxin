<template>
  <div>
    <div class="user-container">
      <el-card class="user-profile" shadow="hover" :body-style="{ padding: '0px' }">
        <div class="user-profile-bg"></div>
        <div class="user-avatar-wrap">
          <el-avatar class="user-avatar" :size="120" :src="avatarImg" />
        </div>
        <div class="user-info">
          <div class="info-name">{{ name }}</div>
          <!--                    <div class="info-icon">
                                  <i class="el-icon-lx-redpacket_fill"></i>
                                  <i class="el-icon-lx-weibo"></i>
                                  <i class="el-icon-lx-emojifill"></i>
                                  <i class="el-icon-lx-favor"></i>
                              </div>-->
        </div>
        <div class="user-footer">
          <div class="user-footer-item">
            <el-statistic title="学生总数" :value="num[0]" />
          </div>
          <div class="user-footer-item">
            <el-statistic title="老师总数" :value="num[1]" />
          </div>
          <div class="user-footer-item">
            <el-statistic title="已创建选课" :value="num[2]" />
          </div>
        </div>
      </el-card>
      <el-card
          class="user-content"
          shadow="hover"
          :body-style="{ padding: '20px 50px', height: '100%', boxSizing: 'border-box' }">
        <el-tabs tab-position="left" v-model="activeName">
          <el-tab-pane name="label1" label="我的头像" class="user-tabpane">
            <div class="crop-wrap" v-if="activeName === 'label1'">
              <VueCropper
                  ref="cropper"
                  :img="imgSrc"
                  :autoCrop="true"
                  :centerBox="true"
                  :full="true"
                  mode="contain"
              >
              </VueCropper>
            </div>
            <el-button class="crop-demo-btn" type="primary"
            >选择图片
              <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" />
            </el-button>
            <el-button type="success" @click="saveAvatar">上传并保存</el-button>
          </el-tab-pane>
          <el-tab-pane name="label2" label="修改密码" class="user-tabpane"
                       style="display: flex; align-items: center; justify-content: center;">
            <el-form class="w500"
                     :rules="rules"
                     :model="form"
                     @validate="onValidate"
                     ref="loginFormRef">
              <el-form-item>
                <el-input class="form-input" type="text" v-model="form.phone" placeholder="请输入手机号">
                  <template #prepend>
                    <el-button :icon="Iphone"></el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="" prop="verificationCode">
                <el-input class="form-input" v-model="form.code" placeholder="请输入验证码">
                  <template #append>
                    <el-button
                        @click="send"
                        :disabled="!isPhoneValid || coldTime > 0"
                    > {{coldTime > 0 ? '请稍后 ' + coldTime + ' 秒' : '获取验证码'}}</el-button>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item label="">
                <el-input class="form-input" type="password" v-model="form.oldPassword" placeholder="请输入旧密码"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-input class="form-input" type="password" v-model="form.newPassword" placeholder="请输入新密码"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-input class="form-input" type="password" v-model="form.confirm" placeholder="再次输入新密码"></el-input>
              </el-form-item>
              <el-form-item style="float: right">
                <el-button type="primary" style="width: 100px" @click="resetPassword">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref, computed, onUnmounted, onMounted} from 'vue';
import {ElMessage, FormRules} from 'element-plus';
import {async_get, get, post} from "../net/index.js";
import {Iphone} from "@element-plus/icons-vue";
import { VueCropper } from 'vue-cropper';
import 'vue-cropper/dist/index.css';
// import TabsComp from '../element/tabs.vue';

// const name = localStorage.getItem('ms_username');
const name = JSON.parse(sessionStorage.getItem("access_token")||localStorage.getItem("access_token")).username

const form = reactive({
  phone:'',
  oldPassword:'',
  newPassword:'',
  confirm:'',
  code:''
});


const avatar = ref('');
const activeName = ref('label1');
const avatarImg = ref(avatar);
const imgSrc = ref(avatar);
const cropImg = ref('');
const cropper = ref(null);
const num = ref([]);
const isPhoneValid = ref(false)
const coldTime = ref(0);

const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.newPassword) {
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
      pattern:/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/,
      message:'请输入正确的手机号',
      trigger:'blur'
    }
  ],
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  confirm:[
    {required:true,message:'请确认密码',trigger:'blur'},
    { validator: validatePassword, trigger: ['blur', 'change'] }
  ],
  code:[{required:true,message:'请输入验证码',trigger:'blur'}],
};
const onValidate = (prop, isValid) => {
  if(prop === 'phone')
    isPhoneValid.value = isValid
}
const setImage = (e: any) => {
  const file = e.target.files[0];
  if (!file.type.includes('image/')) {
    return;
  }
  const reader = new FileReader();
  const maxSizeInMB = 5;
  if (file.size > maxSizeInMB * 1024 * 1024) {
    ElMessage.error(`图片大小不能超过 ${maxSizeInMB} MB`);
    return;
  }
  reader.onload = (event: any) => {
    imgSrc.value = event.target.result;
    //设置要裁剪图片
    cropper.value = event.target.result;
  };
  reader.readAsDataURL(file);
};
const send = () => {
  coldTime.value = 60
  get('', () => {
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
const saveAvatar = () => {
  if(cropper.value)
    cropper.value.getCropData((data) => {
      cropImg.value = data
    }); // 获取裁剪后的图片数据
  post('/api/school-system/reset/school',{
    phone:null,
    code:null,
    oldPassword:null,
    newPassword:null,
    avatar:cropImg.value,
    type:'avatar'
  },()=>{
    avatarImg.value = cropImg.value;
    ElMessage.success("设置成功")
  },()=>{
    ElMessage.error("设置失败，请重试")
  });
};

const resetPassword = () => {
  post('/api/school-system/reset/school',{
    phone:form.phone,
    code:form.code,
    oldPassword:form.oldPassword,
    newPassword:form.newPassword,
    avatar:null,
    type:'pass'
  },()=>{
    avatarImg.value = cropImg.value;
    ElMessage.success("设置成功")
  },()=>{
    ElMessage.error("设置失败，请重试")
  });
}
const getNum = () => {
  try{
    get('/api/school-system/num',(data)=>{
      num.value = data;
    });
  }catch (error) {
    console.error('Error fetching data:', error);// 处理错误，如显示错误信息
  }}
getNum();
const getAvatar = () => {
  try{
    get('/api/auth/load-avatar',(data)=>{
      avatar.value = data;
    });
  }catch (error) {
    console.error('Error fetching data:', error);// 处理错误，如显示错误信息
  }
}
getAvatar();
</script>

<style scoped>

.user-container {
    display: flex;
}

.user-profile {
    position: relative;
}

.user-profile-bg {
    width: 100%;
    height: 200px;
    background-image: url('../assets/img/ucenter-bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.user-profile {
    width: 500px;
    margin-right: 20px;
    flex: 0 0 auto;
    align-self: flex-start;
}

.user-avatar-wrap {
    position: absolute;
    top: 135px;
    width: 100%;
    text-align: center;
}

.user-avatar {
    border: 5px solid #fff;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 7px 12px 0 rgba(62, 57, 107, 0.16);
}

.user-info {
    text-align: center;
    padding: 80px 0 30px;
}

.info-name {
    margin: 0 0 20px;
    font-size: 22px;
    font-weight: 500;
    color: #373a3c;
}

.info-icon {
    margin-top: 10px;
}

.info-icon i {
    font-size: 30px;
    margin: 0 10px;
    color: #343434;
}

.user-content {
    flex: 1;
}

.user-tabpane {
    padding: 10px 20px;
}

.crop-wrap {
    width: 600px;
    height: 320px;
    margin-bottom: 20px;
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

.w500 {
  width: 350px;
  margin-top: 30px;
}

.user-footer {
    display: flex;
    border-top: 1px solid rgba(83, 70, 134, 0.1);
}

.user-footer-item {
    padding: 20px 0;
    width: 33.3333333333%;
    text-align: center;
}

.user-footer > div + div {
    border-left: 1px solid rgba(83, 70, 134, 0.1);
}
.form-input{
  height: 36px;
}
</style>

<style>
.el-tabs.el-tabs--left {
    height: 100%;
}
</style>