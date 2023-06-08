<template>
<div>
  <div style="margin: 10px 0">
    <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="username"></el-input>
    <el-input style="width: 200px" placeholder="请输入描述" suffix-icon="el-icon-message" class="ml-5" v-model="description"></el-input>
    <el-input style="width: 200px" placeholder="请输入flag" suffix-icon="el-icon-position" class="ml-5" v-model="flag"></el-input>
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
 <el-button type="warning" @click="reset" >重置 <i class="el-icon-top"></i></el-button>
  </div>

  <el-table :data="tableData" border stripe :header-cell-class-name="headerBg" @selection-change="handleSelectChange">
    <el-table-column type="selection" width="55"></el-table-column>
    <el-table-column prop="id" label="ID" width="80"></el-table-column>
    <el-table-column prop="name" label="用户名" width="140"></el-table-column>
    <el-table-column prop="description" label="描述" width="120"></el-table-column>
    <el-table-column prop="flag" label="标志"></el-table-column>


    <el-table-column label="操作"  width="200" align="center">
      <template slot-scope="scope">
        <el-button type="info" slot="reference" @click="selectMenu(scope.row)">权限分配<i class="el-icon-menu"></i></el-button>
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

  <el-dialog title="角色信息" :visible.sync="dialogFormVisible" >
    <el-form :model="form">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input v-model="form.description" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="标识" :label-width="formLabelWidth">
        <el-input v-model="form.flag" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>

  <el-dialog title="权限分配" :visible.sync="menuDialogVis" >

    <el-tree :data="menuData" :props="props"
             show-checkbox
             node-key="id"
             ref="tree"
             :default-expanded-keys="expends"
             :default-checked-keys="checks">
         <span class="custom-tree-node" slot-scope="{ node, data }">
            <span><i :class="data.icon"></i> {{ data.name }}</span>
         </span>
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="menuDialogVis = false">取 消</el-button>
      <el-button type="primary" @click="saveRoleMenu">确 定</el-button>
    </div>
  </el-dialog>

</div>
</template>

<script>
export default {
  name: "Role",
  data() {

    return {
      props:{},
      expends:[],
      checks:[],
      form:{},
      tableData: [],
      menuData:[],
      multiSelection: [],
      idslist:[],
      username:"",
      description:"",
      flag:"",
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
      menuDialogVis:false,
      formLabelWidth:"",
      roleId:0,
      roleFlag:""
    }
  },

  created() {

    this.load();
  },
  methods: {
    async selectMenu(row){
      //把本行数据的老师id和角色flag保存
      this.roleId=row.id
      this.roleFlag = row.flag

      //查所有menu, 显示在弹窗里
      this.request.get("/menu").then(res =>{
        this.menuData=res.data
        //根据从后台获得的menu的ids,设置展开节点expends
        this.expends = this.menuData.map(v => v.id)
      })
      //从后台获取此行数据的menuid的list(老师这个角色拥有的默认menu)
      this.request.get("/role/roleMenu/"+ this.roleId).then(res=>{
          //返回的是老师角色可以进入的menu权限, 需要赋值给check 形成默认选中
          this.checks=res.data
      })
      //弹窗
      this.menuDialogVis=true
    },
    saveRoleMenu(){
      //把roleid和被选中的menuid传到后台, 给roleMenu表新增
      console.log(this.roleId)
      console.log(this.$refs.tree.getCheckedKeys())
      this.request.post("/role/roleMenu/"+this.roleId,this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())).then(res=>{
        console.log(res.data)
        if(res.code==='200'){
          this.$message.success("绑定成功")
          this.menuDialogVis = false

          // 操作管理员角色后需要重新登录
          if (this.roleFlag === 'ROLE_ADMIN') {
            this.$store.commit("logout")
          }
        }else{
          this.$message.error("绑定失败")
        }

      })

     //后台先删除旧数据,再添加新数据
    },
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

      this.request.get("/role/page",{
        params:{
          currentPage: this.pagenum,
          pageSize: this.pageSize,
          name: this.username,
          description: this.description,
          flag: this.flag,

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
          this.description=""
          this.flag=""
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
      this.request.post("/role/",this.form).then(
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
      this.request.delete("/role/"+id).then(
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
      this.request.post("/role/delBatch", ids).then(
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
  background: #eee!important;
}
</style>
