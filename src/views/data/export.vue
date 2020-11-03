<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-date-picker
        v-model="listQuery.startTime"
        class="filter-item"
        style="width: 150px"
        value-format="timestamp"
        type="date"
        placeholder="开始时间"
      />
      <el-date-picker
        v-model="listQuery.endTime"
        class="filter-item"
        style="width: 150px"
        type="date"
        value-format="timestamp"
        placeholder="结束时间"
      />
      <el-input
        v-model="listQuery.userId"
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
        placeholder="请输入用户昵称"
      />
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
      <el-table-column align="center" label="编号" prop="id" min-width="80" />
      <el-table-column
        align="center"
        label="卖家昵称"
        prop="nickName"
        min-width="120"
      />
      <el-table-column
        align="center"
        label="用户编号"
        prop="userId"
        min-width="80"
      />
      <el-table-column
        align="center"
        label="手机号"
        prop="mobile"
        min-width="120"
      />
      <el-table-column
        align="center"
        label="导入数据量"
        prop="total"
        min-width="100"
      />
      <el-table-column
        align="center"
        label="导入时间"
        prop="addTime"
        min-width="180"
      />
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="handleDetail(scope.row)"
            v-permission="['POST /admin/data/details']"
            >详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 详情弹窗 -->
    <el-dialog title="详情" :visible.sync="dialogTableVisible" width="80%">
      <el-table
        :data="tableList"
        v-loading="tableListLoading"
        element-loading-text="正在查询中。。。"
        border
        fit
      >
        <el-table-column
          align="center"
          property="orderNo"
          label="单号"
        ></el-table-column>
        <el-table-column
          align="center"
          property="shipSn"
          label="物流单号"
        ></el-table-column>
        <el-table-column
          align="center"
          property="freightPrice"
          label="物流成本"
        ></el-table-column>
      </el-table>
      <pagination
        v-show="tableTotal > 0"
        :total="tableTotal"
        :page.sync="tableQuery.page"
        :limit.sync="tableQuery.limit"
        @pagination="getTableList"
      />
    </el-dialog>
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
import { dataList, dataListDetail } from "@/api/data";
import Pagination from "@/components/Pagination";
import { getToken } from "@/utils/auth";
const stateMap = {
  0: "审核中",
  1: "已通过",
  2: "已反驳",
};
export default {
  name: "Cash",
  components: {
    Pagination,
  },
  data() {
    return {
      stateMap,
      listLoading: true, // 列表加载
      list: undefined,
      total: 0,
      // 请求列表传参
      listQuery: {
        page: 1,
        limit: 20,
      },
      dialogTableVisible: false,
      tableListLoading: true,
      tableList: undefined,
      tableTotal: 0,
      tableQuery: {
        page: 1,
        limit: 20,
      },
      downloadLoading: false,
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
      dataList(this.listQuery)
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
    handleDetail(row) {
      if (row.id) {
        this.tableQuery = {
          page: 1,
          limit: 10,
          totalId: row.id,
        };
        this.tableListLoading = true;
        this.tableList = undefined;
        this.tableTotal = 0;
        this.getTableList();
      }
    },
    getTableList() {
      const { tableQuery } = this;
      dataListDetail(tableQuery)
        .then((response) => {
          this.dialogTableVisible = true;
          this.tableList = response.data.data.items;
          this.tableTotal = response.data.data.total;
          this.tableListLoading = false;
        })
        .catch(() => {
          this.tableList = [];
          this.tableTotal = 0;
          this.tableListLoading = false;
        });
    },
    // 导出列表excel
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "编号",
          "卖家昵称",
          "用户编号",
          "手机号",
          "导入数据量",
          "导入时间",
        ];
        const filterVal = [
          "id",
          "nickName",
          "userId",
          "mobile",
          "total",
          "addTime",
        ];
        excel.export_json_to_excel2(tHeader, this.list, filterVal, "导入记录");
        this.downloadLoading = false;
      });
    },
  },
};
</script>
