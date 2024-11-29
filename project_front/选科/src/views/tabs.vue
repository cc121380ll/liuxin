<!-- 班主任——选科管理 -->
<template>
  <div>
    <h3>选科管理</h3>
    <div class="container">
      <el-form :model="query" ref="queryForm">
        <el-input v-model="query.name" placeholder="姓名" class="search-input mr10"></el-input>
        <el-select v-model="query.subject" placeholder="学科" class="search-input mr10">
          <el-option value="化学"></el-option>
          <el-option value="物理"></el-option>
          <el-option value="生物"></el-option>
          <el-option value="地理"></el-option>
          <el-option value="政治"></el-option>
          <el-option value="历史"></el-option>
        </el-select>
        <el-select v-model="query.status" class="search-input mr10">
          <el-option label=已选 value=1></el-option>
          <el-option label=未选 value=0></el-option>
        </el-select>
        <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
      </el-form>
      <el-button type="info" class="button"  @click="exportXlsx">导出选科名单</el-button>
      <el-table :data="tableData" border class="table" header-cell-class-name="table-header" style="margin-top: 20px;">
        <el-table-column label="序号" align="center">
          <template #default="scope">
            {{ (scope.$index+1)+(query.pageNum-1)*query.pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名"  align="center"></el-table-column>
        <el-table-column prop="studentNumber" label="学号"  align="center"></el-table-column>
        <el-table-column prop="subject" label="选择科目" align="center"></el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template #default="scope">
            <el-tag :type="scope.row.status===1 ? 'success' : 'danger'">
              {{ scope.row.status===1 ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          background
          layout="total, prev, pager, next"
          :current-page="query.pageNum"
          :page-size="query.pageSize"
          :total="pageTotal"
          @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script setup lang="ts" name="tabs">
import { ref, reactive } from 'vue';
import {  Search } from '@element-plus/icons-vue';
import SubjectEdit from '../components/subjects-edit.vue';
import * as XLSX from 'xlsx';
import { fetchData } from '../api';
import {getMyData, search,takeAccessToken} from "../net/index.js";

const query = reactive({
  name:'',
  subject:'',
  status:'1',
  pageNum:1,
  pageSize:10
	});
const queryForm = ref()
interface TableItem {
	id:number,
  name:string,
	studentNumber:string,
	subject:string;
  status:number;
}

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
// const getData = () => {
//     tableData.value = [
//         {
//             id: 1,
//             name: '李大勇',
//             sno: '2023012654',
// 			subjects:'物理 化学 生物'
//         },
//     ];
// };
// getData();

/*const sendDataToBackend = async (data: { tableData: any; pageTotal: any; }) => {
  try {
    const response = await fetch('https://example.com/api/teacher-system/collect-information', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to send data to backend');
    }

    const responseData = await response.json();
    console.log('Response from backend:', responseData);
    // 可以根据后端返回的数据进行相应的处理

  } catch (error) {
    console.error('Error sending data to backend:', error.message);
  }
};

const getDataAndSendToBackend = async () => {
  try {
    const res = await fetchData();
    const tableData = res.data.list;
    const pageTotal = res.data.pageTotal || 50;
    // 将数据组装成需要发送给后端的格式
    const dataToSend = {
      tableData: tableData,
      pageTotal: pageTotal
    };
    // 发送数据到后端
    await sendDataToBackend(dataToSend);
  } catch (error) {
    console.error('Error getting data:', error.message);
  }
};

getDataAndSendToBackend();*/
const getStuData = async () => {
  const data = await getMyData("http://115.29.41.122:9662/api/teacher-system/collect-information",query)
  tableData.value=data.rows
  pageTotal.value=data.total
}
getStuData();
const handleSearch = () => {
  search('/api/teacher-system/collect-information',query,(data)=>{
    tableData.value=data.rows
    pageTotal.value=data.total
  })
};
const handlePageChange = (val: number) => {
  query.pageNum = val;
  getStuData();
};

const visible = ref(false);
let idx: number = -1;
const idEdit = ref(false);
const rowData = ref({});
const handleEdit = (index: number, row: TableItem) => {
	idx = index;
	rowData.value = row;
	idEdit.value = true;
	visible.value = true;
};
const updateData = (row: TableItem) => {
	idEdit.value ? (tableData.value[idx] = row) : tableData.value.unshift(row);
	console.log(tableData.value);
	closeDialog();
};

const closeDialog = () => {
	visible.value = false;
	idEdit.value = false;
};

const list = [['序号', '姓名', '学号', '选择科目', '状态']];
const exportXlsx = () => {
    /*tableData.value.map((item: any, i: number) => {
        const arr: any[] = [i + 1];
        arr.push(...[item.name, item.sno, item.class, item.age, item.sex]);
        list.push(arr);
    });
    let WorkSheet = XLSX.utils.aoa_to_sheet(list);
    let new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, WorkSheet, '第一页');
    XLSX.writeFile(new_workbook, `表格.xlsx`);*/
  /*exportXlsx('/api/')*/
  window.open('http://115.29.41.122:9662/api/teacher-system/export?token='+takeAccessToken())
};


/*function getData() {
	throw new Error('Function not implemented.');
}*/
</script>

<style>
	
.button{
	float: right;
	margin-bottom: 20px;
	background-color: #ffffff;
	color:blue;
	border: 1px solid #ffffff;
}
h3{
	margin: 20px;
}
.add {
	font-size: 14px;
	color: #3952FD;
	float: right;
	margin-bottom: 20px;
}
.message-title {
	cursor: pointer;
}
.handle-row {
	margin-top: 30px;
}
.search-input {
  width: 200px;
}
.mr10 {
  margin-right: 10px;
}
</style>
