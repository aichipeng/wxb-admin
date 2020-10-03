<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-select
        v-model="listQuery.type"
        class="filter-item"
        placeholder="类型"
        style="width: 110px;"
        @change="handleFilter"
      >
        <el-option label="全部" value />
        <el-option :value="2" label="虚拟商品" />
        <el-option :value="1" label="实物商品" />
      </el-select>
      <el-select
        v-model="listQuery.status"
        class="filter-item"
        placeholder="状态"
        style="width: 110px;"
        @change="handleFilter"
      >
        <el-option label="全部" value />
        <el-option :value="1" label="已核销" />
        <el-option :value="0" label="未核销" />
      </el-select>
      <!-- <el-button
        v-permission="['GET /admin/ad/list']"
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >查找</el-button> -->
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
      <el-table-column align="center" label="兑换编号" prop="id" width="80" />
      <el-table-column align="center" label="商品类型" prop="type"  width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.type === 2 ? 'primary' : 'danger' "
          >{{ scope.row.type ===2 ? '虚拟商品' : '实物商品' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="兑换商品" prop="name" />
      <el-table-column align="center" label="所需积分" prop="point"  width="100"/>
      <el-table-column align="center" label="是否核销" prop="status"  width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status ? 'primary' : 'info' "
          >{{ scope.row.status ? '已核销' : '未核销' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="核销" width="100" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permission="['POST /admin/ad/update']"
            :type="'warning'"
            size="mini"
            @click="handleEnable(scope.row,scope.row.index)"
            v-if="scope.row.type === 1 && scope.row.status == 0"
          >{{ scope.row.enabled ? '关闭' : '核销' }}</el-button>
        </template>
      </el-table-column>
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
import {listLogs,goodsPush} from "@/api/integral";
import { uploadPath } from "@/api/storage";
import { getToken } from "@/utils/auth";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
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
      // positionMap,
      sizeMap,
      urlTypeMap,
      uploadPath,
      list: undefined,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        status:undefined,
        type:undefined,
      },
      channel: [],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "创建"
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
    // 获取
    getList() {
      this.listLoading = true;
      listLogs(this.listQuery)
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
    handleEnable: function(row,index) {
      this.$confirm( "确认核销", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const dataForm = row;
          dataForm.status = 1
          goodsPush({id:dataForm.id})
            .then(() => {
              this.list.splice(index, 1, dataForm);
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

    handleCreate() {
      // this.getChannel();
      this.resetForm();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
  }
};
</script>
