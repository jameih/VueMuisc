import storage from 'good-storage'

let FAVORITE_KEY = '__favo__'

let LATELYLISTEN_KEY = '__play__'

export const getlatelylist = function () {
  return storage.get(LATELYLISTEN_KEY, [])
}

export const getfavolist = function () {
  return storage.get(FAVORITE_KEY, [])
}

export const AddlatelySong = function (song) {
  let nowSonglist = storage.get(LATELYLISTEN_KEY, [])
  let index = nowSonglist.findIndex((ele) => {
    return ele.id === song.id
  })
  index != -1 ? nowSonglist.splice(index, 1) : ''
  nowSonglist.unshift(song)
  storage.set(LATELYLISTEN_KEY, nowSonglist)
  return nowSonglist
}

export const AddResultSong = function (song) {
  let nowSonglist = storage.get(FAVORITE_KEY, [])
  nowSonglist.unshift(song)
  storage.set(FAVORITE_KEY, nowSonglist)
  return nowSonglist
}

export const DeleteResultSong = function (song) {
  let nowSonglist = storage.get(FAVORITE_KEY, [])

  let index = nowSonglist.findIndex((ele) => {
    return ele.id === song.id
  })
  nowSonglist.splice(index, 1)
  storage.set(FAVORITE_KEY, nowSonglist)
  return nowSonglist
}
