<template>
  <div class="search-box">
      <i class="icon-search"></i>
      <input v-model="showDismiss" ref='box' type="text" class="box" placeholder="搜索歌曲、歌手">
      <i @click="clear" class="icon-dismiss" v-show="showDismiss"></i>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showDismiss: "",
      timer: 0
    };
  },
  methods: {
    clear() {
      this.showDismiss = "";
    }
  },
  watch: {
    showDismiss(newVal) {
      this.timer && clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$emit("GetSearchConResult", this.$refs.box.value);
      }, 400);
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: $color-highlight-background;
  border-radius: 6px;

  .icon-search {
    font-size: 24px;
    color: $color-background;
  }

  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: none;

    &::placeholder {
      color: $color-text-d;
    }
  }

  .icon-dismiss {
    font-size: 16px;
    color: $color-background;
  }
}
</style>
