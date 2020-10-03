<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="dataForm" status-icon label-width="300px">
      <el-form-item label="微信客服二维码">
        <el-upload
          :headers="headers"
          :action="uploadPath"
          :show-file-list="false"
          :on-success="uploadPicUrl"
          class="avatar-uploader"
          accept=".jpg, .jpeg, .png, .gif"
        >
          <img
            v-if="dataForm.litemall_mall_wx_pic"
            :src="dataForm.litemall_mall_wx_pic"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <el-link type="danger" :underline="false">建议尺寸338*338像素</el-link>
      </el-form-item>
      <el-form-item label="小白入门二维码">
        <el-upload
          :headers="headers"
          :action="uploadPath"
          :show-file-list="false"
          :on-success="uploadPicUrl2"
          class="avatar-uploader"
          accept=".jpg, .jpeg, .png, .gif"
        >
          <img
            v-if="dataForm.wx_pic_vip_two"
            :src="dataForm.wx_pic_vip_two"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <el-link type="danger" :underline="false">建议尺寸338*338像素</el-link>
      </el-form-item>
      <el-form-item label="初入股市二维码">
        <el-upload
          :headers="headers"
          :action="uploadPath"
          :show-file-list="false"
          :on-success="uploadPicUrl3"
          class="avatar-uploader"
          accept=".jpg, .jpeg, .png, .gif"
        >
          <img
            v-if="dataForm.wx_pic_vip_three"
            :src="dataForm.wx_pic_vip_three"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <el-link type="danger" :underline="false">建议尺寸338*338像素</el-link>
      </el-form-item>
      <el-form-item label="股海沉浮二维码">
        <el-upload
          :headers="headers"
          :action="uploadPath"
          :show-file-list="false"
          :on-success="uploadPicUrl4"
          class="avatar-uploader"
          accept=".jpg, .jpeg, .png, .gif"
        >
          <img
            v-if="dataForm.wx_pic_vip_four"
            :src="dataForm.wx_pic_vip_four"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <el-link type="danger" :underline="false">建议尺寸338*338像素</el-link>
      </el-form-item>
      <el-form-item>
          <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="update">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.avatar {
  width: 145px;
  height: 145px;
  display: block;
}
</style>
<script>
import { listWx, updateWx } from "@/api/config";
import { uploadPath } from "@/api/storage";
import { getToken } from "@/utils/auth";

export default {
  name: "ConfigMail",
  data() {
    return {
      uploadPath,
      dataForm: {
        litemall_mall_wx_pic: "",
        wx_pic_vip_two:'',
        wx_pic_vip_three:'',
        wx_pic_vip_four:''
      }
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
    this.init();
  },
  methods: {
    uploadPicUrl: function(response) {
      this.dataForm.litemall_mall_wx_pic = response.data.url;
    },
        uploadPicUrl2: function(response) {
      this.dataForm.wx_pic_vip_two = response.data.url;
    },
        uploadPicUrl3: function(response) {
      this.dataForm.wx_pic_vip_three = response.data.url;
    },
        uploadPicUrl4: function(response) {
      this.dataForm.wx_pic_vip_four = response.data.url;
    },
    init: function() {
      listWx().then(response => {
        this.dataForm.litemall_mall_wx_pic = response.data.data.wx_pic;
        this.dataForm.wx_pic_vip_two = response.data.data.wx_pic_vip_two;
        this.dataForm.wx_pic_vip_three = response.data.data.wx_pic_vip_three;
        this.dataForm.wx_pic_vip_four = response.data.data.wx_pic_vip_four;
      });
    },
    cancel() {
      this.init();
    },
    update() {
      updateWx({wx_pic:this.dataForm.litemall_mall_wx_pic,wx_pic_vip_two:this.dataForm.wx_pic_vip_two,wx_pic_vip_three:this.dataForm.wx_pic_vip_three,wx_pic_vip_four:this.dataForm.wx_pic_vip_four})
        .then(response => {
          this.$notify.success({
            title: "成功",
            message: "商城配置成功"
          });
        })
        .catch(response => {
          this.$notify.error({
            title: "失败",
            message: response.data.errmsg
          });
        });
    }
  }
};
</script>
