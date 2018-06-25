import { playmode } from 'common/js/config.js'
import { getfavolist, getlatelylist } from 'common/js/cache.js'

//全局管理数据
const state = {
    singer: {},//  歌手信息
    playing: false, //暂停or播放
    fullScreen: false, //是否全屏播放
    playList: [], //播放列表
    sequenceList: [], //不同播放形式的歌曲排序
    playMode: playmode.sequence, //播放形式
    currentIndex: -1,
    playlistinfo: {},//歌单信息
    toplistInfo: {},
    favouriteList: getfavolist(),
    historylist: getlatelylist()
}
export default state