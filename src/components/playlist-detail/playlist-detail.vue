<template>
    <transition name="side">
        <musiclist :songs='songs' :title='title' :bgimage='bgimage'></musiclist>
    </transition>
</template>
<script>
import musiclist from '../musiclist/musiclist'
import { mapGetters, mapState } from 'vuex'
import { GetPlayListInfo } from 'api/recommend.js'
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
            return this.playlistinfo.dissnamehhhjjjn
        },
        bgimage() {
            return this.playlistinfo.imgurl
        },
        ...mapGetters([
            'playlistinfo'
        ])
    },
    created() {

    },
    methods: {
        _getPlayListDetail() {
            if (!this.playlistinfo.dissid) {
                this.$router.push('/recommend')
            } else {
                GetPlayListInfo(this.playlistinfo.dissid).then((res) => {
                    this._noramlListSong(res.cdlist[0].songlist)
                })
            }
        },
        _noramlListSong(list) {
            let song = [];
            list.forEach(function(ele) {
                this.songs.push(createSong(ele))
            }, this);
        }

    },
    mounted() {
        this._getPlayListDetail()
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

