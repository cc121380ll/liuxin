<template>
	<div class="header">
		<!-- 折叠按钮 -->
		<div class="collapse-btn" @click="collapseChage">
			<el-icon v-if="sidebar.collapse"><Expand /></el-icon>
			<el-icon v-else><Fold /></el-icon>
		</div>
		<div class="logo">新高考管理系统</div>
		<div class="header-right">
			<div class="header-user-con">
				<!-- 用户头像 -->
				<el-avatar class="user-avator" :size="30" :src="avatar" />
				<!-- 用户名下拉菜单 -->
				<el-dropdown class="user-name" trigger="click" @command="handleCommand">
					<span class="el-dropdown-link">
						{{ username }}
						<el-icon class="el-icon--right">
							<arrow-down />
						</el-icon>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="user">账号管理</el-dropdown-item>
							<el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
<!--        <el-popover trigger="click" @command="handleCommand">
          <template #reference>
            <div class="user-name">
              <span class="el-dropdown-link">{{ username }}</span>
              <el-icon class="el-icon&#45;&#45;right" style="font-size: 16px;cursor:pointer;">
                <arrow-down />
              </el-icon>
            </div>
          </template>
          <div style="display: flex;align-items: center;justify-content: center;flex-direction: column">
            <el-row>
              <el-avatar :size="50" :src="imgurl" />
            </el-row>
            <el-row :gutter="20">
              <el-col>
                登录地点
              </el-col>
              <el-col>
                {{currentCity}}
              </el-col>
            </el-row>
          </div>
        </el-popover>-->
			</div>
		</div>

	</div>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRouter } from 'vue-router';
import {get, logout} from '../net/index.js'
import {ArrowDown} from "@element-plus/icons-vue";

const username = JSON.parse(sessionStorage.getItem("access_token")||localStorage.getItem("access_token")).username

const sidebar = useSidebarStore();
const avatar = ref('');
// 侧边栏折叠
const collapseChage = () => {
	sidebar.handleCollapse();
};

onMounted(() => {
	if (document.body.clientWidth < 1500) {
		collapseChage();
	}
  get('/api/auth/load-avatar', (data)=>{
    avatar.value = data;
  })
});

const router = useRouter();
const handleCommand = (command: string) => {
	if (command == 'loginout') {
		logout(router.push('/login'))

	} else if (command == 'user') {
		router.push('/user');
	}
};
</script>
<style scoped>
.map{
  width: 100%;
  height: 300px;
}
.header {
	position: relative;
	box-sizing: border-box;
	width: 100%;
	height: 70px;
	font-size: 22px;
	color: #fff;
}
.collapse-btn {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	float: left;
	padding: 0 21px;
	cursor: pointer;
}
.header .logo {
	float: left;
	width: 250px;
	line-height: 70px;
}
.header-right {
	float: right;
	padding-right: 50px;
}
.header-user-con {
	display: flex;
	height: 70px;
	align-items: center;
}
.btn-fullscreen {
	transform: rotate(45deg);
	margin-right: 5px;
	font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
	position: relative;
	width: 30px;
	height: 30px;
	text-align: center;
	border-radius: 15px;
	cursor: pointer;
	display: flex;
	align-items: center;
}
.btn-bell-badge {
	position: absolute;
	right: 4px;
	top: 0px;
	width: 8px;
	height: 8px;
	border-radius: 4px;
	background: #f56c6c;
	color: #fff;
}
.btn-bell .el-icon-lx-notice {
	color: #fff;
}
.user-name {
	margin-left: 10px;
  display: flex;
  align-items: center;
}
.user-avator {
	margin-left: 20px;
}
.el-dropdown-link {
	color: #fff;
	cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;
}
.el-dropdown-menu__item {
	text-align: center;
}
</style>
