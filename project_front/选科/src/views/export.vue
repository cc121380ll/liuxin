 <!-- 学校——学生管理 -->
<template>
	<div>
		<h3>学生管理</h3>
		<div class="container">
			<div class="search-box" style="display: flex; align-items: center;">
        <el-form :model="query" ref="queryForm" style="flex-grow: 1; display: flex; align-items: center;">
          <el-input v-model="query.name" placeholder="姓名" class="search-input mr10" clearable></el-input>
          <el-input v-model="query.studentNumber" placeholder="学号" class="search-input mr10" clearable></el-input>
          <el-input v-model="query._class" placeholder="班级" class="search-input mr10" clearable></el-input>
          <el-select v-model="query.grade" placeholder="年级" class="search-input mr10" clearable>
            <el-option value="一年级"/>
            <el-option value="二年级"/>
            <el-option value="三年级"/>
          </el-select>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
        </el-form>
        <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
        <el-button type="primary" class="button"  @click="exportXlsx">导出Excel</el-button>
      </div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
<!--				<el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>-->
        <el-table-column label="序号" align="center">
          <template #default="scope">
            {{ (scope.$index+1)+(query.pageNum-1)*query.pageSize }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
				<el-table-column prop="gender" label="性别" align="center"></el-table-column>
				<el-table-column prop="studentNumber" label="学号" align="center" ></el-table-column>
				<el-table-column prop="grade" label="年级" align="center"></el-table-column>
				<el-table-column prop="_class" label="行政班级" align="center"></el-table-column>
				<el-table-column prop="classTeacher" label="班主任" align="center"></el-table-column>
				<el-table-column prop="classTeacherPhone" label="班主任手机号" align="center"></el-table-column>
				<el-table-column prop="createdTime" label="注册时间" align="center"></el-table-column>
        <el-table-column prop="updatedTime" label="修改时间" align="center"></el-table-column>
				<el-table-column label="操作" width="280" align="center">
					<template #default="scope">
						<el-button type="warning" size="small" :icon="View" @click="handleView(scope.row)">
							查看
						</el-button>
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
					:current-page="query.pageNum"
					:page-size="query.pageSize"
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
			<StudentEdit :data="rowData" :edit="idEdit" :update="updateData" />
		</el-dialog>
		<el-dialog title="查看学生详情" v-model="visible1" width="700px" destroy-on-close>
			<TableDetail :data="rowData" />
		</el-dialog>
	</div>
</template>


<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, CirclePlusFilled, View } from '@element-plus/icons-vue';
import { fetchData } from '../api/index';
import StudentEdit from '../components/student-edit.vue';
import TableDetail from '../components/table-detail.vue';
import * as XLSX from 'xlsx';
import axios from 'axios';
import {deleteData, editData, getMyData, search, takeAccessToken} from "../net/index.js";


interface TableItem {
	id: bigint;
	name: string;
  gender: string,
  studentNumber:string,
	grade:string;
	_class:string;
  classTeacher:string;
  classTeacherPhone:string;
  createdTime: string;
  updatedTime: string;
}

const query = reactive({
	name: '',
  studentNumber:'',
  grade:'',
  _class:'',
	pageNum: 1,
	pageSize: 10
});
const queryForm = ref()
const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);

// 获取表格数据
//并将数据传入后端
/*const getData = async () => {
  try {
    // 调用fetchData函数获取数据，并等待数据返回
    const res = await fetchData();
    // 从返回的数据中提取表格数据和页数总数
    const tableData = res.data.list; // 表格数据
    const pageTotal = res.data.pageTotal || 50; // 页数总数，默认值为50
    // 将表格数据和页数总数发送到后端
    await sendDataToBackend({ tableData, pageTotal });
  } catch (error) {
    // 捕获并处理可能的错误
    console.error('Error getting data:', error);
  }
};
// 异步函数，用于发送数据到后端
const sendDataToBackend = async (data: { tableData: any; pageTotal: any; }) => {
  try {
    // 发起HTTP POST请求到后端API，并等待响应
    const response = await fetch('https://localhost:8083/api/school-system/students/view/{id}', {
      method: 'POST', // 请求方法为POST
      headers: {
        'Content-Type': 'application/json' // 指定请求体格式为JSON
      },
      body: JSON.stringify(data) // 将数据转换为JSON字符串并放在请求体中
    });
    // 检查响应是否成功
    if (!response.ok) {
      throw new Error('Failed to send data to backend'); // 如果不成功，则抛出错误
    }
    // 解析后端返回的JSON响应
    const responseData = await response.json();
    // 输出后端返回的数据到控制台
    console.log('Response from backend:', responseData);
  } catch (error) {
    // 捕获并处理可能的错误
    console.error('Error sending data to backend:', error);
  }
};
// 调用getData函数，开始执行获取数据并发送到后端的流程
getData();*/


// 查询操作
/*const handleSearch = () => {
  const backendUrl = "https://localhost:8083/api/school-system/students/view/{id}";

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
  const data = await getMyData('http://115.29.41.122:9662/api/school-system/students', query)
  tableData.value=data.rows
  pageTotal.value=data.total
}
getStuData();
const exportXlsx = () =>{
  window.open('http://115.29.41.122:9662/api/school-system/export?token='+takeAccessToken())
}
const handleSearch = () => {
  search('/api/school-system/students',query,(data)=>{
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

const visible = ref(false);
let idx: number = -1;
const idEdit = ref(false);
const rowData = ref<TableItem>();
const handleEdit = (index: number, row: TableItem) => {
	idx = index;
	rowData.value = row;
	idEdit.value = true;
	visible.value = true;
};
const updateData = async (row: TableItem) => {

  /*idEdit.value ? (tableData.value[idx] = row) : tableData.value.unshift(row);
  console.log(tableData.value);*/
if(idEdit.value) {
  editData(`/api/school-system/students/edit/${row.id}`, {
    name: row.name,
    gender: row.gender,
    studentNumber: row.studentNumber,
    grade: row.grade,
    _class: row._class,
    classTeacher: row.classTeacher,
    classTeacherPhone: row.classTeacherPhone
  }, async () => {
   //ElMessage.success("修改成功")
    await getStuData()
  })
}else{
  editData(`/api/school-system/students/add`, {
    name: row.name,
    gender: row.gender,
    studentNumber: row.studentNumber,
    grade: row.grade,
    _class: row._class,
    classTeacher: row.classTeacher,
    classTeacherPhone: row.classTeacherPhone
  }, async () => {
    //ElMessage.success("修改成功")
    await getStuData()
  })
}
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

const list = [['序号', '姓名', '学号', '班级', '年龄', '性别']];
/*const exportXlsx = () => {
    tableData.value.map((item: any, i: number) => {
        const arr: any[] = [i + 1];
        arr.push(...[item.name, item.sno, item.class, item.age, item.sex]);
        list.push(arr);
    });
    let WorkSheet = XLSX.utils.aoa_to_sheet(list);
    let new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, WorkSheet, '第一页');
    XLSX.writeFile(new_workbook, `表格.xlsx`);
};*/
</script>

<style scoped>
h3{
	margin: 20px;
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



