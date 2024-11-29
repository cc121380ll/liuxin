<!-- 学校——班主任管理 -->
<template>
	<div>
    <h3>班主任管理</h3>
		<div class="container">
			<div class="search-box">
				<el-input v-model="query.name" placeholder="姓名" class="search-input mr10" clearable></el-input>
				<el-input v-model="query.phone" placeholder="手机号" class="search-input mr10" clearable></el-input>
				<el-input v-model="query.grade" placeholder="年级" class="search-input mr10" clearable></el-input>
				<el-input v-model="query._class" placeholder="班级" class="search-input mr10" clearable></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
        <el-table-column label="序号" align="center">
          <template #default="scope">
            {{ (scope.$index+1)+(query.pageNum-1)*query.pageSize }}
          </template>
        </el-table-column>
				<el-table-column prop="name" label="姓名" align="center"></el-table-column>
				<el-table-column prop="phone" label="手机号" align="center"></el-table-column>
				<el-table-column prop="grade" label="年级" align="center"></el-table-column>
				<el-table-column prop="_class" label="行政班级" align="center"></el-table-column>
				<el-table-column prop="createdTime" label="创建时间" align="center"></el-table-column>
				<el-table-column prop="updatedTime" label="修改时间" align="center"></el-table-column>
				<el-table-column label="操作" width="280" align="center">
					<template #default="scope">
						<el-button
							type="primary"
							size="small"
							:icon="View"
							@click="handleView(scope.row)"
							v-permiss="15"
						>
							查看
						</el-button>
						<el-button
							type="success"
							size="small"
							:icon="Setting"
							@click="handleResetPassword(scope.$index)"
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
					:current-page="query.pageNum"
					:page-size="query.pageSize"
					:total="pageTotal"
					@current-change="handlePageChange"
				></el-pagination>
			</div>
		</div>
		<el-dialog
			:title="idEdit ? '编辑班主任' : '新增班主任'"
			v-model="visible"
			width="500px"
			destroy-on-close
			:close-on-click-modal="false"
			@close="closeDialog"
		>
			<TeacherEdit :data="rowData" :edit="idEdit" :update="updateData" />
		</el-dialog>
    <el-dialog
      v-model="visible1"
      width="500px"
      destroy-on-close
      :close-on-click-modal="false"
      @close="closeDialog1">
      <TeacherDetail :data="rowData"/>
    </el-dialog>
		<el-dialog title="重置密码" v-model="visible2" width="500px"  @close="closeDialog2" destroy-on-close>
      <ResetPassword :update="updatePassword" :edit="true" :data="''"/>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, CirclePlusFilled ,Setting,View} from '@element-plus/icons-vue';
import { fetchData } from '../api/index';
import TeacherEdit from '../components/teacher-edit.vue';
import TeacherDetail from '../components/teacher-detail.vue'
import ResetPassword from "../components/reset-password.vue";
import TableDetail from '../components/table-detail.vue';
import {teacherSearchApi} from '../api/teacherSearch.js'
import axios from 'axios';
import {deleteData, getMyData, search, getView, S_editData,editData} from "../net/index.js";
import resetPassword from "../components/reset-password.vue";

interface TableItem {
	id: bigint;
	name: string;
	phone: string;
  grade:number;
	_class: number;
	createdTime: string;
	updatedTime: string;
}

const query = reactive({
	name: '',
  phone: '',
  grade: '',
  _class: '',
	pageNum: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);

// 获取表格数据
/*
const sendDataToBackend = async (data: { tableData: any;pageTotal: any; }) => {
	try{
		const response = await fetch('/api/school-system/teachers',{
			method:'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body:JSON.stringify(data)
		});
		
		if(!response.ok) {
			throw new Error('Failed to send data to backend');
		}
		
		const responseData = await response.json();
		console.log('Response from backend:',responseData);
		//可以根据后端返回的数据进行相应的处理
	}catch(error){
		console.error('Error sending data to backend',error.message);
	}
};

const getDataAndSendToBackend = async () => {
	try{
		const res =await fetchData();
		const tableData = res.data.list;
		const pageTotal = res.data.pageTotal || 50;
		//将数据组装成需要发送给后端的格式
		const dataToSend = {
			tableData : tableData,
			pageTotal: pageTotal
		};
		//发送数据到后端
		await sendDataToBackend(dataToSend)
	}catch(error){
		console.error('Error getting data',error.message);
	}
};

getDataAndSendToBackend();
*/

// 查询操作
/*
const handleSearch = () => {
  const backendUrl = "https://localhost:8083/api/school-system/teachers/view/{id}";

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
};
*/

const getStuData = async () => {
  const data = await getMyData('http://115.29.41.122:9662/api/school-system/teachers', query)
  tableData.value=data.rows
  pageTotal.value=data.total
}
getStuData();
const handleSearch = () => {
  search('/api/school-system/teachers',query,(data)=>{
    tableData.value=data.rows
    pageTotal.value=data.total
  })
}
// 调用 handleSearch 函数来执行搜索
//handleSearch();


// 分页导航
const handlePageChange = (val: number) => {
	query.pageNum = val;
	getStuData();
};

// 删除操作
/*
const handleDelete = (index: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
      .then(() => {
        // 先从服务器删除数据
        deleteData(`/api/school-system/students/delete/${tableData.value[index].id}`)
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
*/

const visible = ref(false);
let idx: number = -1;
let idy: bigint = -1n;
const idEdit = ref(false);
const rowData = ref({});

const handleEdit = (index: number, row: TableItem) => {
	idx = index;
	rowData.value = row;
	idEdit.value = true;
	visible.value = true;
};
const updateData = async (row: TableItem) => {
  editData('/api/school-system/teachers/add',{
    name:row.name,
    phone:row.phone
  },async()=>{
    //ElMessage.success("添加成功")
    await getStuData()
  })
	/*idEdit.value ? (tableData.value[idx] = row) : tableData.value.unshift(row);
	console.log(tableData.value);*/
	closeDialog();
};

const closeDialog = () => {
	visible.value = false;
	idEdit.value = false;
};

const visible1 = ref(false);

const handleView = (row: TableItem) => {
  getView(`api/school-system/teachers/view/${row.id}`,(myData)=>{
    rowData.value = myData
    visible1.value = true;
  })

};
const closeDialog1 = () => {
  visible1.value = false;
}
const visible2 = ref(false)
const handleResetPassword = (index:number) => {
  idx = index
  idy = tableData.value[index].id
  visible2.value = true
}
const updatePassword = (password:string)=>{
  S_editData(`api/school-system/teachers/reset-password/${idy}`,'multipart/form-data',password,()=>{
    //ElMessage.success("修改成功")
  })
  closeDialog2()
}
const closeDialog2 = () => {
  visible2.value = true
}
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
