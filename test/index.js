/**
 * @flow
 */
import * as UserSpecs from './specs/routers/users.spec';
import MongoDBManager from '../server/utils/mongoManager';
import data from './data.json';

describe('User Unitest', function () {
    before(done => {

        MongoDBManager
            .clear('users')
            .then(() => {
                return MongoDBManager.insert('users', data.users);
            })
            .then(rs => {
                done();
            })
            .catch(err => done(err));
    });
    it('should 建立一個使用者', UserSpecs.createUserSuccess);
    it('should 會員登入取得驗證Token', UserSpecs.userLogin);
    it('should 取回會員列表', UserSpecs.userList);
    it('should 取回會員詳情', UserSpecs.userDetail);
});

describe('Room Unitest', function () {

    it('should 建立一個新的房間');
    it('should 會員加入一個房間');
    it('should 會員離開房間');
    it('should 取回房間列表');
    it('should 取回房間詳情資訊');
    it('should 發送房間訊息');
});