<template>
    <transition name="side">
        <musiclist :songs='songs' :title='title' :bgimage='bgimage'></musiclist>
    </transition>
</template>
<script>
import musiclist from '../musiclist/musiclist'
import { mapGetters, mapState } from 'vuex'
import { getsinglistselft } from 'api/singger.js'
import { ErrOk } from 'api/config.js'
import { createSong } from 'common/js/song.js'

export default {
    data() {
        return {
            songs: []
        }
    },
    components: {
        musiclist
    },
    computed: {
        title() {
            return this.singer.name
        },
        bgimage() {
            return this.singer.imgSrc
        },
        ...mapGetters([
            'singer'
        ])
    },
    created() {
    },
    methods: {
        _getSingDetail() {
            if (!this.singer.id) {
                this.$router.push('/singer');
                return
            }
            getsinglistselft(this.singer.id).then((res) => {
                if (res.code == ErrOk) {
                    this._noramlListSong(res.data.list)
                }
            })
        },
        _noramlListSong(list) {
            let song = [];
            list.forEach(function(ele) {
                this.songs.push(createSong(ele.musicData))
            }, this);
        }
    },
    mounted() {
        this._getSingDetail()
    }
}
</script>
<style lang="stylus" scoped>
    @import '~common/stylus/variable'
  
    .side-enter-active, .side-leave-active
        transition: all 0.3s

    .side-enter, .side-leave-to
        transform: translate3d(100%, 0, 0)
</style>

