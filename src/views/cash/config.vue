<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="dataForm" status-icon label-width="120px">
      <el-form-item label="提现服务费">
        <el-input placeholder="请输入提现服务费" v-model="dataForm.keyValue">
          <template slot="append">%</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="cancel" v-permission="['GET /admin/config/fee']"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="update"
          v-permission="['POST /admin/config/fee']"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
</style>
<script>
import { cashFee, cashFeeUpdate } from "@/api/cash";
import { uploadPath } from "@/api/storage";
import { getToken } from "@/utils/auth";

export default {
  name: "CashConfig",
  data() {
    return {
      uploadPath,
      dataForm: {
        keyValue: "",
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
    this.init();
  },
  methods: {
    init: function () {
      cashFee().then((res) => {
        this.dataForm.keyValue = res.data.data.keyValue;
      });
    },
    cancel() {
      this.init();
    },
    update() {
      cashFeeUpdate(this.dataForm)
        .then((response) => {
          this.$notify.success({
            title: "成功",
            message: "提现服务费成功",
          });
        })
        .catch((response) => {
          this.$notify.error({
            title: "失败",
            message: response.data.errmsg,
          });
        });
    },
  },
};
</script>
