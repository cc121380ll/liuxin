<template>
  <div class="container">
    <button class="stu_view">按学生查看</button>
    <button class="statist_analysis">统计分析</button>

    <div class="basic_single">
      <div class="basic"></div>
      <div class="basic">
        <div class="basic_word">选科基础信息（人）</div>
        <div class="basic_message">
          <div>
            <span>4246</span><span>总人数</span>
          </div>
          <div>
            <span>3455</span><span>已选</span>
          </div>
          <div>
            <span>2123</span><span>未选</span>
          </div>
        </div>
        <!-- <schart class="basic_schart" canvasId="pie2" :options="options2" />  -->
        <div ref="basicChartRef2" style="width: 330px; height: 210px;"></div>
      </div>
      <div class="single"></div>
      <div class="single">
        <div class="single_word">单科统计</div>
        <!-- <schart class="single_schart" canvasId="bar" :options="options" />  -->
        <div ref="singleChartRef" style="width: 722px; height: 300px;"></div>
      </div>
    </div>




    <div>single</div>
    <el-table :data="singleClassTableData" :row-style="singleStyle" height="168"
      style="width: 1029px;margin-bottom: 50px;">
      <el-table-column prop="class" label="" width="147" />
      <el-table-column prop="physics" label="物理" width="147" />
      <el-table-column prop="history" label="历史" width="147" />
      <el-table-column prop="chemistry" label="化学" width="147" />
      <el-table-column prop="biology" label="生物" width="147" />
      <el-table-column prop="geography" label="地理" width="147" />
      <el-table-column prop="politics" label="政治" width="147" />
    </el-table>

    <div>combination1</div>
    <el-table :data="CombinationTableData1" :row-style="combinationStyle1" style="width: 1060px;margin-bottom: 50px;">
      <el-table-column fixed prop="combinationStyles" label="" width="212" />
      <el-table-column prop="sumNum" label="总人数" width="212" />
      <el-table-column prop="class1" label="一班" width="212" />
      <el-table-column prop="class2" label="二班" width="212" />
      <el-table-column prop="class3" label="三班" width="212" />
      <el-table-column prop="class4" label="四班" width="212" />
    </el-table>

    <div>combinaton2</div>
    <el-table :data="combinationData2" :row-style="combinationStyle2" height="320" style="width: 412px;">
      <el-table-column prop="combinationStyles" label="" width="206" />
      <el-table-column prop="sumNum" label="人数" width="206" />
    </el-table>

    <div>singleBar</div>
    <!-- <div ref="singleChartRef" style="width: 722px; height: 300px;"></div>  -->

    <div>basicChartRef</div>
    <div ref="basicChartRef" style="width: 750px; height: 363px;"></div>

    <div>basicChartRef2</div>
    <div ref="basicChartRef2" style="width: 330px; height: 210px;"></div>

  </div>


</template>


 <script lang="ts" setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';

// 创建对 DOM 元素的引用
const singleChartRef = ref(null);
const basicChartRef = ref(null);
const basicChartRef2 = ref(null);
// const singleClassTableData = ref([]);
// const CombinationTableData1 = ref([])

onMounted(() => {
  // 在 DOM 挂载后初始化 ECharts
  const chart1 = echarts.init(singleChartRef.value);
  const chart2 = echarts.init(basicChartRef.value);
  const chart3 = echarts.init(basicChartRef2.value);
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
      radius: '50%',
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

// // 发起GET请求获取学校的已选和未选科的人数的数据
// const getSubjectStatus = async () => {
//   try {
//     const response = await axios.get('https//localhost:8083/api/school-system/subject-status'); 
//     chart3.hideLoading(); // 数据加载完毕，隐藏加载动画
//     //根据后端数据更新图表chart3选项中的数据
//     chart3.setOption({
//       series: [{
//         data: response.data.product // 假设返回的数据结构中包含product字段
//       }]
//     });
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     // 处理错误，如显示错误信息
//   }
// };
// getSubjectStatus();

// //发起GET请求获取各科的选科情况的数据
// const getSubjectSingleClass = async () => {
//   try {
//     const response = await axios.get('https//localhost:8083/api/school-system/subject-single'); 
//     chart1.hideLoading(); // 数据加载完毕，隐藏加载动画
//     //根据后端数据更新图表chart1选项中的数据
//     chart1.setOption({
//       series: [{
//         data: response.data.product // 假设返回的数据结构中包含product字段
//       }]
//     });
//     //后台获取数据动态更新singleClass表格的数据
//     singleClassTableData.value = response.data;
//   } catch (error) {
//     console.error('Error fetching data:', error);// 处理错误，如显示错误信息
//   }
// };
// getSubjectSingleClass();

// // 发起GET请求获取选科组合的情况的数据
// const getSubjectCombinationClass = async () => {
//   try {
//     const response = await axios.get(''); // 替换为你的数据URL
//     chart2.hideLoading(); // 数据加载完毕，隐藏加载动画
//     //根据后端数据更新图表chart2选项中的数据
//     chart2.setOption({
//       series: [{
//         data: response.data.product // 假设返回的数据结构中包含product字段
//       }]
//     });
//     //后台获取数据动态更新CombinationTable1表格的数据
//     CombinationTableData1.value = response.data;
//   } catch (error) {
//     console.error('Error fetching data:', error);// 处理错误，如显示错误信息
//   }
// };
// getSubjectCombinationClass();



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


const singleClassTableData = [
  {
    class: '高一一班',
    physics: '45',
    history: '56',
    chemistry: '34',
    biology: '78',
    geography: '34',
    politics: '45'
  },
  {
    class: '高一二班',
    physics: '45',
    history: '56',
    chemistry: '34',
    biology: '78',
    geography: '34',
    politics: '45'
  },
  {
    class: '高一三班',
    physics: '45',
    history: '56',
    chemistry: '34',
    biology: '78',
    geography: '34',
    politics: '45'
  },
  {
    class: '高一四班',
    physics: '45',
    history: '56',
    chemistry: '34',
    biology: '78',
    geography: '34',
    politics: '45'
  },
  {
    class: '高一五班',
    physics: '45',
    history: '56',
    chemistry: '34',
    biology: '78',
    geography: '34',
    politics: '45'
  }
]

const CombinationTableData1 = [
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
]

const combinationData2 = [
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
]
</script> 

<style scoped>
.container {
	width: 1180px;
	height: 1249px;

	font-family: Roboto;
	color: rgba(16, 16, 16, 1);
	font-size: 14px;

	border-radius: 15px;
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

.basic_schart {
	width: 330px;
	height: 210px;

	margin-left: 62px;
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

.single_schart {
	width: 722px;
	height: 300px;
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

/* .combination_wrapper{
	width: 100%;
	height: 363px;

	text-align: center;
} */
.combination_schart {
	width: 554px;
	height: 363px;

	margin: auto;
}

table td,
th {
	font-size: 14px;
	font-family: Microsoft Yahei;
	font-weight: normal;
	line-height: 20px;
	text-align: left;
	border-radius: 4px;
}

.single_table {
	height: 168px;

	margin-top: 18px;
}

.single_table table {
	margin-left: 92px;

	border-collapse: collapse;
}

.single_table table tr:nth-child(even) td {
	background-color: #f2f2f2;
}

.single_table table td {
	width: 147px;
	height: 40px;
}

.combination_table table {
	margin-left: 65px;
	border-collapse: collapse;
}

.combination_table table tr:nth-child(even) td {
	background-color: #f2f2f2;
}

.combination_table td {
	width: 212px;
	height: 36px;
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