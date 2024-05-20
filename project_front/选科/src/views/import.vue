<!-- 学校——班主任管理 -->
<template>
	<h3>班主任管理</h3>
	<div>
		<div class="container">
			<div class="search-box">
				<el-input v-model="query.name" placeholder="姓名" class="search-input mr10" clearable></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
				<el-table-column prop="name" label="姓名" align="center"></el-table-column>
				<el-table-column prop="phone" label="手机号" align="center"></el-table-column>
				<el-table-column prop="grade" label="年纪" align="center"></el-table-column>
				<el-table-column prop="class" label="行政班级" align="center"></el-table-column>
				<el-table-column prop="created_time" label="创建时间" align="center"></el-table-column>
				<el-table-column label="操作" width="280" align="center">
					<template #default="scope">
						<el-button
							type="primary"
							size="small"
							:icon="Edit"
							@click="handleEdit(scope.$index, scope.row)"
							v-permiss="15"
						>
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
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination
					background
					layout="total, prev, pager, next"
					:current-page="query.pageIndex"
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
		<el-dialog title="重置密码" v-model="visible1" width="700px" destroy-on-close>
			<TableDetail :data="rowData" />
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, CirclePlusFilled } from '@element-plus/icons-vue';
import { fetchData } from '../api/index';
import TeacherEdit from '../components/teacher-edit.vue';
import TableDetail from '../components/table-detail.vue';
import {teacherSearchApi} from '../api/teacherSearch.js'
import axios from 'axios';

interface TableItem {
	id: number;
	name: string;
	phone: string;
	class: number;
	grade:number;
	created_date: string;
}

const query = reactive({
	name: '',
	pageIndex: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);

// 获取表格数据
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

// 查询操作
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

// 调用 handleSearch 函数来执行搜索
handleSearch();


// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};

// 删除操作
const handleDelete = (index: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			ElMessage.success('删除成功');
			tableData.value.splice(index, 1);
		})
		.catch(() => {});
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

const visible1 = ref(false);
const handleView = (row: TableItem) => {
	rowData.value = row;
	visible1.value = true;
};

function getData() {
	throw new Error('Function not implemented.');
}
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
