import { GetSongLyric} from 'api/recommend.js'
import { ErrOk } from 'api/config.js' 
import {Base64} from 'js-base64'
export default class Song {
    constructor(SongData) {
        this.id = SongData.songid || SongData.id
        this.mid = SongData.songmid || SongData.mid
        this.singer = SongData.singer
        this.name = SongData.name
        this.album = SongData.album
        this.duration = SongData.duration
        this.image = SongData.image
        this.url = SongData.url
    }
    getLyric(){
        if(this.lyric){
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve,reject)=>{
            GetSongLyric(this.mid).then((res)=>{
                if(res.retcode===ErrOk){     
                    this.lyric = Base64.decode(res.lyric)
                    resolve(this.lyric)
                }else{
                    reject('no lyric')
                }
            })
        })
    }
} 

export function createSong(MusicData) {
    return new Song({
        songid: MusicData.songid, //歌曲id
        songmid: MusicData.songmid,//歌曲mid
        singer: filterSinger(MusicData.singer),//歌手
        name: MusicData.songname,//歌名
        album: MusicData.albumname,//专辑
        duration: MusicData.interval,//时长
        image: `http://y.gtimg.cn/music/photo_new/T002R300x300M000${MusicData.albummid}.jpg?max_age=2592000`,
        url: `http://ws.stream.qqmusic.qq.com/${MusicData.songid}.m4a?fromtag=46`
    })
}


function filterSinger(singer) {
    if (!singer) {
        return ''
    }
    let sing = []
    singer.forEach(function (element) {
        sing.push(element.name);
    }, this);
    return sing.join('/')
}
