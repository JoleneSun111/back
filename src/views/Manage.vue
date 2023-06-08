<template>
  <el-container style="min-height: 100vh;border: 1px green solid">

    <el-aside :width="sideWidth + 'px'" style="box-shadow: 2px 0 6px rgb(0 21 41 / 35%);">
      <Aside :isCollapse="isCollapse" :logoTextShow="logoTextShow"></Aside>
    </el-aside>

    <el-container>
      <el-header style="font-size: 12px; border-bottom: 1px solid #ccc; line-height: 60px; display: flex">
        <Header :collapseBtnClass="collapseBtnClass" :collapse="collapse" :user="user"></Header>

      </el-header>

      <el-main>
        <router-view @refreshUser="getUser"/>
      </el-main>

    </el-container>
  </el-container>
</template>

<script>
import Aside from "@/components/Aside";
import Header from "@/components/Header";
import request from "@/utils/request";

export default {
  name: 'Manage',
  components: {
    Aside,
    Header

  },
  data() {

    return {
      user: {},
      collapseBtnClass: 'el-icon-s-fold',
      isCollapse: false,
      sideWidth: 200,
      logoTextShow: true,
      headerBg: 'headerBg'
    }
  },

  created() {
    this.getUser()
    /*this.load();*/
  },
  methods: {
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
    getUser() {
      let username = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username : ""
      //从后台获取User数据
      if (username) {
        this.request.get("/user/username/" + username).then(res => {

          this.user = res.data

        })

      }
    },
  }
}
</script>

<style>
.headerBg {
  background: #eee !important;
}
</style>
