<template>
  <div class="rank" ref="rank">
    <scroll :data="Toplist" class="toplist" ref="toplist">
      <ul>
        <li class="item" v-for="item in Toplist">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" />
          </div>
          <ul class="songlist">
            <li @click="RouterMuiscList(item)" v-for="(songlist,index) in item.songList" class="song">
              <span>{{index+1}}</span>
              <span>{{songlist.songname}}-{{songlist.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <loading v-show="!Toplist.length" class="loading-container">
    </loading>
    <router-view>

    </router-view>
  </div>
</template>
<script>
import scroll from 'base/scroll.vue'
import { GetTopList } from 'api/rank.js'
import { ErrOk } from 'api/config.js'
import { playListMixin } from 'common/js/mixins.js'
import Loading from 'base/loading.vue'
import { mapMutations } from 'vuex'
export default {
  mixins: [playListMixin],
  data() {
    return {
      Toplist: []
    }
  },
  mounted() {
    this._GetTopList()
  },
  methods: {
    RouterMuiscList(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      });
      this.SET_TOPLISTINFO(item)
    },
    handlerList() {
      let bottom = this.playList.length > 0 ? '60px' : '0';
      this.$refs.rank.style.bottom = bottom;
      this.$refs.toplist.refresh();
    },
    _GetTopList() {
      GetTopList().then((res) => {
        if (res.code === ErrOk) {
          this.Toplist = res.data.topList
        }
      })
    },
    ...mapMutations([
      'SET_TOPLISTINFO'
    ])
  },
  components: {
    scroll,
    Loading
  }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .toplist {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;

      &:last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;

        .song {
          no-wrap();
          line-height: 26px;
        }
      }
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
  }
}
</style>



