const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);

server.listen(3001, function(){
    console.log('Client is available at http://localhost:3001');
});
