const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const drone = require('ar-drone').createClient({ip: '1.1.1.222'});

let winner_token = null;
const ANSWER_INDEX = require('./answer/answer').answerIndex;
const SPEED = .1;

// serve client files
app.use('/client/public', express.static(path.join(__dirname + '/client/public')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/public/index.html'))
});

app.get('/answer', function (req, res) {
    console.log('get-answer', req.query);

    if(req.query && req.query.option) {
        if(req.query.option == ANSWER_INDEX) {
            // correct answer
            if(winner_token === null) {
                // first correct answer
                winner_token = req.query['token'];
                res.sendFile(path.join(__dirname + '/client/drone/drone_controls.html'))
            } else {
                // not-first correct answer
                res.sendFile(path.join(__dirname + '/client/public/too_slow.html'))
            }
        } else {
            // wrong answer
            res.sendFile(path.join(__dirname + '/client/public/wrong_answer.html'))
        }
    } else {
        res.sendFile(path.join(__dirname + '/client/index.html'))
    }
});

// client - server socket communication
io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('move', function (move) {
        drone[move](SPEED);
        drone.after(200, drone.stop);
        console.log(`${move} at speed of ${SPEED}`);
    });

    socket.on('takeoff', function () {
        console.log('takeoff');

        drone.takeoff(function(){
            console.log('airbone');
        });
    });

    socket.on('land', function () {
        console.log('land');
        drone.stop();
        drone.land(function(){
            console.log('landed');
        })
    })
});

app.get('/stop', function () {
    console.log('emergency landing');
    drone.stop();
    drone.land(function(){
        console.log('emergency landed');
    })
});


server.listen(3001, function(){
    console.log('Client is available at http://localhost:3001');
});
