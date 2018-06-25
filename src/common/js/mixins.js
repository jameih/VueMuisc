import {
  mapGetters,
  mapMutations
} from 'vuex'
import {
  getfavolist,
  AddResultSong,
  DeleteResultSong,
  AddlatelySong
} from "common/js/cache.js";
export const playListMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlerList(this.playList)
  },
  activated() {
    this.handlerList(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlerList(newVal)
    }
  },
  methods: {
    handlerList() {
      throw new Error('必须重写handlerList')
    }
  }

}

export const playerlateMixin = {
  methods: {
    addsong(song) {
        this.SET_LATELYLIST(AddlatelySong(song))
    },
    ...mapMutations(['SET_LATELYLIST'])
  }
}

export const playerfavoMixin = {
  computed: {
    ...mapGetters([
      'favouriteList'
    ])
  },
  methods: {
    getLikeType(song) {
      let index = this.favouriteList.findIndex(ele => {
        return ele.id === song.id;
      });
      return index > -1 ? "icon-favorite" : "icon-not-favorite";
    },
    toggleLikeType(song) {
      if (!this.CheckFavoList(song)) {
        this.SET_FAVOURITELIST(AddResultSong(song));
      } else {
        this.SET_FAVOURITELIST(DeleteResultSong(song));
      }
    },
    CheckFavoList(song) {
      let index = this.favouriteList.findIndex(ele => {
        return ele.id === song.id;
      });
      return index > -1;
    },
    ...mapMutations([
      'SET_FAVOURITELIST'
    ])
  }
}
