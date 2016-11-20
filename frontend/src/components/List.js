import React from 'react';
import { List, ListItem } from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';

//const ListExampleSimple = () => (
export default class ListExampleSimple extends React.Component {

    constructor(props) {
        super(props);
        this.handleOpen = this.handleOpen.bind(this)

        // this.state = { open: false };
    }

    render() {
        return (
            <div>
                <List>
                    <ListItem primaryText="我創建的頻道" leftIcon={<ContentInbox />} />
                    <ListItem primaryText="我最愛的頻道" leftIcon={<ActionGrade />} />
                    <ListItem primaryText="私訊未讀訊息" leftIcon={<ContentInbox />} />
                </List>
                <Divider />
                <List>
                    <ListItem primaryText="所有頻道" rightIcon={<ActionInfo />}
                        onTouchTap={() => { this.handleOpen() } }
                        />
                    <ListItem primaryText="設定喜歡頻道" rightIcon={<ActionInfo />} />
                    <ListItem primaryText="追蹤人物" rightIcon={<ActionInfo />} />
                </List>
            </div>
        )
    }
    //);
}

export default ListExampleSimple;