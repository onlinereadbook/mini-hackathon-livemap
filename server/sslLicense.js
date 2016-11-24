
import fs from 'fs';
//import keyPath from './ssl/yourkey.pem';
// import certPath from './ssl/yourcert.pem';
var keyPath = fs.readFileSync('./server/ssl/yourkey.pem', 'utf8');
var certPath = fs.readFileSync('./server/ssl/yourcert.pem', 'utf8');

//ssl license


// var hskey = fs.readFileSync(keyPath);
// var hscert = fs.readFileSync(certPath);

var options = {
    key: keyPath,
    cert: certPath
};

//ssl object

var ssl = {};

ssl.options = options;

module.exports = ssl;