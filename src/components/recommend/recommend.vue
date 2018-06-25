<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="DiscList">
      <div>
        <div v-if="recommendList.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommendList">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="chickenMusic">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in DiscList" class="item" @click="RouterToSinger(item)">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.imgurl" alt="">
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view>

    </router-view>
    <div class="loading_C" v-show="!DiscList.length">
      <loading></loading>
    </div>
  </div>
</template>
<script>
//引用组件
import loading from 'base/loading'
import slider from 'base/slider'
import scroll from 'base/scroll'
import { GetRecommend, GetDiscList } from 'api/recommend.js'
import { ErrOk } from 'api/config.js'
import { playListMixin } from 'common/js/mixins.js'
import { mapGetters,mapMutations } from 'vuex'
export default {
  mixins: [playListMixin],
  data() {
    return {
      recommendList: [],
      DiscList: []
    }
  },
  created() {

  },
  computed:{
    ...mapGetters([
      'playlistinfo'
    ])
  },
  methods: {
    handlerList() {
      let bottom = this.playList.length > 0 ? '60px' : '0'
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh();
    },
    RouterToSinger(PlayListinfo){
      this.SET_PLAYLISTINFO(PlayListinfo);
      this.$router.push({
        path:`/recommend/${this.playlistinfo.dissid}`
      })
    },
    ...mapMutations([
      'SET_PLAYLISTINFO'
    ])
  },
  components: {
    slider,
    scroll,
    loading
  },
  mounted: function() {

    GetRecommend().then((res) => {
      if (res.code === ErrOk) {
        this.recommendList = res.data.slider;
      }
    })
    GetDiscList().then((res) => {
      if (res.code === ErrOk) {
        this.DiscList = res.data.list;
      }
    })
  }


}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }
  }
}

.loading_C {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>


