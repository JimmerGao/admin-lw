<template>
    <div id="login">
        <div class="con">
            <el-input v-model="userName" placeholder="请输入内容"></el-input>
            <el-input placeholder="请输入密码" v-model="password" show-password></el-input>  
            <el-button type="primary" @click="login">登录</el-button> 
        </div>   
    </div>
</template>

<script>
import { login } from "@/api/index"
export default {
    data() {
        return {
            userName: '',
            password: ''
        };
    },
    created() {

    },
    computed: {

    },
    mounted() {

    },
    methods: {
        login(){
            const _this = this;
            let params =  {
                userNameOrEmailAddress: _this.userName,
                password: _this.password,
                rememberMe: true
            }
            login(params).then(res =>{
                console.log(res)
                // _this.$commit("setToken",res.)
                _this.$router.push({path: "/index"})
            })
        }
    },
    watch: {

    },
};
</script>

<style lang='scss' scoped>
#login{
    .con {
        width: 300px;
        height: 300px;
        margin: 400px auto;
        .el-input{
            margin-bottom: 10px;
        }

    }
}
</style>
