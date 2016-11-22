/**
 * @flow
 */
import Express from 'express';
import cors from 'cors';
import multipartyMiddleware from 'connect-multiparty';
import bodyParser from 'body-parser';
import _ from 'lodash';
import logger from 'morgan';
import routers from './routers';
import path from 'path';

const app = Express();

if (process.env.DEV === 'true') {
    app.use(logger('dev'));
    app.set('DEBUG', true);
}
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(bodyParser.urlencoded());
app.use(multipartyMiddleware());
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.use('/rooms', routers.rooms);
app.use('/users', routers.users);

app.use(Express.static(path.join(__dirname, './')));

//Error Handler
app.use((error, req, res, next) => {
    const status = error.status || 500;
    res
        .status(status)
        .json({ message: error.message });
});

//預期外的錯誤，防止crash
process.on('uncaughtException', (err) => {
    //應該要寫入資料庫
});

export default app;
