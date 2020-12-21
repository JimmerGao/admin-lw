<template>
  <div id="navLeft">
    <!-- <el-row> -->
      <el-menu
        :default-active="activeTab"
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
      >
        <el-menu-item index="1" route="/index">
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="2" route="/add">
          <span slot="title">新增</span>
        </el-menu-item>
        
      </el-menu>
    <!-- </el-row> -->
  </div>
</template>

<script>
export default {
    name:"navLeft",
    props:{
      activeTab: {
        default:  '1'
      }
    },
  data() {
    return {};
  },
  created() {},
  computed: {},
  mounted() {},
  methods: {},
  watch: {},
};
</script>

<style lang='scss' scoped>
#navLeft{
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1000001;
  width: 210px!important;

  ul{
    height: 100%;
  }
  
}
</style>
