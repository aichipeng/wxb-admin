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
        label="用户编号"
        prop="userId"
        width="80"
      />
      <el-table-column
        align="center"
        label="用户名称"
        prop="username"
        width="160"
      />
      <el-table-column
        align="center"
        label="用户手机号"
        prop="mobile"
        width="140"
      />
      <el-table-column
        align="center"
        label="反馈内容"
        prop="content"
        mim-width="180"
      />
      <el-table-column align="center" label="反馈图片" width="130">
        <template slot-scope="scope">
          <el-button v-if="scope.row.hasPicture" type="primary" size="mini" @click="handlePics(scope.row)"
            >查看图片({{scope.row.picUrls.length}}张)</el-button
          >
          <el-tag type="info" v-else  >无图片</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="创建时间"
        prop="addTime"
        width="180"
      />
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <!-- 图片详情 -->
    <el-dialog title="图片详情" :visible.sync="visible">
      <div v-for="(item, index) in currentItem" :key="index">
        <img :src="item" alt="图片失效" style="width: 100%"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { feedbackList } from "@/api/feedback";
import Pagination from "@/components/Pagination";
import { getToken } from "@/utils/auth";
export default {
  name: "Feedback",
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
      visible: false,
      currentItem: {},
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
      feedbackList(this.listQuery)
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
    handlePics(row) {
      this.visible = true;
      this.currentItem = row.picUrls || [];
      console.log(row);
    },
    // 导出用户列表excel
    handleDownload() {
      this.downloadData.startTime = this.listQuery.startTime;
      this.downloadData.endTime = this.listQuery.endTime;
      axios
        .get(process.env.BASE_API + "/user/excel", {
          params: this.downloadData,
          responseType: "blob",
          headers: {
            "Content-Type": "application/json",
            AdminToken: getToken(),
          },
        })
        .then((res) => {
          // console.log(res.data)
          this.downloadVisible = false;
          const blob = new Blob([res.data], {
            type: "application/vnd.ms-excel;charset=utf-8",
          });
          const objectUrl = window.URL.createObjectURL(blob);
          const aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = objectUrl;
          aLink.setAttribute("download", "用户信息.xls");
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(objectUrl);
        })
        .catch((err) => {
          this.downloadVisible = false;
          console.log(err);
        });
    },
  },
};
</script>
