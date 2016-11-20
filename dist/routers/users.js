'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoManager = require('../utils/mongoManager');

var _mongoManager2 = _interopRequireDefault(_mongoManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();


router.get('/', function (req, res) {
    res.json({ "state": 222 });
});

router.post('/', function (req, res, next) {
    var query = _lodash2.default.pick(req.body, 'socket_id', 'nickname', 'logo');

    if (!query.socket_id) {
        next(new Error('Socket ID 不可為空'));
    } else {
        _mongoManager2.default.findOne('users', {
            socket_id: query.socket_id
        }).then(function (user) {
            if (user) {
                var error = new Error('使用者已存在');
                error.status = 404;
                throw error;
            } else {
                return _mongoManager2.default.insert('users', query);
            }
        }).then(function (result) {
            res.status(200).json({
                user: result
            });
        }).catch(function (error) {
            error.status = 500;
            next(error);
        });
    }
});

exports.default = router;
//# sourceMappingURL=users.js.map