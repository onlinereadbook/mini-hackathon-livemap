'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _config = require('../config');

var config = _interopRequireWildcard(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongo = require('mongoskin');

var MongoDBManager = function () {
    function MongoDBManager(host, port, dbName) {
        (0, _classCallCheck3.default)(this, MongoDBManager);

        for (var _len = arguments.length, options = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
            options[_key - 3] = arguments[_key];
        }

        options.native_parser = true;
        this.host = host;
        this.port = port;
        this.dbName = dbName;

        this.db = mongo.db('mongodb://' + host + ':' + port + '/' + dbName, options);
    }

    (0, _createClass3.default)(MongoDBManager, [{
        key: 'setCollection',
        value: function setCollection(name) {
            return this.db.bind(name);
        }
    }, {
        key: 'insert',
        value: function insert(collection, query) {
            for (var _len2 = arguments.length, options = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
                options[_key2 - 2] = arguments[_key2];
            }

            var _this = this;

            return new _promise2.default(function (resolve, reject) {
                _this.setCollection(collection);
                _this.db[collection].insert(query, options, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        }
    }, {
        key: 'findOne',
        value: function findOne(collection, query, options) {
            var _this2 = this;

            return new _promise2.default(function (resolve, reject) {
                _this2.setCollection(collection);
                _this2.db[collection].findOne(query, options, function (err, item) {
                    console.log(err, item);
                    if (err) {
                        reject(err);
                    } else {
                        resolve(item);
                    }
                });
            });
        }
    }]);
    return MongoDBManager;
}();

var manager = new MongoDBManager(config.host, config.port, config.dbName);

exports.default = manager;
//# sourceMappingURL=mongoManager.js.map