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
        v-model="listQuery.orderSn"
        clearable
        class="filter-item"
        style="width: 150px"
        placeholder="请输入订单编号"
      />
      <el-input
        v-model="listQuery.username"
        clearable
        class="filter-item"
        style="width: 150px"
        placeholder="请输入用户昵称"
      />
      <el-select
        class="filter-item"
        style="width: 150px"
        v-model="listQuery.status"
        clearable
        placeholder="请选择订单状态"
        @change="handleFilter"
      >
        <el-option
          v-for="(item, index) in statusMap"
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
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        style="float: right"
        @click="handleVisible"
      >
        导出
      </el-button>
      <!-- 导出弹窗 -->
      <el-dialog
        :visible.sync="downloadVisible"
        :title="'导出（每页' + listQuery.limit + '条）'"
        width="40%"
      >
        <el-form :model="downloadData" :inline="true">
          <el-form-item label="开始页:">
            <el-select
              v-model="downloadData.startPage"
              style="width: 80px"
              @change="handleChange"
            >
              <el-option
                v-for="item in Math.ceil(total / listQuery.limit)"
                :key="item"
                :label="item"
                :value="Number(item)"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="结束页:">
            <el-select v-model="downloadData.endPage" style="width: 80px">
              <el-option
                v-for="item in Math.ceil(total / listQuery.limit)"
                :key="item"
                :label="item"
                :value="Number(item)"
                :disabled="item < downloadData.startPage"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="downloadVisible = false">取 消</el-button>
          <el-button
            type="primary"
            :loading="downloadLoading"
            @click="handleDownload"
            >确 定</el-button
          >
        </div>
      </el-dialog>
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
        label="订单号"
        prop="orderSn"
        width="160"
      />
      <el-table-column
        align="center"
        label="卖家昵称"
        prop="sellNickUser"
        width="120"
      />
      <el-table-column
        align="center"
        label="买家昵称"
        prop="nickUser"
        width="120"
      />
      <el-table-column
        align="center"
        label="商品名称"
        prop="goodsName"
        width="120"
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
      <el-table-column
        align="center"
        label="支付时间"
        prop="payTime"
        width="170"
      />
      <el-table-column
        align="center"
        label="活动描述"
        prop="describe"
        width="160"
      />
      <el-table-column
        align="center"
        label="订单状态"
        prop="orderStatus"
        width="120"
      >
        <template slot-scope="scope">
          <el-tag>{{ scope.row.orderStatusName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否关闭" prop="orderStatus" width="80" >
          <template slot-scope="scope">
          <el-tag>{{ scope.row.orderStatus == 602 || scope.row.orderStatus == 601 ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="关闭原因" prop="remark" width="160" />
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
import { listOrder, orderExport } from "@/api/order";
import Pagination from "@/components/Pagination";
import { getToken } from "@/utils/auth";
// import { listChannel } from "@/api/channel";
const statusMap = {
  101: "未付款",
  102: "已取消",
  103: "已取消(系统)",
  201: "已付款",
  202: "预约取件中",
  203: "订单已导出",
  301: "已发货",
  401: "已收货",
  402: "已收货(系统)",
  601: "订单完成",
  602: "订单关闭",
};
export default {
  name: "Order",
  components: {
    Pagination,
  },
  data() {
    return {
      statusMap,
      listLoading: true, // 列表加载
      list: undefined,
      total: 0,
      // 请求列表传参
      listQuery: {
        page: 1,
        limit: 20,
      },
      downloadVisible: false,
      // 导出参数
      downloadData: {
        startPage: 1,
        endPage: 1,
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
      listOrder(this.listQuery)
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
    handleVisible() {
      this.downloadVisible = true;
      let { listQuery, downloadData } = this;
      downloadData = Object.assign(listQuery, downloadData);
    },
    handleChange(value) {
      // console.log(value);
      this.downloadData.endPage = value;
    },
    // 导出用户列表excel
    handleDownload() {
      this.downloadLoading = true;
      axios
        .get(process.env.BASE_API + "/order/excel", {
          params: this.listQuery,
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
            AdminToken: getToken(),
          },
        })
        .then((res) => {
          // console.log(res.data)
          this.downloadLoading = false;
          this.downloadVisible = false;
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          const objectUrl = window.URL.createObjectURL(blob);
          const aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = objectUrl;
          aLink.setAttribute("download", "订单列表.xls");
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(objectUrl);
        })
        .catch((err) => {
          this.downloadLoading = false;
          this.downloadVisible = false;
          console.log(err);
        });
    },
  },
};
</script>
