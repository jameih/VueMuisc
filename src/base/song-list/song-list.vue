<template>
  <div class="song-list">
    <ul>
      <li v-for="(item,index) in songs" @click="selectItem(item,index)" class="item">
        <div v-show="rank" class="rank">
          <span :class="GetClassDis(index)">{{getText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{item.name}}</h2>
          <p class="desc">{{item.singer}} {{item.album}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>

import { mapMutations, mapGetters } from 'vuex'
export default {
  props: {
    songs: {
      type: Array,
      default: []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit("select", item, index);
    },
    GetClassDis(index) {
      if (index < 3) {
        return `icon icon${index}`
      } else {
        return `text`
      }
    },
    getText(index) {
      if (index > 2) {
        return index + 1
      }
    }
  },
  computed: {

  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.song-list {
  .loading_C {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }

  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;

    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 30px;
      text-align: center;

      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;

        &.icon0 {
          bg-image('first');
        }

        &.icon1 {
          bg-image('second');
        }

        &.icon2 {
          bg-image('third');
        }
      }

      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }

    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        no-wrap();
        color: $color-text;
      }

      .desc {
        no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>

