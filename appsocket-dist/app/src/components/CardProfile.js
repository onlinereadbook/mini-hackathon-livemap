import React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';


/* 
    Todos:
        1. TextField需要onChange取得值，改成component使用state記值
        2. 訪客無法使用
        3. 登出按鈕放這？
*/
const CardProfile = ({profile, handleProfile, save}) => (

    < Card >

        <CardHeader
            title={profile.name}
            subtitle="Subtitle"
            avatar={profile.photo}
            />
        <CardText>


            <TextField
                floatingLabelText="請輸入帳號"
                value={profile.name}
                /><br />
            <TextField
                id="text-field-default"
                floatingLabelText="更新圖片"
                /><br />
            <TextField
                hintText="Hint Text"
                floatingLabelText="個人介紹"
                value={profile.name}
                /><br />

        </CardText>
        <CardActions>
            <FlatButton label="關閉" onTouchTap={() => { handleProfile() } }
                />
            <FlatButton label="存檔" onTouchTap={() => { save('test'); handleProfile(); } } />
        </CardActions>
    </Card >
);

export default CardProfile;