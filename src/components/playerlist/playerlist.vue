<template>
  <transition name="list-fade">
    <div class="playlist" @click.prevent="hide" v-show="ShowFlag">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="GetMode" @click="ChangeMode"></i>
            <span class="text" v-text="GetModeText"></span>
            <span class="clear" @click.stop="ClearSongList">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
         <scroll :data="sequenceList" ref="listContent" class="list-content":refreshDelay="refreshDelay">
           <ul ref="list">
             <li class="item" v-for="(item,index) in sequenceList">
              <i class="current" :class="getPlayiCon(item)"></i>
              <span class="text" @click="PlayCheckSong(item)">{{item.name}}</span>
              <span class="like"  @click="toggleLikeType(item)">
                <i :class="getLikeType(item)"></i>
              </span>
              <span class="delete" @click="DeleteCheckSong(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
           </ul>
        </scroll> 
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="DeleteSongList" text="是否清空播放列表" confirmBtnText="清空"></confirm>
    </div>
  </transition>
</template>
<script>
import scroll from "base/scroll.vue";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { playmode } from "common/js/config.js";
import { Shuffle } from "common/js/until.js";
import confirm from "base/confirm.vue";
import { playerfavoMixin } from 'common/js/mixins.js'
export default {
  mixins:[playerfavoMixin],
  data() {
    return {
      ShowFlag: false,
      refreshDelay: 120
    };
  },
  computed: {
    GetMode() {
      return this.playMode === playmode.sequence
        ? "icon-sequence"
        : this.playMode === playmode.loop ? "icon-loop" : "icon-random";
    },
    GetModeText() {
      return this.playMode === playmode.sequence
        ? "循环播放"
        : this.playMode === playmode.loop ? "单曲循环" : "随机播放";
    },
    ...mapGetters([
      "playList",
      "playMode",
      "sequenceList",
      "currentIndex",
      "playMode",
      "currentSong",
      "favouriteList"
    ])
  },
  methods: {
    show() {
      this.ShowFlag = true;
      setTimeout(() => {
        this.$refs.listContent.refresh();
        this.GotoSongListEvery();
      }, 130);
    },
    hide() {
      this.ShowFlag = false;
    },
    ClearSongList() {
      this.$refs.confirm.show();
    },
    DeleteSongList() {
      this.ShowFlag = false;
      this.deleteSongList();
    },
    DeleteCheckSong(item) {
      this.deleteSong(item);
    },
    GotoSongListEvery() {
      let index = this.sequenceList.findIndex(ele => {
        return ele.id === this.currentSong.id;
      });
      this.$refs.listContent.scrollToElement(
        this.$refs.list.children[index],
        480
      );
    },
    ChangeMode() {
      let list = this.sequenceList;
      let NextPlayMode = (this.playMode + 1) % 3;
      this.SET_PLAYMODE(NextPlayMode);
      if (NextPlayMode === playmode.random) {
        list = Shuffle(list);
      }
      this.ResetCurrentSong(list);
      this.SET_PLAYLIST(list);
    },
    getPlayiCon(item) {
      if (item.id === this.currentSong.id) {
        return "icon-play";
      } else {
        return "";
      }
    },
    ResetCurrentSong(list) {
      let index = list.findIndex(item => {
        return item.id == this.currentSong.id;
      });
      this.SET_CURRENINDEX(index);
    },
    PlayCheckSong(item) {
      let index = this.playList.findIndex(ele => {
        return ele.id == item.id;
      });
      this.SET_CURRENINDEX(index);
      this.GotoSongListEvery();
    },
    ...mapMutations([
      "SET_PLAYMODE",
      "SET_CURRENINDEX",
      "SET_PLAYLIST",
      "SET_FAVOURITELIST"
    ]),
    ...mapActions(["deleteSongList", "deleteSong"])
  },
  components: {
    scroll,
    confirm
  },
  mounted() {},
  watch: {
    sequenceList() {}
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;

  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity 0.3s;

    .list-wrapper {
      transition: all 0.3s;
    }
  }

  &.list-fade-enter, &.list-fade-leave-to {
    opacity: 0;

    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }

  &.list-fade-enter, .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $color-highlight-background;

    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;

      .title {
        display: flex;
        align-items: center;

        .icon {
          margin-right: 10px;
          font-size: 30px;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .clear {
          extend-click();

          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }

    .list-content {
      max-height: 240px;
      overflow: hidden;

      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;

        &.list-enter-active, &.list-leave-active {
          transition: all 0.1s;
        }

        &.list-enter, &.list-leave-to {
          height: 0;
        }

        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }

        .text {
          flex: 1;
          no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }

        .like {
          extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;

          .icon-favorite {
            color: $color-sub-theme;
          }
        }

        .delete {
          extend-click();
          font-size: $font-size-small;
          color: $color-theme;
        }
      }
    }

    .list-operate {
      width: 140px;
      margin: 20px auto 30px auto;

      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;

        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }

        .text {
          font-size: $font-size-small;
        }
      }
    }

    .list-close {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
