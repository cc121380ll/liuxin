<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="sidebar.collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-sub-menu :index="item.index" :key="item.index" v-permiss="item.permiss">
                        <template #title>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-sub-menu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                                v-permiss="item.permiss"
                            >
                                <template #title>{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-sub-menu>
                            <el-menu-item v-else :index="subItem.index" v-permiss="item.permiss">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-sub-menu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index" v-permiss="item.permiss">
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <template #title>{{ item.title }}</template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRoute} from 'vue-router';
import {watch,ref} from "vue";

interface MenuItem {
  icon: string;
  index: string;
  title: string;
  permiss: string;
  subs?: SubMenuItem[]; // 可选的 subs 属性
}

interface SubMenuItem {
  index: string;
  title: string;
  permiss: string;
  subs?: SubMenuItem[]; // 子菜单项也可以有子项
}
const items: MenuItem[] = [
  {
    icon: 'Odometer',
    index: '/dashboard',
    title: '系统首页',
    permiss: '1',
  },
  {
    icon: 'PieChart',
    index: '/charts',
    title: '系统首页',
    permiss: '12',
  },
  {
    icon: 'Calendar',
    index: '1',
    title: '学校',
    permiss: '11',
    subs: [
      {
        index: '/export',
        title: '学生管理',
        permiss: '8',
      },
      {
        index: '/import',
        title: '班主任管理',
        permiss: '9',
      },
      {
        index: '/donate',
        title: '选科管理',
        permiss: '5',
      }
    ]
  },

  {
    icon: 'DocumentCopy',
    index: '2',
    title: '班主任',
    permiss: '10',
    subs:[
      {
        index:'/table',
        title:'学生管理',
        permiss:'2',
      },
      {
        index:'/tabs',
        title:'选科管理',
        permiss:'4',
      },
    ],
  },
  {
    icon: 'PieChart',
    index: '/charts2',
    title: '学生选课统计',
    permiss: '13',
  },
];

const route = useRoute();
const onRoutes = computed(() => {
  return route.fullPath;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
