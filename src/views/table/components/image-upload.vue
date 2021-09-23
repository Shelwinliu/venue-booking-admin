<template>
  <div class="cover-wrapper" @click="$refs.upload.click()">
    <img
      v-if="isShowPlusIcon"
      src="../../../assets/images/plus.png"
      style="width: 40px"
    />
    <img v-else class="cover-image" :src="previewURL" />
    <input type="file" ref="upload" v-show @change="onFileChange" />
  </div>
</template>

<script>
export default {
  name: "ImageUpload",
  components: {},
  props: {},
  data() {
    return {
      previewURL: "",
      isShowPlusIcon: true,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onFileChange() {
      this.isShowPlusIcon = false;
      const previewFile = this.$refs.upload.files[0];
      const blobData = window.URL.createObjectURL(previewFile);

      let reader = new FileReader(); //创建文件读取对象
      reader.readAsDataURL(previewFile);

      reader.onloadend = function (e) {
        // console.log(e.target.result);
        // this.previewURL = e.target.result
        // this.$emit('input', e.target.result)
      };

      // const formData = new FormData();
      // formData.append('image', previewFile);

      // console.log(formData, previewFile);

      this.previewURL = blobData;
      this.$emit("input", blobData);
      this.$refs.upload.value = "";
    },
  },
};
</script>

<style lang='scss' scoped>
.cover-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  border: 1px dotted rgb(170, 116, 116);
  margin-right: 20px;
  cursor: pointer;
  .cover-image {
    height: 200px;
    width: 200px;
  }
}
</style>
