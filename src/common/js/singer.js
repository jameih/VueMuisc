export default class singer {
    constructor(item) {
        this.id = item.id
        this.name = item.name
        this.imgSrc = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${item.id}.jpg?max_age=2592000`
    }
}