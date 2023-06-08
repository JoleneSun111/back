<template>
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>

      <el-button class="ml-5" type="primary" @click="buttonload">搜索</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i></el-button>

      <el-popconfirm
          class="ml-5"
          confirm-button-text='确定'
          cancel-button-text='我再想想'
          icon="el-icon-info"
          icon-color="red"
          title="这是一段内容确定删除吗？"
          @confirm="delBatch"
      >
        <el-button type="danger" slot="reference"> 批量删除 <i class="el-icon-remove-outline"></i></el-button>
      </el-popconfirm>
      <el-upload action="http://localhost:9090/file/upload" :show-file-list="false" :on-success="handleExcelImportSuccess" style="display: inline-block">
        <el-button type="primary" class="ml-5">上传 <i class="el-icon-top"></i></el-button>
      </el-upload>
      <el-button type="warning" @click="reset" >重置 <i ></i></el-button>
    </div>

    <el-table :data="tableData" border stripe :header-cell-class-name="headerBg" @selection-change="handleSelectChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="文件名称"></el-table-column>
      <el-table-column prop="type" label="文件类型"></el-table-column>
      <el-table-column prop="size" label="文件大小(kb)"></el-table-column>
      <el-table-column label="下载">
        <template slot-scope="scope">
          <el-button type="primary" @click="download(scope.row.url)">下载</el-button>
        </template>
      </el-table-column>
      <el-table-column label="启用">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enable" active-color="#13ce66" inactive-color="#ccc" @change="changeEnable(scope.row)"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作"  width="200" align="center">
        <template slot-scope="scope">

          <template>
            <el-popconfirm
                class="ml-5"
                confirm-button-text='确定'
                cancel-button-text='我再想想'
                icon="el-icon-info"
                icon-color="red"
                title="这是一段内容确定删除吗？"
                @confirm="del(scope.row.id)"
            >
              <el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i></el-button>
            </el-popconfirm>
          </template>

        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[2,5,10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>


  </div>
</template>

<script>
export default {
  name: "File",
  data() {

    return {

      tableData: [],
      multiSelection: [],
      idslist:[],
      name:"",
      pageSize:2,
      pagenum:1,
      total:0,
      msg: "hello 青哥哥",
      collapseBtnClass: 'el-icon-s-fold',
      isCollapse: false,
      sideWidth: 200,
      logoTextShow: true,
      headerBg: 'headerBg',
      dialogFormVisible: false,
      formLabelWidth:""
    }
  },

  created() {

    this.load();
  },
  methods: {
    handleExcelImportSuccess(){
      this.load();
      this.$message.success("上传成功")
    },
    download(url){
      window.open(url)
    },
    collapse() {  // 点击收缩按钮触发
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {  // 收缩
        this.sideWidth = 64
        this.collapseBtnClass = 'el-icon-s-unfold'
        this.logoTextShow = false
      } else {   // 展开
        this.sideWidth = 200
        this.collapseBtnClass = 'el-icon-s-fold'
        this.logoTextShow = true
      }
    },

    load(){

      this.request.get("/file/page",{

        params:{
          currentPage: this.pagenum,
          pageSize: this.pageSize,
          name: this.name,
        }
      })
          .then(res=>{


                this.tableData =  res.data.records
                this.total = res.data.total
              }

          )

    },
    handleSizeChange(pagesize){

      this.pageSize =pagesize;
      this.load();
    },
    handleCurrentChange(pagenum){
      this.pagenum =pagenum;
      this.load();
    },
    buttonload(){

      this.pagenum=1;
      this.load();
    },

    reset(){
      this.username=""
      this.email=""
      this.address=""
      this.load()

    },
    handleAdd(){
      this.form = {}
      this.dialogFormVisible=true
    },

    changeEnable(row){
      this.request.post("file/update",row).then(res =>{
        if(res.code ==='200'){
          this.$message.success("操作成功")
        }
      })
    },
    del(id){
      this.request.delete("/file/"+id).then(
          res => {
            if(res.code === '200'){
              this.$message.success("删除成功")
              this.load()
              this.dialogFormVisible=false
            }else {
              this.$message.error("删除失败")
            }

          }
      )

    },
    //delete可以在请求体中传递数组   {data: ids}
    delBatch(){
      let ids = this.multiSelection.map(v => v.id)
      this.request.post("/file/delBatch", ids).then(
          res => {
            if(res.code === '200'){
              this.$message.success("批量删除成功")
              this.load()
              this.dialogFormVisible=false
            }else {
              this.$message.error("批量删除失败")
            }

          }
      )

    },
    handleSelectChange(val){
      this.multiSelection = val
    }
  }
}
</script>

<style scoped>
.headerBg {
  background: #eee!important;
}
</style>

