module.exports = {
    //用户数据操作
    user: {
        add: 'insert into user( username, password) values ( ?, ?)',
        select: 'select * from user'
    }
}