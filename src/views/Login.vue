<template>

  <div class="wrapper">
    <div style="margin: 200px auto; background-color: #fff; width: 350px; height: 300px; padding: 20px; border-radius: 10px">
      <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>登 录</b></div>
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item prop="username">
        <el-input v-model="user.username" size="medium" style="margin: 10px 0" prefix-icon="el-icon-user" ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="user.password" size="medium" style="margin: 10px 0" prefix-icon="el-icon-lock" show-password ></el-input>
        </el-form-item>
        <el-form-item style="margin: 10px 0; text-align: right">
          <el-button @click="login" type="primary" size="small"  autocomplete="off">
            登录
          </el-button>
          <el-button type="warning" size="small"  autocomplete="off">
            注册
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
import {setRoutes} from "@/router";

export default {
  name: "Login",
  data(){
    return {
      user:{},
      rules:{
        username : [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password :[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },


      }
    },
  methods:{
    login(){
      this.$refs['userForm'].validate( (valid) =>{
            if(valid){

              this.request.post("/user/userlogin",this.user).then(res=>{

               console.log(res.data)
                if(res.code==='200'){

                  localStorage.setItem("user",JSON.stringify(res.data))
                  localStorage.setItem("menus",JSON.stringify(res.data.roleMenus))

                  console.log(localStorage.getItem('menus'))
                  setRoutes()


                  /*if (res.data.role === 'ROLE_STUDENT') {
                    this.$router.push("/home")
                  } else {
                    this.$router.push("/")
                  }*/
                }else{
                  this.$message.error(res.msg)
                }

              })
            }else{
              return false;
            }

          }
      )

    }
  }
}
</script>

<style >
.wrapper {
  height: 100vh;
  background-image: linear-gradient(to bottom right, #FC466B , #3F5EFB);
  overflow: hidden;
}
</style>
