<template>
  <div id="add">
    <navLeft activeTab="2"></navLeft>
    <div class="con">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="formLeft"
      >
        <el-form-item label="订单号">
          <el-input v-model="ruleForm.orderNo" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="ruleForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="快递类型">
          <el-input v-model="ruleForm.expressType" placeholder="请输入快递类型"></el-input>
        </el-form-item>
        <el-form-item label="物流单号" prop="trackingNo">
          <el-input v-model="ruleForm.trackingNo" placeholder="请输入物流单号"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="ruleForm.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="ruleForm.remarks"
            placeholder="请输入备注"
            type="textarea"
            :rows="3"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="showDialogUpload"
            >导入</el-button
          >
          <el-dialog title="批量导入" :visible.sync="dialogUploadVisible">
            <el-upload
              ref="upload"
              class="upload-demo"
              action
              accept=".xlsx"
              :limit="limit"
              :auto-upload="false"
              :on-change="handleChange"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              :file-list="fileList"
              :http-request="uploadFunc"
            >
              <el-button size="middle" type="text">+点击上传</el-button>
            </el-upload>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogUploadVisible = false">取 消</el-button>
              <el-button type="primary" @click="uploadFunc" :loading="uploadLoading">确 定</el-button>
            </span>
          </el-dialog>
        </el-form-item>
      </el-form>

      
    </div>
  </div>
</template>

<script>
import navLeft from "@/components/navLeft.vue";
import XLSX from "xlsx"
import { addOrder,addOrderList } from "@/api/index";
export default {
  components: {
    navLeft,
  },
  data() {
    return {
      dialogUploadVisible: false,
      limit: 1,  // 上传excell时，同时允许上传的最大数
      file: '',
      fileList: [],   // excel文件列表
      ruleForm: {
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
      excelJson: [],
      uploadLoading: false
    };
  },
  created() {},
  mounted() {},
  methods: {
    submitForm(formName) {
      const _this = this;
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          addOrder(_this.ruleForm).then((res) => {
            _this.$message({
              type: "success",
              message: "添加成功!",
            });
            _this.ruleForm = {
              orderNo: "",
              name: "",
              phone: "",
              trackingNo: "",
              address: "",
              remarks: "",
              expressType: ""
            };
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    showDialogUpload(){
      this.dialogUploadVisible = true
    },

    // beforeUpload(file) {
    //   let extension = file.name.substring(file.name.lastIndexOf('.')+1)
    //   let size = file.size / 1024 / 1024
    //   if(extension !== 'xlsx') {
    //     this.$message.warning('只能上传后缀是.xlsx的文件')
    //   }
    //   if(size > 10) {
    //     this.$message.warning('文件大小不得超过10M')
    //   }
    // },

    // 文件状态改变
    handleChange(file, fileList) {
      const _this = this
      const types = file.name.split('.')[1]
      const fileType = ['xlsx','xls'].some((item) => item === types)
      if (!fileType) {
        this.$message('格式错误！请下载词库导入模板编辑后上传')
        return false
      }
      this.file2Xce(file).then((tabJson) => {
        if (tabJson && tabJson.length > 0) {
          // this.xlsxJson = tabJson//Excel表格的数据
          let params = {
            orders: []
          }
          tabJson[0].sheet.map(item =>{
            let obj = {
                orderNo: "",
                name: "",
                phone: "",
                address: "",
                trackingNo: "",
                remarks: "",
                expressType: ""
              }
            for (let key in item) {
              if(key.indexOf("orderNo") > -1){
                obj.orderNo = item[key]
              } else if(key.indexOf("Name") > -1){
                obj.name = item[key]
              } else if(key.indexOf("Phone") > -1){
                obj.phone = item[key]
              }  else if(key.indexOf("Address") > -1){
                obj.address = item[key]
              } else if(key.indexOf("TrackingNo") > -1){
                obj.trackingNo = item[key]
              } else if(key.indexOf("Remarks") > -1){
                obj.remarks = item[key]
              } else if(key.indexOf("ExpressType") > -1){
                obj.expressType = item[key]
              }
            }
            params.orders.push(obj)
          })
          _this.excelJson = params
          
          //...
          //...
          //处理表格数据的操作
        }
      })
    },
    file2Xce(file) {
      return new Promise(function(resolve) {
        const reader = new FileReader()
        reader.onload = function(e) {
          const data = e.target.result
          this.wb = XLSX.read(data, {
            type: 'binary',
          })
          const result = []
          this.wb.SheetNames.forEach((sheetName) => {
            result.push({
              sheetName: sheetName,
              sheet: XLSX.utils.sheet_to_json(this.wb.Sheets[sheetName]),
            })
          })
          resolve(result)
        }
        reader.readAsBinaryString(file.raw)
        // reader.readAsBinaryString(file) // 传统input方法
      })
    }, 

    // 删除文件
    handleRemove(file, fileList) {
      this.fileList = []
    },

    // 文件超出个数限制
    handleExceed(files, fileList) {
      this.$message.warning(`只能选择 ${this.limit} 个文件`)
    },

    
    // 覆盖默认的上传行为，自定义上传的实现
    uploadFunc() {
      const _this = this
      console.log(_this.excelJson)
      if(_this.excelJson.orders.length > 0){
        _this.uploadLoading = true
        addOrderList(_this.excelJson).then(res =>{
          _this.uploadLoading = false
          _this.$message.success('导入成功')
          _this.fileList = []
        })
      } else {
        this.$message.warning("请先选择文件")
      }
      
       
    }
  },
  watch: {},
};
</script>

<style lang='scss' scoped>
#add {
  .con {
    margin-left: 210px;
    padding: 20px 40px;
    form {
      width: 500px;
    }
    /deep/ .el-dialog{
      width: 30%;
      min-width: 400px;
    }
  }
}
</style>
