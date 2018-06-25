import * as types from './mutation-type.js'

const mutations = {
    [types.SET_SINGER](state,singer){
        state.singer = singer; 
    },
    [types.SET_PLAYING](state,playing){
        state.playing = playing
    },
    [types.SET_FULLSCREEN](state,fullscreen){
        state.fullScreen = fullscreen
    },
    [types.SET_PLAYLIST](state,playlist){
        state.playList = playlist
    },
    [types.SET_SEQUENCELIST](state,sequencelist){
        state.sequenceList = sequencelist
    },
    [types.SET_PLAYMODE](state,playmode){
        state.playMode = playmode
    },
    [types.SET_CURRENINDEX](state,currentIndex){
        state.currentIndex = currentIndex
    },
    [types.SET_PLAYLISTINFO](state,playlistinfo){
        state.playlistinfo = playlistinfo
    },
    [types.SET_TOPLISTINFO](state,toplistInfo){
        state.toplistInfo = toplistInfo
    },
    [types.SET_FAVOURITELIST](state,favouriteList){
        state.favouriteList = favouriteList
    },
    [types.SET_LATELYLIST](state,historylist){
        state.historylist = historylist
    }
}

export default mutations