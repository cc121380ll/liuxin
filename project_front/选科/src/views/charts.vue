<template>
	<div class="container">
		<div class="basic">
			<h2 class="basic_word">选科基础信息（人）</h2>
			<span>总人数：4246</span>
			<span>已选：2123</span>
			<span>未选：2123</span>
		</div>
		<div class="single">
			<h2 class="single_word">单科统计</h2>
			<schart class="schart" canvasId="bar" :options="options1"></schart>
		</div>
		<div class="combination">
			<h2 class="combination_word">组合统计</h2>
			<schart class="schart" canvasId="pie" :options="options3"></schart>
		</div>
		<!-- <div class="schart-box">
			<div class="content-title">折线图</div>
			<schart class="schart" canvasId="line" :options="options2"></schart>
		</div> -->
		<!-- <div class="schart-box">
			<div class="content-title">饼状图</div>
			<schart class="schart" canvasId="pie" :options="options3"></schart>
		</div> -->
		<div class="schart-box">
			<div class="content-title">环形图</div>
			<schart class="schart" canvasId="ring" :options="options4"></schart>
		</div>
	</div>
</template>

<script setup lang="ts" name="basecharts">
import Schart from 'vue-schart';

const options1 = {
	type: 'bar',
	bgColor: '#ffffff',
	labels: ['物理', '历史', '化学', '生物', '政治','地理'],
	datasets: [
		{
			label: '物理',
			fillColor: '#2593fc',
			data: [100]
		},
		{
			label: '历史',
			fillColor: '#2593fc',
			data: [0, 140,]
		},
		{
			label: '化学',
			fillColor: '#2593fc',
			data: [0, 0, 230, 0, 0,0]
		},
		{
			label:'生物',
			fillColor: '#2593fc',
			data:[0,0,0,100,0,0]
		},
		{
			label:'政治',
			fillColor: '#2593fc',
			data:[0,0,0,0,161,0]
		},
		{
			label:'地理',
			fillColor: '#2593fc',
			data:[0,0,0,0,0,130]
		},
	]
};
const options2 = {
	type: 'line',
	title: {
		text: '最近几个月各品类销售趋势图'
	},
	bgColor: '#fbfbfb',
	labels: ['6月', '7月', '8月', '9月', '10月'],
	datasets: [
		{
			label: '家电',
			data: [234, 278, 270, 190, 230]
		},
		{
			label: '百货',
			data: [164, 178, 150, 135, 160]
		},
		{
			label: '食品',
			data: [114, 138, 200, 235, 190]
		}
	]
};
const options3 = {
	type: 'pie',
	title: {
	},
	legend: {
		position: 'left'
	},
	bgColor: '#ffffff',
	labels: ['物理-化学-政治', '物理-化学-生物', '物理-化学-地理', '物理-政治-生物', '物理-政治-地理', '物理-生物-地理', '历史-生物-政治'],
	datasets: [
		{
			data: [334, 278, 190, 235, 260, 200, 141]
		}
	]
};
const options4 = {
	type: 'ring',
	title: {
		text: '环形三等分'
	},
	showValue: false,
	legend: {
		position: 'bottom',
		bottom: 40
	},
	bgColor: '#fbfbfb',
	labels: ['vue', 'react', 'angular'],
	datasets: [
		{
			data: [500, 500, 500]
		}
	]
};
</script>

<style scoped>
.basic{
	margin-left: 20px;
}
.basic_word{
	border-left: 3px solid orange;
	padding: 30px;
}
span{
	margin: 15px;
	font-size: 20px;
}
.single{
	margin: 20px;
}
.single_word{
	border-left: 3px solid blue;
	padding: 30px;
}
.schart-box {
	display: inline-block;
	margin: 20px;
}
.combination{
	margin: 20px;
}
.combination_word{
	border-left: 3px solid red;
	padding: 30px;
}
.schart {
	width: 650px;
	height: 500px;
	margin: auto;
}
.content-title {
	clear: both;
	font-weight: 400;
	line-height: 50px;
	margin: 10px 0;
	font-size: 22px;
	color: #1f2f3d;
}
</style>
