<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <!-- <el-input
        v-model="listQuery.username"
        clearable
        class="filter-item"
        style="width: 150px"
        placeholder="请输入用户名称"
      /> -->
      <!-- <el-select v-model="listQuery.channel" style="top:-4px" clearable placeholder="请选择用户渠道">
        <el-option
          v-for="(item ,index) in channel"
          :key="index"
          :value="item.channel"
          :label="item.channelName"
        />
      </el-select> -->
      <!-- <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >查找</el-button
      >
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        style="float: right"
        @click="downloadVisible = true"
        >导出</el-button
      > -->
      <el-button
        v-permission="['POST /admin/ship/create']"
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        style="float: right"
        @click="handleCreate"
        >添加</el-button
      >
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
      <el-table-column align="center" label="编号" prop="id" />
      <el-table-column align="center" label="关闭原因" prop="name" />

      <el-table-column align="center" label="创建时间" prop="addTime" />
      <el-table-column align="center" label="状态" prop="status" width="100">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.status ? "启用" : "禁用" }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="230">
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /admin/ship/update']"
            type="primary"
            size="mini"
            @click="handleDisabled(scope.row)"
            >{{ scope.row.status == 1 ? "禁用" : "启用" }}</el-button
          >
          <el-button
            v-permission="['POST /admin/ship/update']"
            type="primary"
            size="mini"
            @click="handleUpdate(scope.row)"
            >编辑</el-button
          >
          <el-button
            v-permission="['POST /admin/ship/delete']"
            :disabled="scope.row.enabled"
            type="danger"
            size="mini"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <!-- 添加或修改对话框 -->
    <el-dialog
      :title="dataForm.id ? '编辑' : '添加'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="margin-left: 50px"
      >
        <el-form-item label="关闭原因" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <el-form-item label="状态" prop="logo">
          <el-select v-model="dataForm.status" placeholder="状态">
            <el-option :value="true" label="启用" />
            <el-option :value="false" label="禁用" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
.avatar-uploader .el-upload {
  border: 2px dashed #d9d9d9;
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
</style>
<script>
import axios from "axios";
import { closeList, closeCreate, closeUpdate } from "@/api/order";
import Pagination from "@/components/Pagination";
import { getToken } from "@/utils/auth";
import { uploadPath } from "@/api/storage";
// import { listChannel } from "@/api/channel";
export default {
  name: "Ship",
  components: {
    Pagination,
  },
  data() {
    return {
      uploadPath,
      listLoading: true, // 列表加载
      list: undefined,
      total: 0,
      // 请求列表传参
      listQuery: {
        page: 1,
        limit: 20,
      },
      dialogFormVisible: false,
      dataForm: {
        id: undefined,
        name: undefined,
        status: true,
      },
      rules: {
        name: [
          { required: true, message: "物流名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    headers() {
      return {
        AdminToken: getToken(),
      };
    },
  },
  created() {
    // this.getChannel();
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true;
      closeList(this.listQuery)
        .then((response) => {
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

    // 用户搜索、筛选
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    resetForm() {
      this.dataForm = {
        id: undefined,
        name: undefined,
        status: true,
      };
    },

    handleCreate() {
      this.resetForm();
      this.dialogFormVisible = true;
    },

    handleUpdate(row) {
      this.resetForm();
      this.dataForm = row;
      this.dialogFormVisible = true;
    },

    handleDisabled(row) {
      row.status = !row.status
      closeUpdate(row)
        .then((res) => {
          this.$notify.success({
            title: "成功",
            message: "操作成功",
          });
        })
        .catch((response) => {
          row.status = !row.status
          this.$notify.error({
            title: "失败",
            message: response.data.errmsg,
          });
        });
    },
    handleDelete() {},
    // 上传图片
    uploadUrl: function (response) {
      this.dataForm.logo = response.data.url;
    },
    handSubmit() {
      const { id } = this.dataForm;
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let api = null;
          if (id) {
            api = closeUpdate;
          } else {
            api = closeCreate;
          }
          api(this.dataForm)
            .then((response) => {
              this.getList();
              this.dialogFormVisible = false;
              this.$notify.success({
                title: "成功",
                message: "操作成功",
              });
            })
            .catch((response) => {
              this.$notify.error({
                title: "失败",
                message: response.data.errmsg,
              });
            });
        }
      });
    },
    // 导出列表excel
    // handleDownload() {
    //   this.downloadLoading = true;
    //   import("@/vendor/Export2Excel").then(excel => {
    //     const tHeader = [
    //       "编号",
    //       "充值时间",
    //       "用户昵称",
    //       "充值类型",
    //       "充值金额",
    //       "订单号",
    //       "备注",
    //       "充值状态",
    //     ];
    //     const filterVal = [
    //       "id",
    //       "addTime",
    //       "nickName",
    //       "payType",
    //       "rechargeAmount",
    //       "orderNo",
    //       "remark",
    //       "addTime",
    //       "state",
    //     ];
    //     excel.export_json_to_excel2(tHeader, this.list, filterVal, "充值记录");
    //     this.downloadLoading = false;
    //   });
    // }},
  },
};
</script>
