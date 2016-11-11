import React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';



const CardProfile = ({handleProfile}) => (

    < Card >

        <CardHeader
            title="URL Avatar"
            subtitle="Subtitle"
            avatar="images/jsa-128.jpg"
            />
        <CardMedia
            overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
            >
            <img src="images/nature-600-337.jpg" />
        </CardMedia>
        <CardTitle title="Card title" subtitle="Card subtitle" />
        <CardText>


            <TextField
                floatingLabelText="請輸入帳號"
                /><br />
            <TextField
                id="text-field-default"
                floatingLabelText="更新圖片"
                /><br />
            <TextField
                hintText="Hint Text"
                floatingLabelText="個人介紹"
                /><br />

        </CardText>
        <CardActions>
            <FlatButton label="關閉" onTouchTap={() => { handleProfile() } }
                />
            <FlatButton label="存擋" onTouchTap={() => { handleProfile() } } />
        </CardActions>
    </Card >
);

export default CardProfile;