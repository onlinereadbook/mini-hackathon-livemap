/**
 * @flow 
 * */
import _ from 'lodash';
import express from 'express';
import MongoDBManager from '../utils/mongoManager';

const router = express.Router();

router.post('/', (req, res, next) => {
    const query = _.pick(req.body, 'socket_id', 'nickname', 'logo');
    if(!query.socket_id){
        next(new Error('Socket ID 不可為空'));
    }else{
        MongoDBManager.findOne('users', {
            socket_id: req.body.socket_id
        }).then(user => {
            if(user){
                const error = new Error('使用者已存在');
                error.status = 404;
                next(error);
            }else{
                return MongoDBManager.insert('users', query);
            }
        }).then(result => {
            res.status(200).json({
                user: result
            });
        }).catch(error => {
            error.status = 500;
            next(error);
        });
    }
});

export default router