import jsonp from 'common/js/jsonp.js'
import { Config, options } from './config.js'

export function GetHotSearchItem() {
    let url = "https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg"

    let datas = Object.assign({}, Config, {
        g_tk: 31970091,
        format: 'json',
        platform: 'yqq',
        needNewCode: 0
    })

    return jsonp(url, datas, options)
}

export function GetSearchCon(txt,SearchPage) {
    let url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

    let datas = Object.assign({}, Config, {
        g_tk: 1928093487,
        w: txt,
        p: SearchPage,
        perpage: 20,
        needNewCode: 1,
        sem: 1,
        flag: 1,
        t: 0,
        zhidaqu: 1,
        n: 20,
        catZhida: 1,
        remoteplace: 'txt.mqq.all',
        ie: 'utf-8'
    })

    return jsonp(url, datas, options)
}