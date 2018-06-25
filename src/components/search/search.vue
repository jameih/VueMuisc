<template>
  <div class="search">
    <div class="search-box-wrapper">
      <searchbox ref="searchbox" @GetSearchConResult='GetSearchConResult'></searchbox>
    </div>
    <div class="shortcut-wrapper" v-show="!SearchresultCon.length">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li @click="GetSearchConResult(item.k,true)" class="item" v-for='item in hotItem'>
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history">
          <ul></ul>
        </div>
      </div>
    </div>
    <div class="search-result" ref="searchresult"v-show="SearchresultCon.length">
        <scroll :listenScroll="listenScroll" @scroll="scroll"  class="suggest" ref="suggest":data="SearchresultCon">
          <ul ref="suggestList"  class="suggest-list" >
            <li @click="SearchListClick(item)" v-for="item in SearchresultCon" class="suggest-item">
              <div class="icon">
                <i :class="getSearchiCon(item)"></i>
              </div>
              <div class="name">
                <p class="text">{{ getSearchSinger(item) }}</p>
              </div>
            </li>
            <loading v-show="loadingShow" :title='loadingTitle'></loading>
          </ul>
        </scroll>
    </div>
  </div>
</template>
<script>
import { GetHotSearchItem, GetSearchCon } from "api/search.js";
import { ErrOk } from "api/config.js";
import searchbox from "base/search_box.vue";
import scroll from "base/scroll.vue";
import { createSong } from "common/js/song.js";
import loading from "base/loading.vue";
import musiclist from "../musiclist/musiclist.vue";
import { playListMixin } from "common/js/mixins.js";
import { mapMutations, mapGetters, mapActions } from "vuex";
export default {
  mixins: [playListMixin],
  data() {
    return {
      hotItem: [],
      SearchresultCon: [],
      listenScroll: true,
      loadingTitle: "",
      loadingShow: false,
      SearchTxt: "",
      SearchPage: 1
    };
  },
  components: {
    searchbox,
    scroll,
    loading
  },
  computed: {
    ...mapGetters(["singer"])
  },
  methods: {
    handlerList() {
      this.$refs.searchresult.style.bottom =
        this.playList.length > 0 ? "60px" : "";
      this.$refs.suggest.refresh();
    },
    GetSearchConResult(txt, hotkey = false) {
      hotkey ? (this.$refs.searchbox.showDismiss = txt) : "";
      if (!txt) {
        this.SearchresultCon = [];
        this.SearchPage = 1;
      }

      this.SearchTxt = txt;
      GetSearchCon(txt, this.SearchPage).then(res => {
        if (res.code === ErrOk) {
          this.SearchresultCon = res.data.song.list;
          res.data.zhida.type && this.SearchresultCon.unshift(res.data.zhida);
          this.$nextTick(() => {
            this.$refs.suggest.refresh();
          });
        }
      });
    },
    getSearchSinger(item) {
      let singer;
      if (item.singer) {
        singer = `${item.songname} -`;
        item.singer.forEach(ele => {
          singer += ` ${ele.name}`;
        });
      } else {
        singer = item.singername;
      }
      return singer;
    },
    getSearchiCon(item) {
      return item.songname ? "icon-music" : "icon-mine";
    },
    scroll(pos) {
      this.loadingShow = true;
      GetSearchCon(this.SearchTxt, ++this.SearchPage).then(res => {
        if (res.code === ErrOk) {
          this.SearchresultCon = this.SearchresultCon.concat(
            res.data.song.list
          );
          setTimeout(() => {
            this.loadingShow = false;
          }, 200);
        }
      });
    },
    SearchListClick(item) {
      // 搜索点击的是歌手
      if (item.singermid) {
        let items = this._noramlList(item);
        this.$router.push({
          path: `/singer/${items.id}`
        });
        this.SET_SINGER(items);
      } else {
        // 搜索点击的是歌曲
        this.insertSong(createSong(item));
      }
      this.$refs.searchbox.showDismiss = "";
    },
    _noramlList(item) {
      return {
        id: item.singermid,
        imgSrc: `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.singermid}.jpg?max_age=2592000`,
        name: item.singername
      };
    },
    ...mapMutations(["SET_SINGER"]),
    ...mapActions(["insertSong"])
  },
  mounted() {
    GetHotSearchItem().then(res => {
      if (res.code === ErrOk) {
        res.data.hotkey.forEach(function(ele, index) {
          if (index > 8) {
            return;
          } else {
            this.hotItem.push(ele);
          }
        }, this);
      }
    });
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search {
  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 178px;
    bottom: 0;
    width: 100%;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 20px 20px 20px;

        .title {
          margin-bottom: 20px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .item {
          display: inline-block;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border-radius: 6px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }

      .search-history {
        position: relative;
        margin: 0 20px;

        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;

          .text {
            flex: 1;
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
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;

    .suggest {
      height: 100%;
      overflow: hidden;

      .suggest-list {
        padding: 0 30px;

        .suggest-item {
          display: flex;
          align-items: center;
          padding-bottom: 20px;
        }

        .icon {
          flex: 0 0 30px;
          width: 30px;

          [class^='icon-'] {
            font-size: 14px;
            color: $color-text-d;
          }
        }

        .name {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
          overflow: hidden;

          .text {
            no-wrap();
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
  }
}
</style>


