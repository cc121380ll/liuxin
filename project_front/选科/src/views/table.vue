<!-- 班主任——学生管理 -->
<template>
	<div>
    <h3>学生管理</h3>
		<div class="container">
			<div class="search-box">
        <el-form :model="searchForm" ref="searchFormRef">
          <el-input v-model="searchForm.name" placeholder="姓名" class="search-input mr10" clearable></el-input>
          <el-input v-model="searchForm.studentNumber" placeholder="学号" class="search-input mr10" clearable></el-input>
          <el-select v-model="searchForm.status" placeholder="选择" class="search-input mr10">
            <el-option label="启用" value=1></el-option>
            <el-option label="停用" value=0></el-option>
          </el-select>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        </el-form>

<!--				<el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>-->
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
<!--				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>-->
        <el-table-column label="序号" align="center">
          <template #default="scope">
            {{ (scope.$index+1)+(searchForm.pageNum-1)*searchForm.pageSize }}
          </template>
        </el-table-column>
				<el-table-column prop="name" label="姓名" align="center"></el-table-column>
				<el-table-column prop="gender" label="性别" align="center"></el-table-column>
				<el-table-column prop="studentNumber" label="学号" align="center"></el-table-column>
				<el-table-column prop="grade" label="年级" align="center"></el-table-column>
				<el-table-column prop="createdTime" label="更新时间" align="center"></el-table-column>
				<el-table-column prop="_class" label="行政班级" align="center"></el-table-column>
				<el-table-column prop='status' label="账户状态" align="center">
					<template #default="scope">
						<el-tag :type="scope.row.status===1 ? 'success' : 'danger'">
							{{ scope.row.status===1 ? '启用' : '停用' }}
						</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="280" align="center">
					<template #default="scope">
						<el-button
							type="primary"
							size="small"
							:icon="Edit"
							@click="handleEdit(scope.$index, scope.row)"
							v-permiss="15">
							编辑
						</el-button>
						<el-button
							type="danger"
							size="small"
							:icon="Delete"
							@click="handleDelete(scope.$index)"
							v-permiss="15">
							删除
						</el-button>
            <el-button
                type="success"
                size="small"
                :icon="Setting"
                @click="handleRestPassword(scope.$index)"
                v-permiss="15">
                重置密码
            </el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					layout="total, prev, pager, next"
					:current-page="searchForm.pageNum"
					:page-size="searchForm.pageSize"
					:total="pageTotal"
					@current-change="handlePageChange"
				></el-pagination>
			</div>
		</div>
		<el-dialog
			:title="idEdit ? '编辑学生' : '新增学生'"
			v-model="visible"
			width="500px"
			destroy-on-close
			:close-on-click-modal="false"
			@close="closeDialog"
		>
			<TableEdit :data="rowData" :edit="idEdit" :update="updateData" />
		</el-dialog>
		<el-dialog title="重置密码" v-model="visible1" width="500px" destroy-on-close :close-on-click-modal="false" @close="closeDialog1">
		  <ResetPassword :data="oldPassword" :edit="true" :update="updatePassword"/>
		</el-dialog>
  </div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {Delete, Edit, Search, CirclePlusFilled, Setting} from '@element-plus/icons-vue';
import { fetchData } from '../api/index';
import TableEdit from '../components/table-edit.vue';
import TableDetail from '../components/table-detail.vue';
import ResetPassword from "../components/reset-password.vue";
import request from '../utils/request';
import axios from 'axios';
import { search,getMyData,deleteData,editData,S_editData} from "../net/index.js";
import router from "../router";

interface TableItem {
  id: bigint,
  name: string,
  gender: string,
  studentNumber: string,
  grade: string,
  _class: string,
  status: number,
  password:string,
  createdTime:string,
  updatedTime: string
}
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
const searchFormRef=ref()
const searchForm = reactive({
  name:'',
  studentNumber:'',
  status:'1',
  pageNum:1,
  pageSize:10
})


