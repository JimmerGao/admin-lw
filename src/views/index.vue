<template>
  <div id="index">
    <navLeft activeTab="1"></navLeft>
    <div class="navRight">
      <div class="top">
        <div class="top-cell">
          订单号：<el-input
            v-model="orderNo"
            placeholder="请输入订单号"
          ></el-input>
        </div>
        <div class="top-cell">
          名称：<el-input
            v-model="name"
            placeholder="请输入名称"
          ></el-input>
        </div>
        <div class="top-cell">
          手机号：<el-input
            v-model="phone"
            placeholder="请输入手机号"
          ></el-input>
        </div>
        <div class="top-cell">
          快递类型：<el-input
            v-model="expressType"
            placeholder="请输入快递类型"
          ></el-input>
        </div>
        <div class="top-cell">
          物流单号：<el-input
            v-model="trackingNo"
            placeholder="请输入物流单号"
          ></el-input>
        </div>
        <div class="top-cell cell-date">
          <span class="demonstration">订单日期：</span>
           <el-date-picker
            v-model="dataRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            >
          </el-date-picker>
        </div>
        <div class="top-cell cell-button">
          <el-button type="primary" @click="searchOrder">查询</el-button>
        </div>
      </div>
      <div class="con">
        <el-table
          v-loading="loading"
          :data="list"
          style="width: 100%"
        > 
          <el-table-column
            label="序号"
            type="index"
            align="center"
          >
              <template slot-scope="scope">
                  <span>{{skipCount + scope.$index + 1}}</span>
              </template>
          </el-table-column>
          <el-table-column prop="orderNo" label="订单号" width="110">
          </el-table-column>
          <el-table-column prop="name" label="名称" width="100">
          </el-table-column>
          <el-table-column prop="phone" label="手机" width="130"> </el-table-column>
          <el-table-column prop="expressType" style="cursor: pointer;" width="100" label="快递类型"> </el-table-column>
          <el-table-column
            label="物流单号"
            width="180">
              <template slot-scope="scope">
                <div style="cursor: pointer;" @click="showExpressDetail(scope.row)">{{scope.row.trackingNo}}</div>
              </template>
          </el-table-column>
          <el-table-column prop="address" label="地址"> </el-table-column>
          <el-table-column prop="remarks" label="备注"> </el-table-column>
          <el-table-column prop="creationTime" width="160" label="订单日期"></el-table-column>
          <el-table-column
          label="操作"
          width="100">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" size="small">修改</el-button>
              <el-button @click="handleDelete(scope.$index,scope.row)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 弹出框 -->
        <el-drawer
          title="修改"
          :visible.sync="dialog"
          direction="rtl"
          ref="drawer"
          >
          <div class="demo-drawer__content">
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
            >
              <el-form-item label="订单号">
                <el-input v-model="ruleForm.orderNo"></el-input>
              </el-form-item>
              <el-form-item label="名称" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="ruleForm.phone"></el-input>
              </el-form-item>
              <el-form-item label="快递类型" prop="phone">
                <el-input v-model="ruleForm.phone"></el-input>
              </el-form-item>
              <el-form-item label="物流单号">
                <el-input v-model="ruleForm.expressType"></el-input>
              </el-form-item>
              <el-form-item label="地址">
                <el-input v-model="ruleForm.address"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="ruleForm.remarks" type="textarea" :rows="3"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading"
                  >{{ loading ? '提交中 ...' : '确 定' }}</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </el-drawer>
      </div>

      <div class="bottom">
        <el-pagination
          hide-on-single-page
          layout="prev, pager, next"
          :total="totalCount"
          :page-size="20"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>

      <el-dialog
        title="包裹物流信息展示"
        :visible.sync="expressDialogVisible"
        width="30%"
        center
        class="expressDetail"
        >
          <div class="expressDetail-name">
            <div>包裹来源：{{expressDetailFrom}}</div>
            <div>物流单号：{{expressDetailTrackingNo}}</div>
          </div>
          <div class="expressDetail-desc">
            <div class="expressDetail-desc-con" v-for="(item,index) in expressList" :key="index">
              <div class="expressDetail-desc-left">
                <div class="expressDetail-desc-left-dot"></div>
                <div class="expressDetail-desc-left-line"></div>
              </div>
              <div class="expressDetail-desc-right">
                <div class="expressDetail-desc-right-title">{{item.remark}}</div>
                <div class="expressDetail-desc-right-time">{{item.acceptTime}}</div>
              </div>
            </div>
          </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import navLeft from "@/components/navLeft.vue";
