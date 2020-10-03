<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <!-- <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 150px;"
        placeholder="请输入广告标题"
      />
      
      <el-select
        v-model="listQuery.enabled"
        class="filter-item"
        placeholder="启用状态"
        style="width: 110px;"
        @change="handleFilter"
      >
        <el-option label="全部" value />
        <el-option :value="true" label="启用" />
        <el-option :value="false" label="关闭" />
      </el-select>
      <el-button
        v-permission="['GET /admin/ad/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button> -->
      <!-- <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>-->
      <!-- <el-button
        v-permission="['POST /admin/ad/create']"
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        style="float: right"
        @click="handleCreate"
      >添加</el-button> -->
    </div>

    <!-- 查询结果 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="正在查询中。。。"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="活动编号" prop="id" width="80" />
      <el-table-column align="center" label="活动描述" prop="describe" />
      <el-table-column align="center" label="商品名称" prop="name" />
      <el-table-column align="center" label="商品数量" prop="num" />
      <el-table-column align="center" label="商品价格" prop="price" />
      <el-table-column align="center" label="可售单量" prop="saleVolume" />
      <!-- <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /admin/ad/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
          >编辑</el-button>
          <el-button
            v-permission="['POST /admin/ad/update']"
            :type="scope.row.enabled?'primary':'warning'"
            size="mini"
            @click="handleEnable(scope.row)"
          >{{ scope.row.enabled ? '关闭' : '启用' }}</el-button>
          <el-button
            v-permission="['POST /admin/ad/delete']"
            :disabled="scope.row.enabled"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #20a0ff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 145px;
  height: 145px;
  line-height: 145px;
  text-align: center;
}
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}

.el-radio,
.el-radio__input {
  line-height: unset;
}
</style>

