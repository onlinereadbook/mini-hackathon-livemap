/**
 * @flow
 */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../appsocket/server';
import should from 'should';
import moment from 'moment';
import Fakerdata from '../../data.json';
import _ from 'lodash';

chai.use(chaiHttp);

server.set('unitest', true);

export function userLogin(done) {

    const query = _.pick(Fakerdata.user1, 'fb_id');
    chai
        .request(server)
        .post('/users/login')
        .send(query)
        .end((err, res) => {
            if (err) {

                done(err);

            } else {
                res
                    .body
                    .should
                    .have
                    .property('token');
                done();
            }
        })
}

export function createUserSuccess(done) {
    chai
        .request(server)
        .post('/users')
        .send(Fakerdata.user1)
        .end((err, res) => {
            if (err) {
                done(err);
            } else {
                res
                    .body
                    .should
                    .have
                    .property('user');
                res
                    .body
                    .user
                    .should
                    .have
                    .property('_id');
                res
                    .body
                    .user
                    .should
                    .have
                    .property('nickname');
                res
                    .body
                    .user
                    .should
                    .have
                    .property('socket_id');
                res
                    .body
                    .user
                    .should
                    .have
                    .property('logo');
                res
                    .body
                    .user
                    .should
                    .have
                    .property('fb_id');
                done();
            }
        });
}