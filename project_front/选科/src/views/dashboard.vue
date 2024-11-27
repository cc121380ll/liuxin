<!-- 首页 -->

<template>
<div style="height: 100%;display: flex;justify-content: center;align-items: center">
<!--    		<el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover" class="mgb20" style="height: 252px">
              <div class="user-info">
                <el-avatar :size="120" :src="imgurl" />
                <div class="user-info-cont">
                  <div class="user-info-name">{{ name }}</div>
                </div>
              </div>
              <div class="user-info-list">
                 登录时间：
                <span>{{formattedDate}}</span>
              </div>
    &lt;!&ndash;					<div class="user-info-list">
                上次登录地点：
                <span>东莞</span>
              </div>&ndash;&gt;
              <div class="user-info-list">
                用户角色：
                <span>{{ role }}</span>
              </div>
            </el-card>
          </el-col>
          <el-col :span="16">
            <el-row :gutter="20" class="mgb20">
              <el-col :span="12">
                <el-card shadow="hover" :body-style="{ padding: '0px' }">
                  <div class="grid-content grid-con-1">
                    <el-icon class="grid-con-icon"><User /></el-icon>
                    <div class="grid-cont-right">
                      <div class="grid-num">{{num}}</div>
                      <div>学生总人数</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
              <el-col :span="12">
                <el-card shadow="hover" :body-style="{ padding: '0px' }">
                  <div class="grid-content grid-con-2">
                    <el-icon class="grid-con-icon"><ChatDotRound /></el-icon>
                    <div class="grid-cont-right">
                      <div class="grid-num">321</div>
                      <div>系统消息</div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-col>
        </el-row>-->
    <div style="display: flex;flex-direction: column;align-items: center" v-permiss="16">
      <el-steps style="width: 1000px" :active="active" :space="600" finish-status="success" align-center>
        <el-step title="下载模板" ></el-step>
        <el-step title="上传信息"></el-step>
      </el-steps>
      <div class="handle-box" style="display: flex; align-items: center; justify-content: center;">
        <div class="download-demo"  @click="downloadTemplate">
          <el-icon style="font-size: 67px; margin-bottom: 16px;color: #a9abb1"><download/></el-icon>
          <div class="el-upload__text">
            点击下载导入模板
            <a ref="downloadTemplateRef" href="./学生信息模版示例.xlsx"/>
          </div>
        </div>
        <el-upload
            class="upload-demo"
            drag
            action=" http://localhost:8083/api/school-system/upload"
            :limit="1"
            accept=".xlsx, .xls"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="()=>{active = 2;}"
        >
          <el-icon class="el-icon--upload"><upload/></el-icon>
          <div class="el-upload__text" @dragover.prevent="handleDragOver" @drop.prevent="handleFileDrop">
            点击或拖拽上传
          </div>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="dashboard">


import {Delete, Search, CirclePlusFilled, UploadFilled, Document, Download, Upload} from '@element-plus/icons-vue';
import { ref } from 'vue';
import {ElMessage, UploadProps} from 'element-plus';
import * as XLSX from 'xlsx';
import {S_editData, get, getView} from "../net/index.js";
import {BaiduMap} from "vue-baidu-map-3x";
import Charts from "./charts.vue";


const name = JSON.parse(sessionStorage.getItem("access_token")||localStorage.getItem("access_token")).username;
const role = JSON.parse(sessionStorage.getItem("role"));
const dragEnter = ref(false);
const importList = ref<any>([]);
const num = ref(0);
const active = ref(0);
const downloadTemplateRef = ref(null);
function formatDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // getMonth() 返回的月份是从0开始的
  const day = date.getDate();

// 使用模板字符串来构建格式，并确保月和日为两位数
  return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

const date = new Date();
const formattedDate = formatDate(date);
console.log(formattedDate); // 输出: "2024-12-01" (假设date是2024年12月1日的Date对象)

/*const getNum = ()=>{
  console.log(role)
  if(role ==='SCHOOL'){
    getView('/api/school-system/num',(data)=>{
      num.value=data
    })
  }else{
    getView('/api/teacher-system/num',(data)=>{
      num.value=data
    })
  }
}
getNum()*/
const handleDragOver = (e: DragEvent) => {
  dragEnter.value = true;
  e.preventDefault();
};

