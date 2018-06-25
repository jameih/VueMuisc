<template>
    <transition name="side">
        <musiclist :rank="rank" :songs='songs' :title='title' :bgimage='bgimage'></musiclist>
    </transition>
</template>
<script>
import musiclist from '../musiclist/musiclist'
import { ErrOk } from 'api/config.js'
import { mapGetters } from 'vuex'
import { GetEveryToplist } from 'api/rank.js'
import { createSong } from 'common/js/song.js'
export default {
    data() {
        return {
            songs: [],
            rank:true
        }
    },
    methods: {
        _GetEveryToplist() {
            if (!this.toplistInfo.id) {
                this.$router.push('/rank')
            } else {
                GetEveryToplist(this.toplistInfo.id).then((res) => {
                    if (res.code === ErrOk) {
                        this._normalTopList(res.songlist)
                    }
                })
            }
        },
        _normalTopList(list) {
            console.log(list);
            list.forEach(function(ele, index) {
                this.songs.push(createSong(ele.data))
            }, this);
        }
    },
    computed: {
        title() {
            return this.toplistInfo.topTitle
        },
        bgimage() {
            return this.toplistInfo.picUrl
        },
        ...mapGetters([
            'toplistInfo'
        ])
    },
    components: {
        musiclist
    },
    mounted() {
        this._GetEveryToplist()
    }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.side-enter-active, .side-leave-active {
    transition: all 0.3s;
}

.side-enter, .side-leave-to {
    transform: translate3d(100%, 0, 0);
}
</style>

