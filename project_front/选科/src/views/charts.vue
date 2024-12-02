<template>
	<div class="container">
		<!-- <div class="btn"> -->
		<!-- <div class="single"></div> -->
		<div class="single">
			<div class="single_word">单科统计</div>
			<div ref="singleChartRef" style="width: 1099px; height: 300px;"></div>
		</div>
		<!-- <div class="combination"></div> -->
		<div class="combination_word">组合统计</div>
		<div class="combination">
			<div ref="basicChartRef" style="width: 580px; height: auto; margin-left: 101px"></div>
			<el-table :data="combinationData" :row-style="combinationStyle2" height="700" style="width: 412px; margin-left: 58px">
				<el-table-column prop="name" label="" width="206" />
				<el-table-column prop="count" label="人数" width="206" />
			</el-table>
		</div>
	</div>
</template>

<!-- <script>
import Schart from 'vue-schart';
import {ref} from 'vue';
import axios from 'axios';

export default {


 	const dataList = ref([]);

 	async function fetchData() {
 	try {
 		const response = await axios.get('https://example.com/api/school-system/subject-all');
 		dataList.value = response.data;
 	} catch (error) {
 		console.error('获取数据出错：', error);
 	}
 }

// fetchData();

data() {
		return {
			sumSubjects:[],//每个班的选科情况
			options2: {
				type: "pie",
				bgColor: '#ffffff',
				labels: ['物化生', '历化生', '物生政', '历化地'],
				datasets: [
					{
						data: [34, 23, 10, 4]
					}
				]
			},
			options: {
				type: "bar",
				bgColor: "#ffffff",
				labels: ['物理', '历史', '化学', '生物', '政治', '地理'],
				datasets: [
					{
						label: ['科目'],
						fillColor: "#2593fc",
						data: [100, 140, 230, 100, 161, 130]
					}
				]
			},
			//调用接口获取各科的选科情况
			async getSubjectSingle() {
				try {
					const res1 = await axios.get('https//localhost:8083/api/school-system/subject-single');
					console.log(res1);
					//根据后端数据更新图表bar选项中的数据
					this.options.datasets.data = res1.value;
				} catch (error) {
					console.error('获取数据出错：', error);
				}
			},
			async getSubjectSingle() {
				try {
					const res2 = await axios.get('https//localhost:8083/api/school-system/subject-all');
					console.log(res2);
					//根据后端数据更新图表bar选项中的数据
					this.sumSubjects = res2.value;
				} catch (error) {
					console.error('获取数据出错：', error);
				}
			},
		}
	},
	components: {
		Schart
	}
}
</script> -->

<script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
import {async_get} from "../net/index.js";

// 创建对 DOM 元素的引用
const singleChartRef = ref(null);
const basicChartRef = ref(null);
const combinationData = ref([]);

onMounted(async () => {
  // 在 DOM 挂载后初始化 ECharts
  const chart1 = echarts.init(singleChartRef.value);
  const chart2 = echarts.init(basicChartRef.value);
  // 设置图表的配置项和数据
  const  option1 = {
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
  legend: {
    y: 'top',
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: '45%',
      avoidLabelOverlap: true,
      data: [
        { value: 345, name: '物化生' },
        { value: 335, name: '历化生' },
        { value: 580, name: '物生政' },
        { value: 184, name: '历化地' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      label:{

      }
    }
  ]
};

 // 使用配置项和数据初始化显示图表
  chart1.setOption(option1);
  chart2.setOption(option2);


 //发起GET请求获取各科的选科情况的数据
 const getSubjectSingleClass = async () => {
   await async_get({
     url: '/api/teacher-system/subject-single',
     success: (data) => {
       const keyMapping = {
         physics: '物理',
         history: '历史',
         chemistry: '化学',
         creature: '生物',
         geography: '地理',
         politics: '政治'
       };
       if(!data) return;
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
     }
   });
 };
  await getSubjectSingleClass();
 // 发起GET请求获取选科组合的情况的数据
 const getSubjectCombinationClass = async () => {
   await async_get({
     url: '/api/teacher-system/subject-all',
     success: (data) => {
       const dealData = data.map(i => ({
         name: i.name,
         value: i.count
       }));
       chart2.hideLoading(); // 数据加载完毕，隐藏加载动画
       //根据后端数据更新图表chart2选项中的数据
       chart2.setOption({
         series: [{
           data: dealData // 假设返回的数据结构中包含product字段
         }]
       });
       //后台获取数据动态更新CombinationTable2表格的数据
       combinationData.value = data;
     } // 替换为你的数据URL
   });
 }
 await getSubjectCombinationClass();

});

//自定义表格的样式
const combinationStyle2 = (arg3) => {
  return {
    fontSize: '14px',
    fontFamily: 'Microsoft Yahei',
    fontWeight: 'normal',
    lineHeight: '20px',
    textAlign: 'left',
    borderRadius: '4px',
  }
}
//表格初始化所用数据
/*const combinationData = [
  {
    combinationStyles: '物化生',
    sumNum: '50'
  },
  {
    combinationStyles: '物化政',
    sumNum: '12'
  },
  {
    combinationStyles: '物化地',
    sumNum: '6'
  },
  {
    combinationStyles: '物生地',
    sumNum: '10'
  },
  {
    combinationStyles: '物生政',
    sumNum: '6'
  },
  {
    combinationStyles: '物地政',
    sumNum: '14'
  },
  {
    combinationStyles: '历化生',
    sumNum: '30'
  },
]*/
</script> 

<style scoped>
.container {
	/*width: 1180px;
	height: 1249px;*/
  width:95%;
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

.single {
	/* width: 722px; */
	height: 339px;

	margin-left: 37px;
	margin-top: 21px;

	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: left;
}

.single_word {
	width: 129px;
	height: 25px;

	font-size: 14px;
	text-align: center;
	line-height: 20px;
	color: #101010;

	border-left: 4px solid blue;
}

.combination {
	height: 700px;
	margin-top: 15px;
	display: flex;
}

.combination_word {
	width: 129px;
	height: 25px;

	margin-left: 37px;
	margin-top: 198px;

	align-items: left;

	font-size: 14px;
	text-align: center;
	line-height: 20px;
	color: #101010;

	border-left: 4px solid blue;
}

</style>