const handleFileDrop = (e: DragEvent) => {
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    uploadFiles(files);
  }
};
const uploadFiles = (files)=> {
  // 这里是上传文件的逻辑
  // 通常是创建一个FormData对象并使用axios发送HTTP请求
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('file', files[i]);
  }
  S_editData('/api/school-system/upload','multipart/form-data',formData,()=>{
  })
}
const beforeUpload: UploadProps['beforeUpload'] = async (rawFile) => {
    importList.value = await analysisExcel(rawFile);
    return true;
};

const analysisExcel = (file: any) => {
    return new Promise(function (resolve, _reject) {
        const reader = new FileReader();
        reader.onload = function (e: any) {
            const data = e.target.result;
            let datajson = XLSX.read(data, {
                type: 'binary',
            });

            const sheetName = datajson.SheetNames[0];
            const result = XLSX.utils.sheet_to_json(datajson.Sheets[sheetName]);
            resolve(result);
        };
        reader.readAsBinaryString(file);
    });
};


// const handleMany = async () => {
//     // 把数据传给服务器后获取最新列表，这里只是示例，不做请求
//     const list = importList.value.map((item: any, index: number) => {
//         return {
//             id: index,
//             name: item['姓名'],
//             sno: item['学号'],
//             class: item['班级'],
//             age: item['年龄'],
//             sex: item['性别'],
//         };
//     });
//     tableData.value.push(...list);
// };

const template = () => {
  /*  axios.get('/api/school-system/download-template', {
    responseType: 'blob'
  })
  .then(response => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  })
  .catch(error => {
    console.error('下载模板失败:', error);
  });*/
  /*  getWithType('/api/school-system/download-template',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',()=>{
    ElMessage.success("下载成功")
  })
};*/
}
const downloadTemplate = ()=> {
  downloadTemplateRef.value.dispatchEvent(new MouseEvent('click'))
  active.value = 1;
}
</script>

<!--<style scoped>
.el-row {
	margin-bottom: 20px;
}

.grid-content {
	display: flex;
	align-items: center;
	height: 100px;
}

.grid-cont-right {
	flex: 1;
	text-align: center;
	font-size: 14px;
	color: #999;
}

.grid-num {
	font-size: 30px;
	font-weight: bold;
}

.grid-con-icon {
	font-size: 50px;
	width: 100px;
	height: 100px;
	text-align: center;
	line-height: 100px;
	color: #fff;
}

.grid-con-1 .grid-con-icon {
	background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
	color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
	background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
	color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
	background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
	color: rgb(242, 94, 67);
}

.user-info {
	display: flex;
	align-items: center;
	padding-bottom: 20px;
	border-bottom: 2px solid #ccc;
	margin-bottom: 20px;
}

.user-info-cont {
	padding-left: 50px;
	flex: 1;
	font-size: 14px;
	color: #999;
}

.user-info-cont div:first-child {
	font-size: 30px;
	color: #222;
}

.user-info-list {
	font-size: 14px;
	color: #999;
	line-height: 25px;
}

.user-info-list span {
	margin-left: 70px;
}

.mgb20 {
	margin-bottom: 20px;
}

.todo-item {
	font-size: 14px;
}

.todo-item-del {
	text-decoration: line-through;
	color: #999;
}

.schart {
	width: 100%;
	height: 300px;
}

.mr10 {
    margin-right: 10px;
}
.mr20{
	margin-right: 10px;

}
.upload-area {

  width: 150px;
  font-size: 12px;
  background-color: #EEEEEE;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
}
.upload-area.drag-over {
  background-color: #f0f0f0;
  border-color: #000;
}
.upload-icon {
  font-size: 36px;
  margin-bottom: 10px;
}
.upload-text {
  font-size: 16px;
  color: #333;
}
.upload-click {
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}
.my-btn{
  width:150px;
  height:85px;
}
</style>-->
<style scoped>
.map{
  width: 100%;
  height: 300px;
}
.download-demo{
  display: flex;
  margin: 20px;
  width: 400px;
  height: 200px;
  background-color: white;
  border: 1px dashed #d9d9d9;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.download-demo:hover{
  cursor: pointer;
  border-color: #409eff;
  border-style: dashed;
}
/deep/ .el-upload{
  height: 100%;
}
/deep/ .el-upload-dragger{
  height: 100%;
}
.upload-demo{
  margin: 20px;
  width: 400px;
  height: 200px;
}
.el-upload__text{
  font-size: 18px;
}
.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}

.mr10 {
  margin-right: 10px;
}
.mr20{
  margin-right: 10px;
}
</style>
