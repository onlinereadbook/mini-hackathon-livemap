import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as markerAction from '../actions/markerAction';
import * as profileAction from '../actions/profileAction';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import MarkerList from '../components/MarkerList'
import FontIcon from 'material-ui/FontIcon';
import SvgIcon from 'material-ui/SvgIcon';
import { blue500, red500, greenA200 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import { List, ListItem } from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Divider from 'material-ui/Divider';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Dropzone from 'react-dropzone';

import CardProfile from '../components/CardProfile';

const iconStyles = {
    marginRight: 24,
    paddingLeft: 10,
    paddingTop: 10

};
const textStyles = {
    width: '65%',
    marginLeft: 10,
    top: 0,
    zIndex: 1,
    textAlign: 'center'

};
const menuStyles = {
    width: (screen.width * 0.8)
}

const buttonStyles = {


};
const HomeIcon = (props) => (
    <SvgIcon {...props}>
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
);


class ProfileMenu extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);

        this.state = { account: '' };
        this.handleChannel = this.handleChannel.bind(this);
        this.save = this.save.bind(this);
        this.onDrop = this.onDrop.bind(this);

    }

    handleChannel() {
        this.props.handleOpenChannel();
        //this.props.open = false;
        console.log('handleChannel');

    }


    onDrop(acceptedFiles, rejectedFiles) {
        console.log('Accepted files: ', acceptedFiles);
        console.log('Rejected files: ', rejectedFiles);

        let imgPreview = acceptedFiles[0].preview;

        this.setState({
            imgPreview
        });
    }

    save(name) {
        const { profileAction, profile, markerAction } = this.props;

        profileAction.updateProfile(name);
        markerAction.setMarker(profile.userId, name, profile.photo);
    }

    // handleToggle = () => this.setState({ open: !this.state.open });
    //<MarkerList markers={this.props.markers} setMapCenter={this.props.setMapCenter} />
    render() {
        const { profile } = this.props;

        return (
            <div>
                <Drawer width={menuStyles.width} openSecondary={true} open={this.props.open}
                    >

                    <div>
                        <List>
                            <ListItem primaryText="個人訊息" leftIcon={<ContentInbox />} />

                        </List>
                        <Divider />

                        {this.state.imgPreview ?
                            <img src={this.state.imgPreview} /> :
                            (<Dropzone
                                multiple={false}
                                accept="image/*"
                                onDrop={this.onDrop}>
                                <div>Drop an image or click to select a file to upload.</div>
                            </Dropzone>)
                        }

                        <List>
                            <CardProfile
                                profile={profile}
                                save={this.save}
                                handleProfile={this.props.handleProfile}
                                ></CardProfile>
                        </List>
                    </div>
                </Drawer>



            </div >
        );
    }
}

function mapStateToProps(state) {
    return {
        profile: state.profile
    }
}

function mapDispatchToProps(dispatch) {
    return {
        markerAction: bindActionCreators(markerAction, dispatch),
        profileAction: bindActionCreators(profileAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileMenu);

