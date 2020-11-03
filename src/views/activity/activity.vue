<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <!-- <el-input
        v-model="listQuery.userId"
        clearable
        class="filter-item"
        style="width: 150px"
        placeholder="请输入用户编号"
      /> -->
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 150px"
        placeholder="请输入商品名称"
      />
      <el-select
        class="filter-item"
        style="width: 150px"
        v-model="listQuery.status"
        clearable
        placeholder="请选择活动状态"
        @change="handleFilter"
      >
        <el-option :value="undefined" label="全部" />
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
        label="活动描述"
        prop="describe"
        width="160"
      />
      <el-table-column
        align="center"
        label="可售单量"
        prop="saleVolume"
        width="80"
      >   
       <template slot-scope="scope">
          {{ scope.row.saleVolume + scope.row.soldVolume }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="商品详情 
        (名称-单价-数量)"
        prop="name"
        width="200"
      >
        <template slot-scope="scope">
          {{ scope.row.name }} - ￥{{ scope.row.price }} - {{ scope.row.num }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="运费" prop="freightPrice" />
      <el-table-column align="center" label="总计" prop="t" width="80" > 
        <template slot-scope="scope">
         ￥{{ ((scope.row.price || 0) * (scope.row.num || 0)) + (scope.row.freightPrice || 0) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动状态" prop="status" width="80">
        <template slot-scope="scope">
          <el-tag>{{ statusMap[scope.row.status] }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="剩余单量"
        prop="soldVolume"
        width="80"
      >
        <template slot-scope="scope">
          {{ scope.row.saleVolume }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="PV" prop="pv" width="80" />
      <el-table-column align="center" label="UV" prop="uv" width="80" />
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
      v-show="total > 0"
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
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
const statusMap = {
  0: "待发布",
  1: "进行中",
  2: "已结束",
};
export default {
  name: "Ad",
  components: { Pagination },
  data() {
    return {
      statusMap,
      list: undefined,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true;
      activityList(this.listQuery)
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

    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    handleDownload() {
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then((excel) => {
        const tHeader = [
          "编号",
          "活动描述",
          "商品名称",
          "商品数量",
          "商品价格",
          "邮费",
          "可售单量",
          "已售单量",
          "活动状态",
        ];
        const filterVal = [
          "id",
          "describe",
          "name",
          "num",
          "price",
          "freightPrice",
          "saleVolume",
          "soldVolume",
          "status",
        ];
        excel.export_json_to_excel2(tHeader, this.list, filterVal, "活动列表");
        this.downloadLoading = false;
      });
    },
  },
};
</script>
