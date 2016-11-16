/**
 * @flow
 */
import jwt from 'jsonwebtoken';
import _ from 'lodash';

import {SECRET_KEY, USER_FIELDS} from '../config';

export function createNewToken(user : Object) : string {

    const jwtObject = _.pick(user, USER_FIELDS);
    return jwt.sign(jwtObject, SECRET_KEY);

}