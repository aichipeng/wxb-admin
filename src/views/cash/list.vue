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
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 150px"
        placeholder="请输入用户名称"
      />
      <el-select
        v-model="listQuery.status"
        class="filter-item"
        style="width: 150px"
        clearable
        placeholder="请选择审核状态"
        @change="handleFilter"
      >
        <el-option :value="undefined" label="全部" />
        <el-option
          v-for="(item, index) in stateMap"
          :key="index"
          :value="Number(index)"
          :label="item"
        />
      </el-select>
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
      <el-table-column align="center" label="编号" prop="id" width="80" />
      <el-table-column
        align="center"
        label="卖家昵称"
        prop="nickName"
        width="120"
      />
      <el-table-column
        align="center"
        label="用户编号"
        prop="userId"
        width="80"
      />
      <el-table-column
        align="center"
        label="提现发起时间"
        prop="addTime"
        width="180"
      />
      <el-table-column
        align="center"
        label="提现金额"
        prop="cashAmount"
        width="80"
      />
      <el-table-column
        align="center"
        label="平台服务费"
        prop="feeAmount"
        width="100"
      />
      <el-table-column
        align="center"
        label="实际支付金额"
        prop="cashAmount"
        width="110"
      >
        <template slot-scope="scope">
          {{scope.row.cashAmount - scope.row.feeAmount}}
        </template>
      </el-table-column>
      <el-table-column align="center" label="审核状态" prop="state" width="80">
        <template slot-scope="scope">
          <el-tag>{{ stateMap[scope.row.state] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="审核时间"
        prop="updateTime"
        width="180"
      />
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="mini" @click="handleDetail(scope.row)"
            >详情</el-button
          > -->
          <el-button
            v-if="scope.row.state == 2"
            v-permission="['POST /admin/cash/examine']"
            type="primary"
            size="mini"
            @click="handleExamine(scope.row)"
            >审核</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 审核弹窗 -->
    <el-dialog title="提现审核" :visible.sync="dialogFormVisible">
      <el-form :model="formData">
        <el-form-item label="审核备注" label-width="80px">
          <el-input v-model="formData.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleClick">通过</el-button>
        <el-button type="primary" @click="handleClick">驳回</el-button>
      </div>
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
import { cashList, cashExamine } from "@/api/cash";
import Pagination from "@/components/Pagination";
import { getToken } from "@/utils/auth";
const stateMap = {
  0: "处理中",
  2: "审核中",
  4: "已通过",
  5: "放款失败",
  4: "提现撤回",
  9: "已驳回",
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
      dialogFormVisible: false,
      formData: {},
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
    handleDetail() {},
    handleExamine(row) {
      this.dialogFormVisible = true;
      if (row.id) {
        this.formData.orderNo = row.id;
      }
    },
    handleClick() {
      console.log(this.formData);
      cashExamine(this.formData).then((res) => {
        this.dialogFormVisible = false;
        this.$notify.success({
          title: "成功",
          message: "审核成功",
        });
        this.getList();
      });
    },
    // 导出列表excel
    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "编号",
          "用户编号",
          "提现金额",
          "创建时间",
          "更新时间",
          "提现状态",
        ];
        const filterVal = [
          "id",
          "userId",
          "cashAmount",
          "addTime",
          "updateTime",
          "state",
        ];
        excel.export_json_to_excel2(tHeader, this.list, filterVal, "提现记录");
        this.downloadLoading = false;
      });
    },
  },
};
</script>
