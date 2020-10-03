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
      <el-table-column align="center" label="序号" prop="id" width="80" />
      <el-table-column
        align="center"
        label="订单编号"
        prop="orderSn"
        width="160"
      />
      <el-table-column
        align="center"
        label="买家名称"
        prop="nickUser"
        width="160"
      />
      <el-table-column
        align="center"
        label="卖家名称"
        prop="sellNickUser"
        width="160"
      />
      <el-table-column
        align="center"
        label="订单状态"
        prop="orderStatus"
        width="90"
      />
      <el-table-column
        align="center"
        label="活动描述"
        prop="describe"
        width="160"
      />
      <el-table-column
        align="center"
        label="商品名称"
        prop="goodsName"
        width="160"
      />
      <el-table-column
        align="center"
        label="商品数量"
        prop="goodsNum"
        width="90"
      />
      <el-table-column
        align="center"
        label="商品价格"
        prop="goodsPrice"
        width="90"
      />
      <!-- <el-table-column align="center" label="邀请记录" min-width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleInvite(scope.row)"
            >查看记录</el-button
          >
        </template>
      </el-table-column> -->
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
import axios from "axios";
import { cashList } from "@/api/cash";
import Pagination from "@/components/Pagination";
import { getToken } from "@/utils/auth";
// import { listChannel } from "@/api/channel";
export default {
  name: "Cash",
  components: {
    Pagination,
  },
  data() {
    return {
      listLoading: true, // 列表加载
      list: undefined,
      total: 0,
      // 请求列表传参
      listQuery: {
        page: 1,
        limit: 20,
      },
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
      cashList(this.listQuery)
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