<script>
import { activityList } from "@/api/activity";
import { uploadPath } from "@/api/storage";
import { getToken } from "@/utils/auth";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
const positionMap = {
  "home_banner": "首页banner",
  "home_vice_banner": "首页副banner1",
  "home_vice_banner_two": "首页副banner2",
  "classroom_banner": "课堂banner",
  "classroom_icon": "课堂icon",
  "my_bunner": "我的页面广告",
};
const sizeMap = {
  // "1": "702*300",
  // "12": "702*160",
  // "2": "546*160",
  // "4": "702*160"
};
const urlTypeMap = {
  1: "h5",
  2: "原生",
  3: "微信小程序",
  4: "主键"
};
export default {
  name: "Ad",
  components: { Pagination },
  data() {
    return {
      positionMap,
      sizeMap,
      urlTypeMap,
      uploadPath,
      list: undefined,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        name: undefined,
        content: undefined,
        position: undefined,
        enabled: undefined
      },
      channel: [],
      dataForm: {
        id: undefined,
        name: undefined,
        content: undefined,
        picUrl: undefined,
        link: undefined,
        sort: 100,
        urlType: "1",
        position: "",
        enabled: false,
        channelCode: ""
      },
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
      },
      rules: {
        name: [
          { required: true, message: "广告标题不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "广告内容不能为空", trigger: "blur" }
        ],
        picUrl: [{ required: true, message: "广告链接不能为空", trigger: "blur" }]
      },
      downloadLoading: false,
      select_all: false,
      isAll: false
    };
  },
  computed: {
    headers() {
      return {
        "AdminToken": getToken()
      };
    }
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true;
      activityList(this.listQuery)
        .then(response => {
          this.list = response.data.data.items;
          this.total = response.data.data.total;
          this.listLoading = false;
        })
        .catch(() => {
          this.list = [];
          this.total = 0;
          this.listLoading = false;
        });
    },
    handleCheck(val, channel) {
      // console.log(val, channel);
      const that = this;
      const channelCode = JSON.parse(JSON.stringify(that.dataForm.channelCode));
      channelCode[channel] = val ? "all" : "";
      this.isAll = Object.values(channelCode).every(item => {
        return item == "all";
      });
      this.dataForm.channelCode = channelCode;
    },

    inputChange(val) {
      this.$forceUpdate();
    },

    selectAll() {
      const that = this;
      const channelCode = that.dataForm.channelCode;
      const isAll = Object.values(channelCode).every(item => {
        return item == "all";
      });
      this.isAll = !isAll;
      for (const key in channelCode) {
        that.dataForm.channelCode[key] = isAll ? "" : "all";
      }
    },

    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    // 启用、关闭广告
    handleEnable: function(row) {
      this.$confirm(row.enabled ? "确认关闭" : "确认启用", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const dataForm = row;
          // console.log(dataForm.enabled);
          dataForm.enabled = !dataForm.enabled;
          // console.log(dataForm.enabled);
          updateAd(dataForm)
            .then(() => {
              for (const v of this.list) {
                if (v.id === dataForm.id) {
                  const index = this.list.indexOf(v);
                  this.list.splice(index, 1, dataForm);
                  break;
                }
              }
              this.$notify.success({
                title: "成功",
                message: dataForm.enabled ? "启用成功" : "关闭成功"
              });
            })
            .catch(response => {
              this.$notify.error({
                title: "失败",
                message: response.data.errmsg
              });
            });
        })
        .catch(() => {});
    },

    resetForm() {
      this.dataForm = {
        id: undefined,
        name: undefined,
        content: undefined,
        picUrl: undefined,
        urlType: "1",
        link: undefined,
        sort: 100,
        position: "",
        enabled: false,
        channelCode: ""
      };
    },

    handleCreate() {
      // this.getChannel();
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // 上传图片
    uploadUrl: function(response) {
      console.log(response)
      this.dataForm.picUrl = response.data.url;
    },

    // 创建广告
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          console.log(this.dataForm)
          const dataForm = JSON.parse(JSON.stringify(this.dataForm));
          dataForm.channelCode = JSON.stringify(dataForm.channelCode);
          createAd(dataForm)
            .then(response => {
              this.list.unshift(response.data.data);
              this.dialogFormVisible = false;
              this.$notify.success({
                title: "成功",
                message: "创建成功"
              });
            })
            .catch(response => {
              this.$notify.error({
                title: "失败",
                message: response.data.errmsg
              });
            });
        }
      });
    },

    // 更新广告
    handleUpdate(row) {
      // this.resetForm();
      // this.getChannel();
      const dataForm = JSON.parse(JSON.stringify(row));
      // console.log(dataForm.position)
      // dataForm.position = dataForm.position.toString();
      // dataForm.urlType = dataForm.urlType.toString();
      // dataForm.channelCode = dataForm.channelCode
      //   ? JSON.parse(dataForm.channelCode)
      //   : "";
      this.dataForm = Object.assign({}, dataForm);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    // 编辑广告
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const dataForm = JSON.parse(JSON.stringify(this.dataForm));
          dataForm.channelCode = JSON.stringify(dataForm.channelCode);
          updateAd(dataForm)
            .then(() => {
              this.getList();
              this.dialogFormVisible = false;
              this.$notify.success({
                title: "成功",
                message: "更新广告成功"
              });
            })
            .catch(response => {
              this.$notify.error({
                title: "失败",
                message: response.data.errmsg
              });
            });
        }
      });
    },

    // 删除广告
    handleDelete(row) {
      this.$confirm("确认删除该广告", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteAd(row)
            .then(response => {
              this.$notify.success({
                title: "成功",
                message: "删除成功"
              });
              const index = this.list.indexOf(row);
              this.list.splice(index, 1);
            })
            .catch(response => {
              this.$notify.error({
                title: "失败",
                message: response.data.errmsg
              });
            });
        })
        .catch(() => {});
    },

    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "广告ID",
          "广告标题",
          "广告内容",
          "广告图片",
          "广告位置",
          "活动链接",
          "是否启用"
        ];
        const filterVal = [
          "id",
          "name",
          "content",
          "picUrl",
          "postion",
          "link",
          "enabled"
        ];
        excel.export_json_to_excel2(tHeader, this.list, filterVal, "广告信息");
        this.downloadLoading = false;
      });
    }
  }
};
</script>
