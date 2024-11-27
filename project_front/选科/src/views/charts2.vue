<template>
	<div class="container">
		<!-- <div class="btn"> -->

		<!-- </div class="basic_single"> -->
		<div class="basic_single">
			<!-- <div class="basic"></div> -->
			<div class="basic">
				<div class="basic_word">选科基础信息（人）</div>
				<div class="basic_message">
					<div>
						<span>{{ selected+notSelected }}</span><span>总人数</span>
					</div>
					<div>
						<span>{{ selected }}</span><span>已选</span>
					</div>
					<div>
						<span>{{ notSelected }}</span><span>未选</span>
					</div>
				</div>
				<div ref="basicChartRef2" style="width: 330px; height: 210px;"></div>
			</div>
			<!-- <div class="single"></div> -->
			<div class="single">
				<div class="single_word">单科统计</div>
				<div ref="singleChartRef" style="width: 722px; height: 300px;"></div>
			</div>
		</div>

		<!-- <div class="single_table"> -->
			<el-table :data="singleClassTableData" :row-style="singleStyle" height="168"
				style="width: 1029px;margin-left: 92px">
				<el-table-column prop="_class" label="" width="147" />
				<el-table-column prop="physics" label="物理" width="147" />
				<el-table-column prop="history" label="历史" width="147" />
				<el-table-column prop="chemistry" label="化学" width="147" />
				<el-table-column prop="creature" label="生物" width="147" />
				<el-table-column prop="geography" label="地理" width="147" />
				<el-table-column prop="politics" label="政治" width="147" />
			</el-table>
		<!-- </div> -->

		<!-- <div class="combination"></div> -->
		<div class="combination">
			<div class="combination_word">组合统计</div>
			<div class="combination_wrapper">
				<div ref="basicChartRef" style="width: 750px; height: 363px;"></div>
			</div>
		</div>

		<!-- <div class="combination_table"> -->
			<el-table :data="combinationTableData" :row-style="combinationStyle1"
				style="width: 1060px;margin-left: 65px;height: 200px">
				<el-table-column prop="name" label="" width="212" />
				<el-table-column prop="overall" label="总人数" width="212" />
        <el-table-column
            v-for="className in classNames"
            :key="className"
            :prop="className"
            :label="className"
            width="212"
        ></el-table-column>
			</el-table>
		<!-- </div> -->
	</div>
</template>

<!-- <script>
import Schart from 'vue-schart';
import axios from 'axios';
// import {ElTable} from 'element-plus';

export default {
	data() {
		return {
			subjectStatus:[],//已选科和未选科的人数
			subjectSingleClass:[],//每个班的选科情况
			options3: {
                        type: "pie",
                        title:{
                            text:'选课组合'
                        },
                        legend:{
                            position: "left",
                        },
                        labels: ['物理-化学-政治', '物理-化学-生物', '物理-化学-地理', '物理-政治-生物', '物理-政治-地理', '物理-生物-地理', '历史-生物-政治'],
                        datasets: [
                           {
                                data: [100, 140, 230, 100, 161,130,345],
                            }
                        ]
                    },
			options2: {
                        type: "pie",
						legend:{
							position: "left",
						},
						// bgColor: '#ffffff',
                        labels: ['未选','已选'],
                        datasets: [
                           {
                                data: [1999,2345],
                            }
                        ]
                    },
			options: {
                        type: "bar",
                        labels: ['物理', '历史', '化学', '生物', '政治', '地理'],
                        datasets: [
                           {
								label: ['科目'],
	                            fillColor: "#2593fc",
                                data: [100, 140, 230, 100, 161,130]
                            }
                        ]
                    }
		}
	},
	components: {
		Schart
	},
	mounted(){
		this.getSubjectStatus();//获取学校已选未选科的人数
		this.getSubjectSingleClass(); //获取每个班各科的选科情况
	},
	
	methods:{
		//调用接口获取学校的已选和未选科的人数
		async getSubjectStatus() {
			try{
				const res = await axios.get('https//localhost:8083/api/school-system/subject-status');
				console.log(res);
				this.objectStatus = res.value;
				//根据后端数据更新图表选项中的数据
				this.options2.datasets.data = res.value;
			}catch(error){
				console.error('获取数据出错：', error);
			}
		},
		//调用接口获取每个班级的每一科的选科情况
		async getSubjectSingleClass() {
			try{
				const res1 = await axios.get('https//localhost:8083/api/school-system/subject-single-class');
				console.log(res1);
				this.objectSingleClass = res1.value;
				//根据后端数据更新图表pie2选项中的数据
			}catch(error){
				console.error('获取数据出错：', error);
			}
		},
		//调用接口获取各科的选科情况
		async getSubjectSingle() {
			try{
				const res2 = await axios.get('https//localhost:8083/api/school-system/subject-single');
				console.log(res2);
				//根据后端数据更新图表bar选项中的数据
				this.options.datasets.data = res2.value;
			}catch(error){
				console.error('获取数据出错：', error);
			}
		},
	}
}
</script> -->


