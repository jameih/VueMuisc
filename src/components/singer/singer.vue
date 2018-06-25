<template>
  <div class="singer" ref="singer">
    <listView @select="_selectSinger" ref="list" :data="singer">

    </listView>
    <router-view>
      
    </router-view>
  </div>
</template>
<script>
import { getsingerList } from 'api/singger.js'
import { ErrOk } from 'api/config.js'
import Singer from 'common/js/singer.js'
import listView from 'base/listview'
import { mapMutations, mapGetters } from 'vuex'
import { playListMixin } from 'common/js/mixins.js'
const hot_name = "热门"
const hot_len = 10
export default {
  mixins: [playListMixin],
  data() {
    return {
      singer: []
    }
  },
  mounted() {
    this._getsingerList();
  },
  methods: {
    handlerList() {
      let bottom = this.playList.length > 0 ? '60px' : '0'
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh();
    },
    _selectSinger(Csinger) {
      this.$router.push({
        path: `/singer/${Csinger.id}`
      });
      this.setSinger(Csinger);
    },
    _getsingerList() {
      getsingerList().then((res) => {
        if (ErrOk === res.code) {
          this.singer = this._normalSinger(res.data.list);
        }
      })
    },
    _normalSinger(list) {
      let map = {
        hot: {
          title: hot_name,
          item: []
        }
      }
      list.forEach(function(item, index) {
        //热门歌手 
        if (index < hot_len) {
          map.hot.item.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        const key = item.Findex == 9 ? "*" : item.Findex;
        //查询map下有没有当前歌手名字对应的拼音首写 没有的话就创建
        if (!map[key]) {
          map[key] = {
            title: key,
            item: []
          }
        }


        //将歌手信息push到对应的首写数组里
        map[key].item.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      }, this);
      //得到有序列表 对map对象进行处理
      let hot = []
      let rel = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          rel.push(val);
        } else if (val.title == hot_name) {
          hot.push(val);
        }
      }
      //对title进行字母的升序
      rel.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(rel);
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    listView
  }
}
</script>
<style lang="stylus" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>


