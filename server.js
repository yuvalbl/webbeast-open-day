const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);

// serve client files
app.use('/client/public', express.static(path.join(__dirname + '/client/public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/public/index.html'))
});

server.listen(3001, function(){
    console.log('Client is available at http://localhost:3001');
});