<script lang="ts" setup>

import {onMounted, ref} from 'vue';
import * as echarts from 'echarts';
import {async_get} from "../net/index.js";

// 创建对 DOM 元素的引用
const singleChartRef = ref(null);
const basicChartRef = ref(null);
const basicChartRef2 = ref(null);
const singleClassTableData = ref([]);
const combinationTableData = ref([]);
const classNames = ref([]);

const selected = ref(0);
const notSelected = ref(0);
onMounted(async () => {
	// 在 DOM 挂载后初始化 ECharts
	const chart1 = echarts.init(singleChartRef.value);
	const chart2 = echarts.init(basicChartRef.value);
	const chart3 = echarts.init(basicChartRef2.value);
	// 设置图表的配置项和数据
	const option1 = {
		xAxis: {
			type: 'category',
			data: ['物理', '历史', '化学', '生物', '政治', '地理']
		},
		yAxis: {
			type: 'value'
		},
		series: [
			{
				data: [120, 200, 150, 80, 70, 110, 130],
				type: 'bar'
			}
		]
	};

	const option2 = {
		title: {
			text: '选科组合',
			left: 'center'
		},
		legend: {
			orient: 'vertical',
			left: 'left'
		},
		series: [
			{
				name: 'Access From',
				type: 'pie',
				radius: '50%',
				data: [
					{ value: 1048, name: '物理-化学-政治' },
					{ value: 735, name: '物理-化学-生物' },
					{ value: 580, name: '物理-化学-地理' },
					{ value: 484, name: '物理-政治-生物' },
					{ value: 300, name: '物理-政治-地理' },
					{ value: 400, name: '物理-政治-地理' },
					{ value: 435, name: '历史-生物-政治' }
				],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	};

	const option3 = {
		// legend: {
		//   orient: 'vertical',
		//   left: 'left'
		// },
		series: [
			{
				name: 'Access From',
				type: 'pie',
				radius: '80%',
				data: [
					{ value: 1048, name: '已选' },
					{ value: 735, name: '未选' },
				],
				emphasis: {
					itemStyle: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	};
	// 使用配置项和数据初始化显示图表
	chart1.setOption(option1);
	chart2.setOption(option2);
	chart3.setOption(option3);

 //发起GET请求获取学校的已选和未选科的人数的数据
 const getSubjectStatus = async () => {
   try {
     const data = await async_get('/api/school-system/subject-status');
     selected.value = data[0].count;
     notSelected.value = data[1].count;
     chart3.hideLoading(); // 数据加载完毕，隐藏加载动画
     //根据后端数据更新图表chart3选项中的数据
     chart3.setOption({
       series: [
         {
           name: 'Access From',
           type: 'pie',
           radius: '80%',
           data: [
             { value: data[0].count, name: data[0].status == 1 ? '已选':'未选'},
             { value: data[1].count, name: data[1].status == 1 ? '已选':'未选'},
           ],
           emphasis: {
             itemStyle: {
               shadowBlur: 10,
               shadowOffsetX: 0,
               shadowColor: 'rgba(0, 0, 0, 0.5)'
             }
           }
         }
       ]
     });
   } catch (error) {
     console.error('Error fetching data:', error);
     // 处理错误，如显示错误信息
   }
 };
 await getSubjectStatus();

 //发起GET请求获取各科的选科情况的数据
 const getSubjectSingleClass = async () => {
   try {
     const data = await async_get('/api/school-system/subject-single');
     const keyMapping = {
       physics: '物理',
       history: '历史',
       chemistry: '化学',
       creature: '生物',
       geography: '地理',
       politics: '政治'
     };
     const keys = Object.keys(data).map(key => keyMapping[key]);
     console.log(keys)
     const values = Object.values(data).map(value => value === null ? 0 : value);
     chart1.hideLoading(); // 数据加载完毕，隐藏加载动画
     //根据后端数据更新图表chart1选项中的数据
     chart1.setOption({
       title: {
         text: '科目统计'
       },
       tooltip: {
         trigger: 'axis'
       },
       xAxis: {
         type: 'category',
         data: keys
       },
       yAxis: {
         type: 'value'
       },
       series: [{
         name: '数量',
         type: 'bar',
         data: values
       }]
     });
   } catch (error) {
     console.error('Error fetching data:', error);// 处理错误，如显示错误信息
   }
 };
 await getSubjectSingleClass();

 //获取表格数据
 const getSingleClassTable = async ()=>{
   try {
     const data = await async_get('/api/school-system/subject-single-class'); // 替换为你的数据URL
     console.log(data)
     singleClassTableData.value= data;
     console.log(singleClassTableData.value)
   } catch (error) {
     console.error('Error fetching data:', error);// 处理错误，如显示错误信息
   }
 };
 await getSingleClassTable();

 // 发起GET请求获取选科组合的情况的数据
 const getSubjectCombinationClass = async () => {
   try {
     const data = await async_get('/api/school-system/subject-all'); // 替换为你的数据URL
     const dealData = data.map(i=>({
       name:i.name,
       value:i.overall
     }))
     console.log(dealData)
     chart2.hideLoading(); // 数据加载完毕，隐藏加载动画
     //根据后端数据更新图表chart2选项中的数据
     chart2.setOption({
       series: [{
         data: dealData // 假设返回的数据结构中包含product字段
       }]
     });
     // 提取所有班级名称
     classNames.value = Array.from(new Set(data.flatMap(item => item.classNumber.map(cn => cn.split(':')[0]))));

     // 格式化数据
     combinationTableData.value = data.map(item => {
       const classNumbers = {};
       item.classNumber.forEach(cn => {
         const [className, count] = cn.split(':');
         classNumbers[className] = parseInt(count, 10);
       });
       return {
         name: item.name,
         overall: item.overall,
         ...classNumbers
       };
     });
   } catch (error) {
     console.error('Error fetching data:', error);// 处理错误，如显示错误信息
   }
 };
 await getSubjectCombinationClass();
});

//自定义表格的样式
const singleStyle = (arg1) => {
	return {
		fontSize: '14px',
		fontFamily: 'Microsoft Yahei',
		fontWeight: 'normal',
		lineHeight: '20px',
		textAlign: 'left',
		borderRadius: '4px',
	}
}
const combinationStyle1 = (arg2) => {
	return {
		fontSize: '14px',
		fontFamily: 'Microsoft Yahei',
		fontWeight: 'normal',
		lineHeight: '20px',
		textAlign: 'left',
		borderRadius: '4px',
		height: '36px'
	}
}

/*const singleClassTableData = [
	{
		_class: '高一一班',
		physics: '45',
		history: '56',
		chemistry: '34',
		biology: '78',
		geography: '34',
		politics: '45'
	},
	{
		_class: '高一二班',
		physics: '45',
		history: '56',
		chemistry: '34',
		biology: '78',
		geography: '34',
		politics: '45'
	},
	{
		_class: '高一三班',
		physics: '45',
		history: '56',
		chemistry: '34',
		biology: '78',
		geography: '34',
		politics: '45'
	},
	{
		_class: '高一四班',
		physics: '45',
		history: '56',
		chemistry: '34',
		biology: '78',
		geography: '34',
		politics: '45'
	},
	{
		_class: '高一五班',
		physics: '45',
		history: '56',
		chemistry: '34',
		biology: '78',
		geography: '34',
		politics: '45'
	}
]*/

/*const CombinationTableData1 = [
	{
		combinationStyles: '物化生',
		sumNum: '45',
		class1: '33',
		class2: '56',
		class3: '23',
		class4: '67',
	},
	{
		combinationStyles: '物化政',
		sumNum: '45',
		class1: '33',
		class2: '56',
		class3: '23',
		class4: '67',
	},
	{
		combinationStyles: '物化地',
		sumNum: '45',
		class1: '33',
		class2: '56',
		class3: '23',
		class4: '67',
	},
	{
		combinationStyles: '物生地',
		sumNum: '45',
		class1: '33',
		class2: '56',
		class3: '23',
		class4: '67',
	},
	{
		combinationStyles: '物生政',
		sumNum: '45',
		class1: '33',
		class2: '56',
		class3: '23',
		class4: '67',
	},
]*/

</script>

<style scoped>
.container {
	/*width: 1180px;
	height: 1249px;*/
  width: 95%;
	font-family: Roboto;
	color: rgba(16, 16, 16, 1);
	font-size: 14px;

	border-radius: 4px;
	background-color: rgba(255, 255, 255, 1);
}

button {
	width: 94px;
	height: 30px;

	margin-top: 65px;

	border-radius: 4px;
	border: 1px solid #3952FD;

	text-align: center;
	line-height: 20px;
	font-size: 14px;
	font-family: Roboto;
}

.stu_view {
	margin-left: 18px;

	color: #3952FD;
	background-color: #FFFFFF;
}

.statist_analysis {
	margin-left: 27px;

	color: #FFFFFF;
	background-color: #3952FD;
}

.basic {
	width: 399px;
	height: 332px;

	margin-left: 2px;
	margin-top: 19px;

	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: left;
}

.basic_word {
	font-size: 17px;

	padding-left: 17px;

	position: relative;
}

.basic_word::before {
	left: 5px;
	top: -5px;
	position: absolute;

	content: "";
	border-left: 3px solid #fcca00;
	height: 30px;
}

.basic_message {
	margin-top: 20px;
	margin-bottom: 8px;

	display: flex;
	justify-content: space-around;
	align-items: center;
}

.basic_message div {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.basic .basic_message span {
	margin: 2px;
	font-size: 20px;
}

.single {
	width: 722px;
	height: 340px;

	margin-left: 23px;
	margin-top: 24px;

	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: left;
}

.single_word {
	width: 129px;
	height: 25px;

	margin-left: 27px;

	font-size: 14px;
	text-align: center;
	line-height: 20px;
	color: #101010;

	border-left: 4px solid blue;
}

.basic_single {
	display: flex;
}


.schart-box {
	display: inline-block;
	margin: 20px;
}

.combination {
	height: 390px;
	margin-top: 20px;

	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: left;
}

.combination_word {
	width: 129px;
	height: 25px;

	margin-left: 37px;
	align-items: left;

	font-size: 14px;
	text-align: center;
	line-height: 20px;
	color: #101010;

	border-left: 4px solid blue;
}

.combination_wrapper{
	width: 100%;
	height: 363px;

	display: flex;
	align-items: center;
	justify-content: center;
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