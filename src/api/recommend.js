import jsonp from 'common/js/jsonp.js'
import { Config, options } from './config.js'
import axios from 'axios'

export function GetRecommend() {
    const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    const data = Object.assign({}, Config, {
        platform: 'h5',
        uin: 0,
        needNewCode: 1
    })
    return jsonp(url, data, options)
}

export function GetDiscList() {
    const url = '/api/GetDiscList'
    const data = Object.assign({}, Config, {
        platform: 'yqq',
        loginUin: 0,
        hostUin: 0,
        sortId: 5,
        sin: 0,
        ein: 29,
        needNewCode:0,
        categoryId:10000000,
        rnd:Math.random(),
        format:'json'
    })

    return axios.get(url,{
        params:data
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
}

export function GetSongLyric(SongId) {
    const url = '/api/GetSongLyric'
    const data = Object.assign({}, Config, {
        songmid:SongId,
        g_tk:'1269871871',
        platform:'yqq',
        needNewCode:0,
        format:'json'
    })

    return axios.get(url,{
        params:data
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
}
export function GetPlayListInfo(DissId){
    const url = '/api/GetPlayListInfo'
    const data = Object.assign({}, Config, {
        type:1,
        json:1,
        utf8:1,
        disstid:DissId,
        g_tk:'1269871871',
        platform:'yqq',
        format:'json',
        onlysong:0
    })

    return axios.get(url,{
        params:data
    }).then((res)=>{
        return Promise.resolve(res.data)
    })
}