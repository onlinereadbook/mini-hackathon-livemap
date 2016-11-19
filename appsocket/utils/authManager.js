/**
 * @flow
 */
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import {SECRET_KEY, USER_FIELDS} from '../config';

export function checkToken(req, res, next) {
    const token = req.headers.token;
    if (_.isUndefined(token) || _.isEmpty(token)) {
        const error = new Error('Token 不可為空');
        error.status = 404;
        next(error);
    } else {
        const user = decodeToken(token);
        req.self = user;
        next();

    }
}

export function createNewToken(user : Object) : string {

    const jwtObject = _.pick(user, USER_FIELDS);
    return jwt.sign(jwtObject, SECRET_KEY);

}

export function decodeToken(token : string) : Object {
    const jwtObject = jwt.verify(token.trim(), SECRET_KEY);
    return jwtObject;

}