// 获取表格数据
/*const sendDataToBackend = async (data: { tableData: any; pageTotal: any; }) => {
  try {
    const response = await fetch('/api/teacher-system/students', {
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

// 查询操作
/*const handleSearch = () => {
  const backendUrl = "/api/teacher-system/students";

  // 使用 axios 发起 GET 请求
  axios.get(backendUrl)
    .then(response => {
      // 处理响应数据
      const searchResults = response.data;
      console.log('Search results:', searchResults);
      // 如果需要将数据保存到组件的数据中，可以通过回调函数来处理
      // handleSearchSuccess(searchResults); // 示例中的处理函数
    })
    .catch(error => {
      console.error('Search error:', error);
    });
};*/
const getStuData = async () => {
  const data = await getMyData('http://localhost:8083/api/teacher-system/students', searchForm)
  tableData.value=data.rows
  pageTotal.value=data.total
}
getStuData();
const handleSearch = () => {
    search('/api/teacher-system/students',searchForm,(data)=>{
      tableData.value=data.rows
      pageTotal.value=data.total
    })
}
// 调用 handleSearch 函数来执行搜索
//handleSearch();


// 分页导航
const handlePageChange = (val: number) => {
	searchForm.pageNum = val;
	getStuData();
};
//停用启用
/*const handleStatusSet = (index:number,row:TableItem) => {

}*/
// 删除操作
const handleDelete = (index: number) => {
  // 二次确认删除
  ElMessageBox.confirm('确定要删除吗？', '提示', {
    type: 'warning'
  })
      .then(() => {
        // 先从服务器删除数据
        deleteData(`/api/teacher-system/students/delete/${tableData.value[index].id}`)
            .then(() => {
              // 服务器删除成功后，更新本地数组
              ElMessage.success('删除成功');
              tableData.value.splice(index, 1);
            })
            .catch(() => {
              // 如果服务器删除失败，通知用户
              ElMessage.error('删除失败');
            });
      })
      .catch(() => {
        // 用户取消操作
        ElMessage.info('取消删除');
      });
};


const visible = ref(false);
let idx: number = -1;
let idy: bigint = -1n;
const idEdit = ref(false);
const rowData = ref<TableItem>();
const oldPassword = reactive({
  password:''
})
const handleEdit = (index: number, row: TableItem) => {
	idx = index;
	rowData.value = row;
	idEdit.value = true;
	visible.value = true;
};
const updateData =async(row: TableItem) => {
  editData(`/api/teacher-system/students/edit/${row.id}`,{
    name:row.name,
    gender:row.gender,
    studentNumber:row.studentNumber,
    grade:row.grade,
    _class:row._class,
    status:row.status
  },async ()=>{
   // ElMessage.success("修改成功")
    await getStuData()
  })

    /*idEdit.value ? (tableData.value[idx] = row) : tableData.value.unshift(row);
    console.log(tableData.value);*/

	closeDialog();
};
const handleRestPassword = (index:number) =>{
  idx = index
  idy = tableData.value[index].id
  oldPassword.password = tableData.value[index].password
  visible1.value = true
}
const updatePassword =async (password:string)=>{
  S_editData(`api/teacher-system/students/reset/${idy}`,'multipart/form-data',password,async ()=>{
    //ElMessage.success("修改成功")
    const s = tableData.value.findIndex(student => student.id === idy);
    if (s!=-1) {
      tableData[s].value.password = password;
    }
  })
 /* const s = tableData.value.findIndex(student => student.id === idy);
  if (s!=-1) {
    tableData[s].value.password = password; // 更新密码
  }*/
  closeDialog1()
}
const closeDialog = () => {
	visible.value = false;
	idEdit.value = false;
};
const closeDialog1 = ()=> {
  visible1.value = false;
}

const visible1 = ref(false);

/*function getData() {
	throw new Error('Function not implemented.');
}*/
</script>

<style scoped>
h3{
	margin: 15px;
}
.search-box {
	margin-bottom: 20px;
}

.search-input {
	width: 200px;
}

.mr10 {
	margin-right: 10px;
}
.table-td-thumb {
	display: block;
	margin: auto;
	width: 40px;
	height: 40px;
}
</style>
