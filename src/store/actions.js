import * as types from './mutation-type'
import { playmode } from 'common/js/config.js'
import { Shuffle } from 'common/js/until.js'
export const selectPlay = function ({ commit, state }, { list, index }) {
    commit(types.SET_FULLSCREEN, true);
    commit(types.SET_PLAYING, true);
    commit(types.SET_SEQUENCELIST, list);
    if (state.playMode == playmode.random) {
        let ShuffleList = Shuffle(list)
        let Nindex = ShuffleList.findIndex((item) => {
            return item.id === list[index].id
        })
        commit(types.SET_PLAYLIST, ShuffleList);
        commit(types.SET_CURRENINDEX, Nindex);
    } else {
        commit(types.SET_PLAYLIST, list);
        commit(types.SET_CURRENINDEX, index);
    }
}
export const randomPlay = function ({ commit, state }, { list }) {
    commit(types.SET_PLAYMODE, playmode.random)
    commit(types.SET_FULLSCREEN, true);
    commit(types.SET_PLAYING, true);
    commit(types.SET_PLAYLIST, Shuffle(list));
    commit(types.SET_SEQUENCELIST, list);
    commit(types.SET_CURRENINDEX, 0);
}

export const deleteSongList = function ({ commit }) {
    commit(types.SET_CURRENINDEX, -1);
    commit(types.SET_PLAYING, false);
    commit(types.SET_SEQUENCELIST, []);
    commit(types.SET_PLAYLIST, []);
}

export const deleteSong = function ({ commit, state }, song) {
    let playlist = state.playList.slice()
    let sequencelist = state.sequenceList.slice()
    let playIndex = findindex(song, playlist)
    let sequenceIndex = findindex(song, sequencelist)
    playlist.splice(playIndex, 1)
    sequencelist.splice(sequenceIndex, 1)

    commit(types.SET_SEQUENCELIST, sequencelist);
    commit(types.SET_PLAYLIST, playlist);

    if (state.currentIndex > playlist.length - 1) {
        commit(types.SET_CURRENINDEX, playlist.length - 1);
    }
}

export const insertSong = function ({ commit, state }, song) {

    let playlist = state.playList.slice()
    let currentindex = state.currentIndex
    let Songindex = playlist.findIndex((ele) => {
        return ele.id === song.id
    })
    if (Songindex > -1) {
        commit(types.SET_CURRENINDEX, Songindex);
    } else {
        playlist.splice(currentindex > -1 ? currentindex + 1 : 0, 0, song)
        commit(types.SET_CURRENINDEX, currentindex > -1 ? currentindex + 1 : 0);
        commit(types.SET_PLAYLIST, playlist)
        commit(types.SET_SEQUENCELIST, playlist)
    }
    commit(types.SET_FULLSCREEN, true)
    commit(types.SET_PLAYING, true)
}

function findindex(song, list) {
    return list.findIndex((ele) => {
        return song.id === ele.id
    })
}