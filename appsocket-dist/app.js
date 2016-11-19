'use strict';

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _connectMultiparty = require('connect-multiparty');

var _connectMultiparty2 = _interopRequireDefault(_connectMultiparty);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _routers = require('./routers');

var _routers2 = _interopRequireDefault(_routers);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpackDeploy = require('../webpack-deploy.config');

var _webpackDeploy2 = _interopRequireDefault(_webpackDeploy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var randomstring = require("randomstring");
//import config from '../webpack-dev-server.config';


var app = (0, _express2.default)();
var http = _http2.default.Server(app);
var io = (0, _socket2.default)(http);
var compiler = (0, _webpack2.default)(_webpackDeploy2.default);

if (process.env.DEV === 'true') {
    app.use((0, _morgan2.default)('dev'));
}

app.use(_bodyParser2.default.urlencoded());
app.use((0, _connectMultiparty2.default)());
app.use(_bodyParser2.default.json());

if (app.get('env') === 'development') {
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true,
        publicPath: _webpackDeploy2.default.output.publicPath
    }));

    app.use(require('webpack-hot-middleware')(compiler));
}
app.use('/rooms', _routers2.default.rooms);
app.use('/users', _routers2.default.users);

app.get('/chatroom', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.use(_express2.default.static(_path2.default.join(__dirname, '../')));

app.get('/', function (req, res) {
    //res.sendFile(path.join(__dirname, '../app/index.html'));
    res.sendFile(_path2.default.join(__dirname, './app/index.html'));
});

function DisconnectRoom(rooms, socket) {
    var roomId = socket.id;

    var targetRoom = _lodash2.default.find(rooms, function (room) {
        return room.id === roomId;
    });
    socket.leave(targetRoom.id);
}

function checkRoomId(rooms, roomId) {
    var checkReq = _lodash2.default.isUndefined(roomId) || _lodash2.default.isEmpty(roomId),
        resp = {
        error: null,
        success: false
    };

    var targetRoom = _lodash2.default.find(rooms, function (room) {
        return room.id === roomId;
    });

    if (checkReq) {
        resp.error = {
            status: 404,
            message: 'roomId 不可為空'
        };
    } else if (_lodash2.default.isUndefined(targetRoom)) {
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

var roomClass = function () {
    function roomClass(params) {
        (0, _classCallCheck3.default)(this, roomClass);


        this._MAX = 9;
        this._ID = params.id;
        this._MEMBERS = [];
    }

    (0, _createClass3.default)(roomClass, [{
        key: 'addMember',
        value: function addMember(user) {
            var _this = this;

            return new _promise2.default(function (resolve, reject) {
                var error = null;
                _this._MEMBERS.map(function (u) {
                    if (u.id === user.id) {
                        reject(new Error('使用者已存在'));
                    }
                });
                _this._MEMBERS.push(user);

                resolve();
            });
        }
    }, {
        key: 'removeMember',
        value: function removeMember(user) {
            var error = null;

            return _lodash2.default.remove(this._MEMBERS, function (member) {
                return member.id === user.id;
            });
        }
    }, {
        key: 'id',
        get: function get() {
            return this._ID;
        }
    }]);
    return roomClass;
}();

var rooms = [];

var user_count = 0;

//當新的使用者連接進來的時候
io.on('connection', function (socket) {

    socket.on('chat message', function (data) {
        //console.log(data);
        //appendMessage(data.username+":"+data.msg);
        io.emit('globalmessage', data);
    });

    //回傳個人的socket.id
    socket.emit('getuid', {
        uid: socket.id
    });

    // TODO 建立房間
    socket.on('createroom', function (data) {
        console.log(data);
        var roomID = randomstring.generate();
        var params = {
            id: roomID,
            roomTitle: roomTitle
        };

        var room = new roomClass(params);
        rooms.push(room);
        socket.emit('success', {
            status: 200,
            roomId: room.id,
            message: '\u5EFA\u7ACB\u623F\u9593' + room.id + '\u6210\u529F'
        });
    });

    // TODO 加入房間
    socket.on('joinroom', function (req) {
        var checkResult = checkRoomId(rooms, req.roomId);

        if (checkResult.error) {
            socket.emit('errorStatus', checkResult.error);
        } else {

            checkResult.targetRoom.addMember(socket).then(function () {
                socket.join(req.roomId);

                socket.emit('success', {
                    status: 200,
                    message: '\u4F7F\u7528\u8005' + socket.id + '\u5DF2\u52A0\u5165\u6210\u529F'
                });
            }).catch(function (error) {
                socket.emit('error', {
                    status: 404,
                    message: error.message
                });
            });
        }
    });

    // TODO 離開房間
    socket.on('leaveroom', function (req) {

        var checkResult = checkRoomId(rooms, req.roomId);

        if (checkResult.error) {
            socket.emit('errorStatus', checkResult.error);
        } else {
            checkResult.targetRoom.removeMember(socket);
            socket.leave(req.roomId);
            socket.emit('success', {
                status: 200,
                message: socket.id + '\u5DF2\u7D93\u96E2\u958B\u623F\u9593'
            });
        }
    });
    // TODO 發送房間訊息

    socket.on('localmessage', function (req) {

        var checkResult = checkRoomId(rooms, req.roomId);

        if (checkResult.error) {
            socket.emit('errorStatus', checkResult.error);
        } else {
            io.to(req.roomId).emit('localmessage', req.params);
        }
    });

    // TODO 發送全域訊息

    socket.on('globalmessage', function (req) {
        io.emit('globalmessage', req.params);
    });

    //left
    // socket.on('disconnect', function () {
    //     DisconnectRoom(rooms, socket.id);
    //     io.emit('user left', {
    //         username: socket.username
    //     });
    // });

});

//Error Handler
app.use(function (error, req, res, next) {
    var status = error.status || 500;
    res.status(status).json({
        message: error.message
    });
});

var port = process.env.PORT || 3000;
//指定port
http.listen(port, function () {
    console.log('listening on *:', port);
});

//Nodejs 奇怪的錯誤防止Process 死掉
process.on('uncaughtException', function (err) {
    console.log(err);
});
//# sourceMappingURL=app.js.map