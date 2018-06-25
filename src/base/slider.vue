<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot>
            </slot>
        </div>
        <div class="dots">
            <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex===index}"></span>
        </div>
    </div>
</template>
<script>
import BScroll from 'better-scroll'
import { addClass, hasClass } from 'common/js/dom.js'
export default {
    data() {
        return {
            dots: [],
            currentPageIndex: 0
        }
    },
    props: {
        loop: { //是否循环播放
            type: Boolean,
            default: true
        },
        autoPlay: { //是否自动播放
            type: Boolean,
            default: true
        },
        interval: {
            type: Number,
            default: 2500
        }
    },
    mounted() {
        setTimeout(() => {
            this._setSilderWidth();
            this._initDots();
            this._initSlider();

            if (this.autoPlay) {
                this._play();
            }
        }, 20)

        window.addEventListener('resize', () => {
            if (!this.slider) { return }
            this._setSilderWidth(true);
            this.slider.refresh()
        })
    },
    methods: {
        //设置窗口大小
        _setSilderWidth(isResize) {

            this.children = this.$refs.sliderGroup.children;
            let Cwidth = 0;

            let SliderWidth = this.$refs.slider.clientWidth;
            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i];
                addClass(child, 'slider-item');
                child.style.width = SliderWidth + "px";
                Cwidth += SliderWidth;
            }

            if (this.loop && !isResize) {
                Cwidth += 2 * SliderWidth
            }
            this.$refs.sliderGroup.style.width = Cwidth + "px"
        },
        //初始化banner动画
        _initSlider() {
            this.slider = new BScroll(this.$refs.slider, {
                scrollX: true,
                scrollY: false,
                momentum: false,
                snap: true,
                snapLoop: this.loop,
                snapThreshold: 0.3,
                snapSpeed: 400,
                click: true
            });

            this.slider.on("scrollEnd", () => {
                if (this.loop) {
                    this.currentPageIndex = this.slider.getCurrentPage().pageX - 1
                }
                if (this.autoPlay) {
                    clearTimeout(this.timer);
                    this._play();
                }
            })
        },
        //初始化banner循环点击点
        _initDots() {
            this.dots = new Array(this.children.length);
        },
        //自动播放
        _play() {
            let pageIndex = this.currentPageIndex + 1;
            if (this.loop) {
                pageIndex++;
            }
            this.timer = setTimeout(() => {
                this.slider.goToPage(pageIndex, 0, 400);
            }, this.interval)
        }
    },
    destroyed() {
        clearTimeout(this.timer);
    }
}
</script>
<style <style lang="stylus" scoped>
 @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>