import { translateTime } from "@/utils/public"
import { getList,deleteOrder, editOrder, getOrderDetailByTrackingNo  } from "@/api/index";
export default {
  components: {
    navLeft,
  },
  data() {
    return {
      ruleForm: {
            id:"",
            orderNo: "",
            name: "",
            phone: "",
            trackingNo: "",
            address: "",
            remarks: "",
            expressType: ""
        },
      rules: {
        name: [
            { required: true, message: "请输入名称", trigger: "blur" },
            { min: 1, message: "最少输入一个字符", trigger: "blur" },
          ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
              validator: function (rule, value, callback) {
              if (/^1[123457890]\d{9}$/.test(value) == false) {
                  callback(new Error("请输入正确的手机号"));
              } else {
                  callback();
              }
              },
              trigger: "blur",
          },
        ],
        trackingNo: [
          { required: true, message: "请输入物流单号", trigger: "blur" },
        ],
      },
      loading: true,
      dialog: false,
      orderNo: "",
      name: "",
      phone: "",
      expressType: "",
      trackingNo: "",
      dataRange: [],
      list: [],
      skipCount: 0,   //分页 第一页为0 第二页为20 第二页为40 
      totalCount: 0,
      expressDialogVisible: false,
      expressDetailFrom: "",
      expressDetailTrackingNo: "",
      expressList:[]
    };
  },
  created() {
    const _this = this;
    _this.getData(_this.skipCount)
  },
  computed: {},
  mounted() {},
  methods: {

    // changeDateRange(val){
    //   console.log("change",val)
    //   if(val == null){
    //     console.log("11111111111111")
    //     this.dataRange = []
    //     console.log(this.dataRange)
    //   }
    // },
    
    getData(skipCount){
      let _this = this;
      _this.loading = true
      console.log(_this.dataRange)
      let params = {
        orderNo: _this.orderNo,
        name: _this.name,
        phone: _this.phone,
        expressType: _this.expressType,
        trackingNo: _this.trackingNo,
        orderDateBegin: "",
        orderDateEnd: "",
        skipCount: skipCount,
        maxResultCount: 20,
      }
      if(_this.dataRange == null) {
        params.orderDateBegin = "",
        params.orderDateEnd = ""
      } else {
        params.orderDateBegin = _this.dataRange[0],
        params.orderDateEnd = _this.dataRange[1]
      }
      
      getList(params).then((res) => {
      // console.log(res);
        _this.totalCount = res.totalCount
        let list = res.items
        list.forEach(e => {
          e.creationTime  = translateTime(e.creationTime)
        });
        _this.list = list
        _this.loading = false
      });
    },

    showExpressDetail(e){
      console.log(e)
      const _this = this;
      _this.expressDialogVisible = true
      _this.expressDetailFrom = e.expressType
      _this.expressDetailTrackingNo = e.trackingNo
      getOrderDetailByTrackingNo(e.id).then(res =>{
        console.log(res)
        _this.expressList = res
      })
    },

    searchOrder(){
      console.log(this.dataRange)
      let _this = this;
      _this.getData(_this.skipCount)
    },

    handleEdit(e){
      const _this = this;
      _this.dialog = true
      _this.ruleForm = e
    },
    handleDelete(index,item){
      console.log(index,item)
      const _this = this;
      _this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteOrder(item.id).then(res =>{
          console.log(res)
          _this.list.splice(index,1)
          _this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      
    },
    handleCurrentChange(val){
      console.log(val)
      let _this = this;
      let skipCount = 1;
      skipCount = (val - 1) * 20
      _this.skipCount = skipCount
      console.log(skipCount)
      _this.getData(skipCount)
      
    },

    submitForm(formName) {
        const _this = this;
        _this.$refs[formName].validate((valid) => {
            console.log(valid)
            if (valid) {
              _this.loading = true
                console.log(_this.ruleForm, _this.ruleForm.id)
                editOrder(_this.ruleForm, _this.ruleForm.id).then(res =>{
                    _this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    _this.loading = false
                    _this.dialog = false
                })
            } else {
                return false;
            }
        });
      },
    handleClose(done) {
      const _this = this;
      if (_this.loading) {
        return;
      }
      _this.$confirm('确定提交修改内容？')
        .then(_ => {
          _this.submitForm(formName)
        })
        .catch(_ => {
          _this.dialog = false
        });
    },
  },
};
</script>

<style lang="scss" scoped>
#index {
  .navRight {
    margin-left: 210px;
    padding: 20px 40px;
    .top {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .top-cell {
        display: flex;
        align-items: center;
        width: 25%;
        margin-top: 20px;
        font-size: 14px;
        .el-input {
          width: 67%;
          min-width: 140px;
        }
      }
      .cell-date{
        width: 35%;
      }
      .cell-button{
        button{
          margin: 0 auto;
        }
      }
    }
    .con{
      margin-top: 30px;
      // :v-deep .el-drawer__title{
      //   span:focus{
      //       outline: none!important;
      //     }
      
      // }
      .demo-drawer__content{
        padding: 0 20px 0 0;
      }
      /deep/ :focus {
        outline: 0;
      }
      form{
        max-width: 500px;
      }
    }
    .bottom{
      margin-top: 30px;
      
    }
    .expressDetail{
      /deep/ .el-dialog--center{
        max-height: 60vh;
        overflow-y: scroll;
        &::-webkit-scrollbar{
          display: none;
        }
      }
        .expressDetail-name{
          padding: 15px 20px;
          background: #b9e8de;
        }
        .expressDetail-desc{
          margin-top: 20px;
          .expressDetail-desc-con{
            display: flex;
            align-items: flex-start;
            padding-bottom: 20px;
            border-left: 2px solid #dfe4ed;
            .expressDetail-desc-left{
              
              .expressDetail-desc-left-dot{
                background: #dfe4ed;
                width: 8px;
                height: 8px;
                border-radius: 4px;
                margin-left: -5px;
              }
              // .expressDetail-desc-left-line{
              //   width: 2px;
              //   height: 30px;
              //   background: #dfe4ed;
              //   margin-left: 3px;
              // }
            }
            .expressDetail-desc-right{
              margin-left: 24px;
              .expressDetail-desc-right-title{
                font-size: 16px;
                padding-bottom: 12px;
              }
              .expressDetail-desc-right-time{
                font-size: 14px;
              }
            }
          }
        }
      }
  }
}
</style>
