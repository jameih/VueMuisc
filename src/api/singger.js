import jsonp from 'common/js/jsonp.js'
import { Config, options } from './config.js'
import axios from 'axios'

export function getsingerList() {
    const url = "https://c.y.qq.com/v8/fcg-bin/v8.fcg";

    const data = Object.assign({}, Config, {
        channel: "singer",
        page: "list",
        key: "all_all_all",
        pagesize: 100,
        pagenum: 1,
        loginUin: 0,
        hostUin: 0,
        platform: "yqq",
        needNewCode: 0
    });
    return jsonp(url, data, options);
}

export function getsinglistselft(singerId) {
    const url = "https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg"

    const data = Object.assign({},Config,{
        g_tk:1437282604,
        platform:'yqq',
        needNewCode:0,
        singermid:singerId,
        order:'listen',
        begin:0,
        num:100,
        songstatus:1
    });
    return jsonp(url,data,options);
}