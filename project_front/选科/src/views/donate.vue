<!--学校——选科管理 -->
<template>
	<div>
    <h3>选科管理</h3>
		<div class="container">
			<div class="search-box">
        <el-input v-model="query.subject" placeholder="选科名称"  class="search-input mr10" clearable></el-input>
        <el-button type="primary" :icon="Search" @click="getSubData">搜索</el-button>
        <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
<!--				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>-->
        <el-table-column label="序号" align="center">
          <template #default="scope">
            {{ (scope.$index+1)+(query.pageNum-1)*query.pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="选科组合" align="center"></el-table-column>
				<el-table-column prop="createdTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="updatedTime" label="更新时间" align="center"></el-table-column>
				<el-table-column label="操作" width="280" align="center">
					<template #default="scope">
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
					:current-page="query.pageNum"
					:page-size="query.pageSize"
					:total="pageTotal"
					@current-change="handlePageChange"
				></el-pagination>
			</div>
		</div>
		<el-dialog
			:title="idEdit ? '编辑选课组合' : '新增选课组合'"
			v-model="visible"
			width="500px"
			destroy-on-close
			:close-on-click-modal="false"
			@close="closeDialog"
		>
			<TableEdit :data="rowData" :edit="idEdit" :update="updateData" />
		</el-dialog>
		<el-dialog title="重置密码" v-model="visible1" width="700px" destroy-on-close>
			<TableDetail :data="rowData" />
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import {ref, reactive, onMounted} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Search, CirclePlusFilled } from '@element-plus/icons-vue';
import { fetchData } from '../api/index';
import TableEdit from '../components/subjects-edit.vue';
import TableDetail from '../components/table-detail.vue';
import axios from 'axios';
import {deletes, async_post, takeAccessToken} from "../net/index.js";

interface TableItem {
	id: number;
	name: string;
	createdTime: string;
  updatedTime: string
}
const query = reactive({
	subject:'',
  pageNum: 1,
	pageSize: 10
});
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);

onMounted( ()=>{
  getSubData();
});
const getSubData = async () => {
 /* const data = await getMyData('http://115.29.41.122:9662/api/school-system/school-subject', query)
  tableData.value=data.rows
  pageTotal.value=data.total*/
  await async_post({
    url: '/api/school-system/school-subject',
    data: query,
    success: (data) => {
      tableData.value = data.rows
      pageTotal.value = data.tota
    }
  })
}
/*const handleSearch = async () => {
 /!* search('/api/school-system/school-subject',query,(data)=>{
    tableData.value=data.rows
    pageTotal.value=data.total
  })*!/
  await async_post({
    url: '/api/school-system/school-subject',
    data: query,
    success: (data) => {
      tableData.value = data.rows
      pageTotal.value = data.tota
    }
  })
}*/
// 分页导航
const handlePageChange = (val: number) => {
	query.pageNum = val;
	getSubData();
};

// 删除操作
const handleDelete = (index: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
      .then(() => {
        // 先从服务器删除数据
        deletes(`/api/school-system/school-subject/delete/${tableData.value[index].id}`,()=>{
          // 服务器删除成功后，更新本地数组
          ElMessage.success('删除成功');
          tableData.value.splice(index, 1);
        },()=>{
          // 如果服务器删除失败，通知用户
          ElMessage.error('删除失败');
        })
      })
      .catch(() => {
        // 用户取消操作
        ElMessage.info('取消删除');
      });
};

const visible = ref(false);
let idx: number = -1;
const idEdit = ref(false);
const rowData = ref({});
const updateData = async (row: TableItem) => {
  /*S_editData(`/api/school-system/add-subject`, 'multipart/form-data', {
    subjects: row.name
  }, async() => {
    //ElMessage.success("添加成功")
    await getSubData();
  })*/
  await async_post({
    url: '/api/school-system/add-subject',
    data: Array.from(row.name),
    success: () => {
      ElMessage.success("添加成功");
      getSubData()
    },
   /* header: {
      'Authorization': `Bearer ${takeAccessToken()}`,
      'Content-Type': 'application/json'
    }*/
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
