import ResultJsonp from 'jsonp'

export default function jsonP(url, data, option) {
    url += url.indexOf('?') < 0 ? "?" + param(data) : param(data);
    return new Promise((resolve, reject) => {
        ResultJsonp(url, option, (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err);
            }
        })
    })
}
//拼接url参数
function param(data) {
    let url = '';
    for (var a in data) {
        let value = data[a] !== undefined ? data[a] : '';
        url += '&' + a + '=' + encodeURIComponent(value)
    }
    return url ? url.substring(1) : '';
}