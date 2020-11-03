<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.id"
        clearable
        class="filter-item"
        style="width: 150px"
        placeholder="请输入用户编号"
      />
      <el-input
        v-model="listQuery.username"
        clearable
        class="filter-item"
        style="width: 150px"
        placeholder="请输入用户名称"
      />
      <!-- <el-input
        v-model="listQuery.mobile"
        clearable
        class="filter-item"
        style="width: 150px"
        placeholder="请输入用户手机号"
      /> -->
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >查找</el-button
      >
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        style="float: right"
        @click="handleDownload"
      >
        导出
      </el-button>
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
      <el-table-column align="center" label="编号" prop="id" width="90">
      </el-table-column>
      <el-table-column align="center" label="头像" prop="avatar" width="110">
        <template slot-scope="scope">
          <el-avatar :size="40" :src="scope.row.avatar" alt=""></el-avatar>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="昵称"
        prop="nickName"
        min-width="140"
      />
      <el-table-column
        align="center"
        label="手机号"
        prop="mobile"
        width="120"
      />
      <el-table-column
        align="center"
        label="累计消费"
        prop="incomeTotal"
        width="90"
      />
      <el-table-column
        align="center"
        label="累计订单"
        prop="orderTotal"
        width="90"
      />
      <!-- <el-table-column align="center" label="创建时间" prop="addTime" width="200" /> -->
      <el-table-column
        align="center"
        label="首次消费时间"
        prop="beginDealTime"
        min-width="180"
      />
      <el-table-column
        align="center"
        label="最近消费时间"
        prop="endDealTime"
        min-width="180"
      />
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { userListClient } from "@/api/user";
import Pagination from "@/components/Pagination";
import axios from "axios";
import { getToken } from "@/utils/auth";
export default {
  name: "User",
  components: {
    Pagination,
  },
  data() {
    return {
      // 请求列表传参
      listQuery: {
        page: 1,
        limit: 20,
      },
      listLoading: true, // 列表加载
      list: null, // 用户列表
      total: 0, // 用户总数
    };
  },
  created() {
    // this.getChannel();
    this.getList();
  },
  methods: {
    // 获取用户列表
    getList() {
      this.listLoading = true;
      userListClient(this.listQuery)
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

    // 导出用户列表excel
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "编号",
          "昵称",
          "手机号",
          "累计消费",
          "累计订单",
          "首次消费时间",
          "最近消费时间",
        ];
        const filterVal = [
          "id",
          "nickName",
          "mobile",
          "incomeTotal",
          "orderTotal",
          "beginDealTime",
          "endDealTime",
        ];
        excel.export_json_to_excel2(tHeader, this.list, filterVal, "买家列表");
        this.downloadLoading = false;
      });
    },
  },
};
</script>
