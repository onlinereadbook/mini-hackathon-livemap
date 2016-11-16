/**
 * @flow
 */
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../appsocket/app';
import should from 'should';
import moment from 'moment';

chai.use(chaiHttp);

export function createUserSuccess(done) {
    chai
        .request(server)
        .post('/users')
        .send({
            deadtime: moment().format('YYYY-MM-DD hh:mm:ss'),
            title: "Room Test",
            type: "chat"
        })
        .end((err, res) => {
            if (err) {
                done(err);
            } else {
                res
                    .should
                    .have
                    .status(200);

                res.should.be.json;

                res
                    .body
                    .should
                    .have
                    .property('user');
                res.body.room.should.be.json;
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
                done();
            }

        });
}