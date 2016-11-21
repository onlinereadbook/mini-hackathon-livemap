/**
 * @flow
 * */
import _ from 'lodash';
import express from 'express';
import MongoDBManager from '../utils/mongoManager';

import {createNewToken, checkToken} from '../utils/authManager';

const router = express.Router();

router.get('/:id', (req, res, next) => {
    const query = {
        "fb_id": req.params.id
    };

    MongoDBManager
        .findOne('users', query)
        .then(user => {

            res.json({user});

        })
        .catch(error => {
            error.status = 500;
            next(error);
        });
});

router.get('/', checkToken, (req, res, next) => {

    let query = {},
        options = {};

    options.from = req.body.from || 0;
    options.limit = req.body.limit || 10;

    MongoDBManager
        .find('users', query, options)
        .then(users => {

            res.json({users});

        })
        .catch(error => {
            error.status = 500;
            next(error);
        })
});

router.post('/', (req, res, next) => {
    const query = _.pick(req.body, 'socket_id', 'nickname', 'logo', "fb_id");

    if (_.isUndefined(query.socket_id)) {

        next(new Error('Socket ID 不可為空'));

    } else if (_.isUndefined(query.fb_id)) {

        next(new Error('Facebook ID不可為空'));

    } else {

        MongoDBManager
            .findOne('users', {socket_id: query.socket_id})
            .then(user => {
                if (user) {

                    const error = new Error('使用者已存在');
                    error.status = 404;
                    next(error);

                } else {

                    return MongoDBManager.insert('users', query);

                }
            })
            .then(result => {
                res
                    .status(200)
                    .json({user: result.ops[0]});
            })
            .catch(error => {
                error.status = 500;
                next(error);
            });

    }
});

router.post('/login', (req, res, next) => {
    const query = _.pick(req.body, 'fb_id');

    if (_.isUndefined(query.fb_id)) {

        next(new Error('Facebook ID不可為空'));

    } else {

        MongoDBManager
            .findOne('users', query)
            .then(user => {
                if (_.isUndefined(user)) {

                    const error = new Error('使用者已存在');
                    error.status = 404;
                    next(error);

                } else {

                    const token = createNewToken(user);

                    res.json({token});
                }
            });
    }
});

export default router
