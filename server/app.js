/**
 * @flow
 */
import httpModule from 'http';
import socketIO from 'socket.io';
import _ from 'lodash';
import app from './server';
import path from 'path';
import webpack from 'webpack';
//import config from '../webpack-dev-server.config';
import config from '../webpack-deploy.config';


const randomstring = require("randomstring");

const http = httpModule.Server(app);
const io = socketIO(http);
const compiler = webpack(config);

if (process.env.DEV === 'true') {
    app.use(logger('dev'));
}
console.log('test2');

// app.use(bodyParser.urlencoded());
// app.use(multipartyMiddleware());
// app.use(bodyParser.json())

// if (app.get('env') === 'development') {
//     app.use(require('webpack-dev-middleware')(compiler, {
//         noInfo: true,
//         publicPath: config.output.publicPath
//     }));

//     app.use(require('webpack-hot-middleware')(compiler));
// }
// app.use('/rooms', routers.rooms);
// app.use('/users', routers.users);

// app.get('/chatroom', function(req, res) {
//     res.sendFile(__dirname + '/index.html');
// });

// app.use(Express.static(path.join(__dirname, './')));

// app.get('/', function(req, res) {
//     //res.sendFile(path.join(__dirname, '../app/index.html'));
//     res.sendFile(path.join(__dirname, 'index.html'));
// });


function DisconnectRoom(rooms, socket) {
    const roomId = socket.id;

    let targetRoom = _.find(rooms, (room) => {
        return room.id === roomId;
    });
    socket.leave(targetRoom.id);
}

function checkRoomId(rooms, roomId) {
    let checkReq = _.isUndefined(roomId) || _.isEmpty(roomId),
        resp = {
            error: null,
            success: false
        };

    let targetRoom = _.find(rooms, (room) => {
        return room.id === roomId;
    });

    if (checkReq) {
        resp.error = {
            status: 404,
            message: 'roomId 不可為空'
        };
    } else if (_.isUndefined(targetRoom)) {
        resp.error = {
            status: 404,
            message: '房間不存在'
        };
    } else {
        resp.success = true;
        resp.targetRoom = targetRoom;
    }

    return resp;
}

class roomClass {
    constructor(params) {

        this._MAX = 9;
        this._ID = params.id;
        this._MEMBERS = [];

    }

    get id() {
        return this._ID;
    }

    addMember(user) {
        return new Promise((resolve, reject) => {
            let error = null;
            this
                ._MEMBERS
                .map(u => {
                    if (u.id === user.id) {
                        reject(new Error('使用者已存在'));
                    }
                });
            this
                ._MEMBERS
                .push(user);

            resolve();
        });
    }

    removeMember(user) {
        let error = null;

        return _.remove(this._MEMBERS, (member) => {
            return member.id === user.id;
        });
    }
}

let rooms = [];

var user_count = 0;

//當新的使用者連接進來的時候
io.on('connection', function (socket) {

    socket
        .on('chat message', function (data) {
            io.emit('globalmessage', data);
        });

    //回傳個人的socket.id
    socket.emit('getuid', { uid: socket.id });

    // TODO 建立房間
    socket.on('createroom', (data) => {
        console.log(data);
        const roomID = randomstring.generate();
        const params = {
            id: roomID,
            roomTitle: roomTitle
        };

        const room = new roomClass(params);
        rooms.push(room);
        socket.emit('success', {
            status: 200,
            roomId: room.id,
            message: `建立房間${room.id}成功`
        });
    });

    // TODO 加入房間
    socket.on('joinroom', (req) => {
        const checkResult = checkRoomId(rooms, req.roomId);

        if (checkResult.error) {
            socket.emit('errorStatus', checkResult.error);
        } else {

            checkResult
                .targetRoom
                .addMember(socket)
                .then(() => {
                    socket.join(req.roomId);

                    socket.emit('success', {
                        status: 200,
                        message: `使用者${socket.id}已加入成功`
                    });
                })
                .catch(error => {
                    socket.emit('error', {
                        status: 404,
                        message: error.message
                    });
                });
        }
    });

    // TODO 離開房間
    socket.on('leaveroom', (req) => {

        const checkResult = checkRoomId(rooms, req.roomId);

        if (checkResult.error) {
            socket.emit('errorStatus', checkResult.error);
        } else {
            checkResult
                .targetRoom
                .removeMember(socket);
            socket.leave(req.roomId);
            socket.emit('success', {
                status: 200,
                message: `${socket.id}已經離開房間`
            });
        }
    });
    // TODO 發送房間訊息

    socket.on('localmessage', (req) => {

        const checkResult = checkRoomId(rooms, req.roomId);

        if (checkResult.error) {
            socket.emit('errorStatus', checkResult.error);
        } else {
            io
                .to(req.roomId)
                .emit('localmessage', req.params);
        }
    });

    // TODO 發送全域訊息

    socket.on('globalmessage', (req) => {
        io.emit('globalmessage', req.params);
    });

    //left
    socket.on('disconnect', function () {
        // DisconnectRoom(rooms, socket.id); io.emit('user left', {username:
        // socket.username});
    });
});

let port = process.env.PORT || 8888;
//指定port

http.listen(port, function () {
    console.log('listening on *:', port);
});
