<template>
<div>
  <div style="margin: 10px 0">
    <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="username"></el-input>
    <el-input style="width: 200px" placeholder="请输入邮箱" suffix-icon="el-icon-message" class="ml-5" v-model="email"></el-input>
    <el-input style="width: 200px" placeholder="请输入地址" suffix-icon="el-icon-position" class="ml-5" v-model="address"></el-input>
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
    <el-upload action="http://localhost:9090/user/import" :show-file-list="false" accept="xlsx" :on-success="handleExcelImportSuccess" style="display: inline-block">
      <el-button type="primary" class="ml-5">导入 <i class="el-icon-bottom"></i></el-button>
    </el-upload>

    <el-button type="primary" @click="exp" class="ml-5">导出 <i class="el-icon-top"></i></el-button>
    <el-button type="warning" @click="reset" >重置 <i class="el-icon-top"></i></el-button>
  </div>

  <el-table :data="tableData" border stripe :header-cell-class-name="headerBg" @selection-change="handleSelectChange">
    <el-table-column type="selection" width="40"></el-table-column>
    <el-table-column prop="id" label="ID" width="50"></el-table-column>
    <el-table-column prop="username" label="用户名" width="120"></el-table-column>
    <el-table-column prop="role" label="角色"></el-table-column>
    <el-table-column prop="nickname" label="昵称" width="120"></el-table-column>
    <el-table-column prop="email" label="邮箱"></el-table-column>
    <el-table-column prop="phone" label="电话"></el-table-column>
    <el-table-column prop="address" label="地址"></el-table-column>

    <el-table-column label="操作"  width="240" align="center">
      <template slot-scope="scope">
        <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
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

  <el-dialog title="收货地址" :visible.sync="dialogFormVisible" >
    <el-form :model="form">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="地址" :label-width="formLabelWidth">
        <el-input v-model="form.address" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="图标">
        <el-select clearable v-model="form.role" placeholder="请选择" style="width: 100%">
          <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.flag">
            <i :class="item.value" /> {{ item.name }}
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>

</div>
</template>

<script>
export default {
  name: "User",
  data() {

    return {
      form:{},
      tableData: [],
      multiSelection: [],
      idslist:[],
      username:"",
      email:"",
      address:"",
      role:"",
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
      formLabelWidth:"",
      options:[]
    }
  },

  created() {

    this.load();
  },
  methods: {
    handleExcelImportSuccess(){
      this.load();
      this.$message.success("导入成功")
    },
    exp() {
      window.open("http://localhost:9090/user/export")
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

      this.request.get("/user/page",{
        params:{
          currentPage: this.pagenum,
          pageSize: this.pageSize,
          username: this.username,
          email: this.email,
          address: this.address,
          role: this.role

        }
      })
          .then(res=>{
                this.tableData =  res.records
                this.total = res.total
            // 请求图标的数据
            this.request.get("/role").then(res => {
              this.options = res.data
            })
              }

          )
      /*fetch("http://localhost:9090/user/page?currentPage="+this.pagenum+"&pageSize="+this.pageSize+"&username="+this.username)
          .then(
              res => res.json())
          .then(res => {
            console.log(res)
                console.log(res.data)
           this.tableData =  res.data
          this.total = res.total
          })*/
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
    handleEdit(row){

      // this.form = JSON.parse(JSON.stringify(row))  可以解决编辑未确认就改变的问题
      this.form = Object.assign({},row) // 将row拷贝到空对象中 解决没点确定数据改变的问题
      this.dialogFormVisible=true
    },
    save(){
      this.request.post("/user/",this.form).then(
          res => {
            if(res){
              this.$message.success("保存成功")
              this.load()
              this.dialogFormVisible=false
            }else {
              this.$message.error("保存失败")
            }

          }
      )
    },
    del(id){
      this.request.delete("/user/"+id).then(
          res => {
            if(res){
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
      this.request.post("/user/delBatch", ids).then(
          res => {
            if(res){
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
  background: #eee !important;
}
</style>
