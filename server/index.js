const userApi = require("./api/userApi")
const express = require('express')
const fs = require('fs');
const path = require('path');
const app = express();


app.use('/api/user', userApi)

app.listen(3000);
console.log('success listen at port:3000....')