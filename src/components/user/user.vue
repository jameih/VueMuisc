<template>
    <transition name="slide">
    <div class="user-center">
        <div class="back" @click="Goback">
            <i class="icon-back" ></i>
        </div>
        <div class="switches-wrapper">
            <ul class="switches">
                <li :class="{'active':index===SwithchCheckIndex}" @click="SwitchItem(index)" class="switch-item" v-for="(item,index) in SwitchTxt">
                    <span>{{item.title}}</span>
                </li>
            </ul>
        </div>
        <div class="play-btn" @click="RandomPlay">
            <i class="icon-play"></i>
            <span class="text">随机播放全部</span>
        </div>
        <div class="list-wrapper" ref="listWrapper">
            <scroll ref="favolist" class="list-scroll" :data="favouriteList" v-if="SwithchCheckIndex===0">
                <div class="list-inner">
                    <songlist :songs="favouriteList" @select="selectItem"></songlist>
                </div>
            </scroll>
            <scroll ref="latelylist" class="list-scroll" :data="historylist" v-if="SwithchCheckIndex===1">
                <div class="list-inner">
                    <songlist :songs="historylist" @select="selectItem"></songlist>
                </div>
            </scroll>
        </div>
    </div>
    </transition>
</template>
<script>
import songlist from "base/song-list/song-list.vue";
import scroll from "base/scroll.vue";
import Song from "common/js/song.js";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { playListMixin } from "common/js/mixins.js";
export default {
  mixins: [playListMixin],
  data() {
    return {
      SwitchTxt: [
        {
          title: "我喜欢的"
        },
        {
          title: "最近听的"
        }
      ],
      SwithchCheckIndex: 0
    };
  },

  methods: {
    noResult() {
      if (this.SwithchCheckIndex === 0) {
         
      }
    },
    Goback() {
      this.$router.go(-1);
    },
    SwitchItem(index) {
      this.SwithchCheckIndex = index;
    },
    selectItem(item, index) {
      this.insertSong(new Song(item));
    },
    RandomPlay() {
      let list = [];
      (this.SwithchCheckIndex == 0
        ? this.favouriteList
        : this.historylist
      ).forEach(ele => {
        list.push(new Song(ele));
      });
      this.randomPlay({ list });
    },
    handlerList() {
      let bottom = this.playList.length > 0 ? "60px" : "";
      this.$refs.listWrapper.style.bottom = bottom;
      this.$refs.favolist && this.$refs.favolist.refresh();
      this.$refs.latelylist && this.$refs.latelylist.refresh();
    },
    ...mapActions(["insertSong", "randomPlay"])
  },
  mounted() {},
  computed: {
    ...mapGetters(["favouriteList", "historylist", "currentSong"])
  },
  components: {
    scroll,
    songlist
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.user-center {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 100;
    width: 100%;
    background: $color-background;

    &.slide-enter-active, &.slide-leave-active {
        transition: all 0.3s;
    }

    &.slide-leave-to {
        transform: translate3d(100%, 0, 0);
        opacity: 0;
    }

    &.slide-enter {
        transform: translate3d(100%, 0, 0);
    }

    .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
            display: block;
            padding: 10px;
            font-size: $font-size-large-x;
            color: $color-theme;
        }
    }

    .switches-wrapper {
        margin: 10px 0 30px 0;

        .switches {
            display: flex;
            align-items: center;
            width: 240px;
            margin: 0 auto;
            border: 1px solid $color-highlight-background;
            border-radius: 5px;

            .switch-item {
                flex: 1;
                padding: 8px;
                text-align: center;
                font-size: $font-size-medium;
                color: $color-text-d;

                &.active {
                    background: $color-highlight-background;
                    color: $color-text;
                }
            }
        }
    }

    .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-text-l;
        color: $color-text-l;
        border-radius: 100px;
        font-size: 0;

        .icon-play {
            display: inline-block;
            vertical-align: middle;
            margin-right: 6px;
            font-size: $font-size-medium-x;
        }

        .text {
            display: inline-block;
            vertical-align: middle;
            font-size: $font-size-small;
        }
    }

    .list-wrapper {
        position: absolute;
        top: 110px;
        bottom: 0;
        width: 100%;

        .list-scroll {
            height: 100%;
            overflow: hidden;

            .list-inner {
                padding: 20px 30px;
            }
        }
    }

    .no-result-wrapper {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>
