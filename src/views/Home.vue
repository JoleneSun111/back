<template>
  <div>
    <el-row :gutter="20" :span="10" style="margin-bottom: 40px" >
      <el-col :span="6" >
    <el-card >
      <div style="color: #409EFF">用户总数</div>
      <div style="padding: 10px 0; text-align: center; font-weight: bold;">100</div>
    </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div style="color: #409EFF">用户总数</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold;">100</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div style="color: #409EFF">用户总数</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold;">100</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div style="color: #409EFF">用户总数</div>
          <div style="padding: 10px 0; text-align: center; font-weight: bold;">100</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row >
      <el-col :span="12">
        <div id="main" style="width: 500px; height: 400px"></div>
      </el-col>

      <el-col :span="12">
        <div id="pie" style="width: 500px; height: 400px"></div>
      </el-col>
    </el-row>
  </div>

</template>

<script>
import * as echarts from 'echarts';
export default {
  name: "Home",
  data(){
    return {
      num:0,
      total:0,
      pageNum:1,
      pageSize:10
    }
  },
  methods:{
    load(){
      this.request.get("/file/page",{
        params:{
          currentPage: this.pageNum,
          pageSize: this.pageSize,
        },
      }).then(res =>{
        this.total = res.data.total
      })
    }
  },
  created(){
    this.load()
  },
  mounted() {
    this.load()
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option = {
      title: {
        text: '各季度会员数量统计',
        subtext: '趋势图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      xAxis: {
        type: 'category',
        data: ["第一季度", "第二季度", "第三季度", "第四季度"]
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name:"123",
          data: [],
          type: 'bar'
        },
        {
          name:"456",
          data: [],
          type: 'line'
        },
        {
          name:"456",
          data: [],
          type: 'bar'
        }
      ]
    };
    this.request.get("/echarts/members").then(res => {
      // 填空
      // option.xAxis.data = res.data.x
      option.series[0].data = res.data
      option.series[1].data = res.data
      option.series[2].data = [5,6,7,8]

      // 数据准备完毕之后再set
      this.num = res.data[0] + res.data[1] + res.data[2] + res.data[3]

      myChart.setOption(option);

    })
    var pieoption = {
      title: {
        text: 'Referer of a Website',
        subtext: 'Fake Data',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
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
          label: {
            //echarts饼图内部显示百分比设置
            show: true,
            position: "inside", //outside 外部显示  inside 内部显示
            formatter: `{d}%`,
            color: "#ffffff", //颜色
            fontSize: 12 //字体大小
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
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
    var piechartDom = document.getElementById('pie');
    var mypieChart = echarts.init(piechartDom);

    this.request.get("/echarts/members").then(res => {
      // 填空
      // option.xAxis.data = res.data.x
      pieoption.series[0].data = [
        {name: "第一季度", value: res.data[0]},
        {name: "第二季度", value: res.data[1]},
        {name: "第三季度", value: res.data[2]},
        {name: "第四季度", value: res.data[3]},
      ]
      // 数据准备完毕之后再set
      pieoption &&  mypieChart.setOption(pieoption);

    })
  }
}
</script>

<style scoped>

</style>
