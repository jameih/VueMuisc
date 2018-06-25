<template>
  <div class="player" v-show="playList.length>0">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.image" width="100%" height="100%">
        </div>
        <div class="top">
          <div class="back" @click="_PlayerWindowChange(false)">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle" @click="ShowMiddleLorR=!ShowMiddleLorR">

          <div class="middle-l" v-show="ShowMiddleLorR">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="[playing?'play':'play pause']">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <div class="playing-lyric-wrapper" v-show="CurrentSonglyric">
              <div class="playing-lyric" ref="playing-lyric">{{ShowSongLyric}}</div>
            </div>
          </div>
          <Scroll v-show="!ShowMiddleLorR" :data="CurrentSonglyric && CurrentSonglyric.lines" class="middle-r" ref="lyriclist">
            <div class="lyric-wrapper">
              <div v-if="CurrentSonglyric">
                <p ref="lyricline" class="text" :class="{'current': currentLineNum ===index}" v-for="(line,index) in CurrentSonglyric.lines">{{line.txt}}</p>
              </div>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{getMinSecond(currentTime)}}</span>
            <progressBar @ReachSongEvery="ReachSongEvery" :precent="precent" class="progress-bar-wrapper">
            </progressBar>
            <span class="time time-r">{{getMinSecond(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="iconMode" @click="_SwitchPlayMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="_SongPrev"></i>
            </div>
            <div class="icon i-center">
              <i @click="_ChangePlaying" :class="[playing?'icon-pause':'icon-play']"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="_SongNext"></i>
            </div>
            <div class="icon i-right" @click="toggleLikeType(currentSong)">
              <i class="icon" :class="getLikeType(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" @click="_PlayerWindowChange(true)" v-show="!fullScreen">
        <div class="icon">
          <img :class="[playing?'play':'play pause']" :src="currentSong.image" width="40" height="40">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i @click.stop.prevent="_ChangePlaying" class="icon-play-mini" :class="[playing?'icon-pause':'icon-play']"></i>
        </div>
        <div class="control">
          <i @click.stop.prevent="_ShowPlayerList" class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playerlist ref="playerlist"></playerlist>
    <audio @ended="_ChangeSong" ref="audio" :src="currentSong.url" @timeupdate="updateTime"></audio>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import progressBar from "base/progressBar.vue";
import { playmode } from "common/js/config.js";
import { Shuffle } from "common/js/until.js";
import Lyric from "lyric-parser";
import Scroll from "base/scroll.vue";
import { playListMixin, playerfavoMixin,playerlateMixin } from "common/js/mixins.js";
import playerlist from "@/components/playerlist/playerlist.vue";
export default {
  mixins: [playListMixin, playerfavoMixin,playerlateMixin],
  data() {
    return {
      songready: true,
      currentTime: 0,
      CurrentSonglyric: null,
      ShowSongLyric: "",
      currentShow: "cd",
      currentLineNum: 0,
      ShowMiddleLorR: true,
      ShowPlayList: false
    };
  },
  computed: {
    ...mapGetters([
      "fullScreen",
      "playing",
      "playList",
      "currentSong",
      "currentIndex",
      "playMode",
      "sequenceList"
    ]),
    precent() {
      return this.currentTime / this.currentSong.duration;
    },
    iconMode() {
      return this.playMode === playmode.sequence
        ? "icon-sequence"
        : this.playMode === playmode.loop ? "icon-loop" : "icon-random";
    }
  },
  mounted() {},
  methods: {
    handlerList() {
      let bottom = this.playList.length > 0 ? "60px" : "";
    },
    updateTime(e) {
      //console.log(e.target.currentTime)
      this.currentTime = e.target.currentTime;
    },
    getMinSecond(n) {
      n = n | 0;
      n =
        n / 60 >= 1
          ? parseInt(n / 60) + ":" + (n % 60 >= 10 ? n % 60 : "0" + n % 60)
          : "0:" + (n >= 10 ? n : "0" + n);
      return n;
    },
    _PlayerWindowChange(flag) {
      this.SET_FULLSCREEN(flag);
    },
    _ChangePlaying() {
      this.SET_PLAYING(!this.playing);
      this.CurrentSonglyric.togglePlay();
    },
    _SongPrev() {
      if (!this.songready) {
        return;
      }
      let NowNum =
        this.currentIndex - 1 < 0
          ? this.playList.length - 1
          : this.currentIndex - 1;
      this.SET_CURRENINDEX(NowNum);
      this.songready = false;
    },
    _SongNext() {
      if (!this.songready) {
        return;
      }
      let NowNum =
        this.currentIndex + 1 >= this.playList.length
          ? 0
          : this.currentIndex + 1;
      this.SET_CURRENINDEX(NowNum);
      this.songready = false;
    },
    ReachSongEvery(n) {
      //传过来的是百分比数
      this.currentTime = (n * this.currentSong.duration) | 0;
      this.$refs.audio.currentTime = this.currentTime;
      this.SET_PLAYING(true);
      if (this.CurrentSonglyric) {
        this.CurrentSonglyric.seek(this.currentTime * 1000);
      }
    },
    GetSongLyric() {
      this.currentSong.getLyric().then(
        res => {
          this.CurrentSonglyric = new Lyric(res, this.handlerLyric);
          this.playing && this.CurrentSonglyric.play();
        },
        rec => {
          console.log(rec);
        }
      );
    },
    handlerLyric({ lineNum, txt }) {
      this.$refs.lyriclist.refresh();
      this.currentLineNum = lineNum;
      this.ShowSongLyric = txt;

      if (lineNum > 5) {
        let LineEle = this.$refs.lyricline[lineNum - 5];
        this.$refs.lyriclist.scrollToElement(LineEle, 1000);
      } else {
        this.$refs.lyriclist.scrollTo(0, 0, 1000);
      }
    },
    _SwitchPlayMode() {
      let list = null;
      let oldList = this.sequenceList;
      let NextMode = (this.playMode + 1) % 3;
      this.SET_PLAYMODE(NextMode);
      if (NextMode === playmode.random) {
        list = Shuffle(oldList);
      } else {
        list = oldList;
      }
      this.ResetCurrentSong(list);
      this.SET_PLAYING(this.playing);
      this.SET_PLAYLIST(list);
    },
    ResetCurrentSong(list) {
      let index = list.findIndex(item => {
        return item.id == this.currentSong.id;
      });
      this.SET_CURRENINDEX(index);
    },
    _ChangeSong() {
      if (this.playMode === playmode.loop) {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
      } else {
        this._SongNext();
      }
    },
    _ShowPlayerList() {
      this.$refs.playerlist.show();
      this.ShowPlayList = !this.ShowPlayList;
    },
    ...mapMutations([
      "SET_FULLSCREEN",
      "SET_PLAYING",
      "SET_CURRENINDEX",
      "SET_PLAYMODE",
      "SET_PLAYLIST"
    ])
  },
  watch: {
    currentSong(newVal) {
      if (this.CurrentSonglyric) {
        this.CurrentSonglyric.stop();
        this.currentLineNum = 0;
        this.ShowSongLyric = "";
      }
      if (!this.playList.length) {
        this.SET_PLAYING(false);
        this.$refs.playerlist.ShowFlag = false;
        return;
      }
      this.$nextTick(() => {
        this.addsong(newVal)
        this.SET_PLAYING(true);
        this.$refs.audio.play();
        this.songready = true;
        this.GetSongLyric();
      });
    },
    playing(newVal) {
      this.$nextTick(() => {
        newVal ? this.$refs.audio.play() : this.$refs.audio.pause();
      });
    }
  },
  components: {
    progressBar,
    Scroll,
    playerlist
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        border-radius: 50%;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

