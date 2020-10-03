<template>
  <div class="app-container">
    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        clearable
        class="filter-item"
        style="width: 150px;"
        placeholder="请输入广告标题"
      />
      <!-- <el-input
        v-model="listQuery.content"
        clearable
        class="filter-item"
        style="width: 150px;"
        placeholder="请输入广告内容"
      /> -->
      <!-- <el-select
        v-model="listQuery.position"
        class="filter-item"
        placeholder="广告位置"
        style="width: 150px;"
        @change="handleFilter"
      >
        <el-option label="全部" value />
        <el-option v-for="(item,key) in positionMap" :key="key" :label="item" :value="key" />
      </el-select> -->
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
      >查找</el-button>
      <!-- <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >导出</el-button>-->
      <el-button
        v-permission="['POST /admin/ad/create']"
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        style="float: right"
        @click="handleCreate"
      >添加</el-button>
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
      <el-table-column align="center" label="广告编号" prop="id" width="80" />
      <el-table-column align="center" label="广告位置" prop="position" width="140">
        <template slot-scope="scope">
          <el-tag>{{ positionMap[scope.row.position] }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="广告标题" prop="name" />

      <el-table-column align="center" label="广告图片" prop="picUrl" width="110">
        <template slot-scope="scope">
          <img v-if="scope.row.picUrl" :src="scope.row.picUrl" width="80" >
        </template>
      </el-table-column>

      <el-table-column align="center" label="活动链接" prop="link">
        <template slot-scope="scope">{{ scope.row.link?scope.row.link:'——' }}</template>
      </el-table-column>

      <el-table-column align="center" label="是否启用" prop="enabled">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.enabled ? 'primary' : 'info' "
          >{{ scope.row.enabled ? '启用' : '未启用' }}</el-tag>
        </template>
      </el-table-column>

      <!-- <el-table-column align="center" label="广告位置" prop="position" width="140">
        <template slot-scope="scope">
          <el-tag>{{ positionMap[scope.row.position] }}</el-tag>
        </template>
      </el-table-column> -->

      <el-table-column align="center" label="排序" prop="sort" width="80" />

      <el-table-column align="center" label="操作" width="230" class-name="small-padding fixed-width">
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
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 添加或修改对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="dataForm"
        status-icon
        label-position="left"
        label-width="100px"
        style="margin-left:50px;"
      >
        <el-form-item label="广告标题" prop="name">
          <el-input v-model="dataForm.name" />
        </el-form-item>
        <!-- <el-form-item label="广告内容" prop="content">
          <el-input v-model="dataForm.content" />
        </el-form-item> -->
        <el-form-item label="广告图片" prop="picUrl">
          <el-upload
            :headers="headers"
            :action="uploadPath"
            :show-file-list="false"
            :on-success="uploadUrl"
            class="avatar-uploader"
            accept=".jpg, .jpeg, .png, .gif"
          >
            <img v-if="dataForm.picUrl" :src="dataForm.picUrl" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <el-link
            v-if="sizeMap[dataForm.position]"
            :underline="false"
            type="danger"
          >建议尺寸{{ sizeMap[dataForm.position] }}像素</el-link>
        </el-form-item>
        <el-form-item label="广告位置" prop="position">
          <el-select v-model="dataForm.position" placeholder="请选择">
            <el-option v-for="(item,key) in positionMap" :key="key" :value="key" :label="item" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="链接类型" prop="urlType">
          <el-select v-model="dataForm.urlType" placeholder="请选择">
            <el-option v-for="(item,key) in urlTypeMap" :key="key" :value="key" :label="item" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="活动链接" prop="link">
          <el-input v-model="dataForm.link" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="dataForm.sort" />
        </el-form-item>
        <!-- <el-form-item label="禁用范围" prop="channelCode">
          <el-row type="flex" justify="end" align="center">
            <el-button type="primary" size="mini" @click="selectAll">{{ !isAll?'全选':'取消' }}</el-button>
          </el-row>
          <el-row>
            <el-col v-for="(item ,index) in channel" :span="12" :key="index">
              <el-row type="flex" align="center">
                <el-checkbox
                  :value="dataForm.channelCode[item.channel]=='all'"
                  @change="handleCheck($event, item.channel)"
                />
                <el-col>{{ item.channelName }}</el-col>
              </el-row>
              <el-input
                v-model="dataForm.channelCode[item.channel]"
                :disabled="dataForm.channelCode[item.channel]=='all'"
                size="small"
                @input="inputChange"
              >
                <template slot="prepend">禁用版本</template>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">确定</el-button>
        <el-button v-else type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
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
import { listAd, createAd, updateAd, deleteAd } from "@/api/ad";
import { listChannel } from "@/api/channel";
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
    // 获取广告
    getList() {
      this.listLoading = true;
      listAd(this.listQuery)
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

    getChannel() {
      const that = this;
      listChannel({ limit: 100 ,typeId:2})
        .then(response => {
          that.channel = response.data.data.items;
          that.channel.forEach(item => {
            if (!that.dataForm.channelCode) {
              that.dataForm.channelCode = {};
              that.dataForm.channelCode[item.channel] = "";
            } else if (!that.dataForm.channelCode[item.channel]) {
              that.dataForm.channelCode[item.channel] = "";
            }
          });
          that.isAll = Object.values(that.dataForm.channelCode).every(item => {
            return item == "all";
          });
        })
        .catch(() => {
          that.channel = [];
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
