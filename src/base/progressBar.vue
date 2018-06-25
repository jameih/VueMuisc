<template>
    <div class="progress-bar" ref="progressBar" @click="_ReachSongPlace">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent.stop="_TouchMoveStart" @touchmove.prevent.stop="_TouchMove" @touchend.prevent.stop="_TouchMoveEnd">
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>
<script>
const BtnWidth = 16
export default {
    data() {
        return {
            touch: {}
        }
    },
    props: {
        precent: {
            type: Number,
            default: 0
        }
    },
    methods: {
        _ReachSongPlace(e) {
            let rectLeft = this.$refs.progressBar.getBoundingClientRect().left;
            let offsetLeft = e.pageX - rectLeft
            this._offsetClient(offsetLeft)
            this.PrecentSong()
        },
        _TouchMoveStart(e) {
            this.MoveFlag = true
            this.touch.x1 = e.touches[0].pageX
            this.touch.Prowidth = this.$refs.progress.clientWidth
        },
        _TouchMove(e) {
            if (!this.MoveFlag) { return; }
            let moveChange = e.touches[0].pageX - this.touch.x1;
            let nowMove = moveChange + this.touch.Prowidth
            this._offsetClient(nowMove)
        },
        _TouchMoveEnd(e) {
            this.MoveFlag = false
            this.PrecentSong()

        },
        _offsetClient(width) {
            width = Math.max(width, 0)
            const BarWidth = this.$refs.progressBar.offsetWidth
            width = width >= BarWidth ? BarWidth : width
            const pre = width / BarWidth
            this.$refs.progress.style.width = (BarWidth - BtnWidth) * pre + 'px'
            this.$refs.progressBtn.style.transform = `translate3d(${(BarWidth - BtnWidth) * pre}px,0,0)`
        },
        PrecentSong() {
            const ProWidth = this.$refs.progress.clientWidth
            const BarWidth = this.$refs.progressBar.offsetWidth - BtnWidth
            this.$emit('ReachSongEvery', ProWidth / BarWidth)
        }
    },
    watch: {
        precent(newVal) {
            if (this.MoveFlag) {
                return;
            }
            const BarWidth = this.$refs.progressBar.offsetWidth
            this.$refs.progress.style.width = (BarWidth - BtnWidth) * newVal + 'px'
            this.$refs.progressBtn.style.transform = `translate3d(${(BarWidth - BtnWidth) * newVal}px,0,0)`
        }
    }
}
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.progress-bar {
    height: 30px;

    .bar-inner {
        position: relative;
        top: 13px;
        height: 4px;
        background: rgba(0, 0, 0, 0.3);

        .progress {
            position: absolute;
            height: 100%;
            background: $color-theme;
        }

        .progress-btn-wrapper {
            position: absolute;
            left: -8px;
            top: -13px;
            width: 30px;
            height: 30px;

            .progress-btn {
                position: relative;
                top: 7px;
                left: 7px;
                box-sizing: border-box;
                width: 16px;
                height: 16px;
                border: 3px solid $color-text;
                border-radius: 50%;
                background: $color-theme;
            }
        }
    }
}
</style>

