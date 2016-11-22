import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as markerAction from '../actions/markerAction';
import * as messageAction from '../actions/messageAction';
import * as roomAction from '../actions/roomAction';
import * as profileAction from '../actions/profileAction';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import Map from '../components/Map'
import MarkerList from '../components/MarkerList'
import BottomNavigationExampleSimple from '../components/BottonNavigation'
import Login from '../components/Login'
import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import Modal from 'react-modal';

import Menu from '../components/Menu'
import ChannelMenu from '../components/ChannelMenu'
import MessageChannel from '../components/MessageChannel'
import ProfileMenu from '../components/ProfileMenu'
import Dialog from '../components/Dialog'
import BadgeExampleSimple from '../components/IconButton'
//import _ from 'lodash'
var port = process.env.PORT || 8888;

var socket = io('http://localhost:' + port);
//var name = prompt("請輸入暱稱", "guest");
// if (name == "" || name == null) {
//     name = "guest";
// }
// var roomId = '';
// socket.emit('createroom', {});
var roomsMessage = [];

const style = {
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#2d2b2b',
        position: 'relative',
        overflow: 'hidden'
    },
    content: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 0
    },
    list: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: '20%',
        height: '100%',
        opacity: 0.9,
        zIndex: 1
    },
    functionButton: {
        position: 'absolute',
        right: '22%',
        top: 0,
        width: '3%',
        height: '100%',
        zIndex: 1,
        textAlign: 'center'
    },
    ButtonNavigation: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 1,
        textAlign: 'center'
    },
    ProfileButton: {
        position: 'absolute',
        right: '22%',
        top: 0,
        width: '20%',
        zIndex: 1,
        textAlign: 'center'
    },
    menu: {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1
    },
    loginDialog: {
        overlay: {
            zIndex: 999
        },
        content: {
            width: '258px',
            height: '100px',
            margin: 'auto auto',
            backgroundColor: 'black',
            opacity: 0.8
        }
    }
}

const zoom = 12

class App extends Component {
    constructor(props) {
        super(props)
        this.addMarker = this.addMarker.bind(this);
        this.setMapCenter = this.setMapCenter.bind(this);
        this.handleSendGlobalMessage = this.handleSendGlobalMessage.bind(this);

        // 預設台北101
        this.state = {
            init: {
                center: { lat: 25.0339031, lng: 121.5623212 },
                zoom: zoom
            },
            open: false,
            channelopen: false,
            messageopen: false,
            profileopen: false,
            isLogin: false,
            watchId: 0
        }
        var roomsMessage = [];
        this.handleOpen = this.handleOpen.bind(this)   // 第一層選單
        this.handleOpenChannel = this.handleOpenChannel.bind(this) //頻道選單
        this.handleOpenMessage = this.handleOpenMessage.bind(this) //聊天頻道選單
        this.handleProfile = this.handleProfile.bind(this)   // 第一層選單
        this.handleBackMainOpen = this.handleBackMainOpen.bind(this)   // 第一層選單
        this.handleCreateRoom = this.handleCreateRoom.bind(this) //創建聊天室
    }

    componentDidMount() {
        const {messageAction, roomAction} = this.props;

        socket.on('globalmessage', function (data) {
            messageAction.addGlobalMessage(JSON.stringify(data));
            //    console.log(roomsMessage);
        });

        // connect socket when room add success
        socket.on('createRoomSuccess', (roomData) => {
            roomAction.addRoom(roomData);
        });
    }

    appendMessage(msg) {

        // var message = document.getElementById("message_block");
        // message.scrollTop = message.scrollHeight;
    }

    handleSendGlobalMessage(roomId, message) {
        socket.emit('globalmessage', {
            roomId: roomId,
            params: message
        });
    }
    handleCreateRoom(roomTitle) {
        // console.log(roomTitle);
        socket.emit('createroom', {
            roomTitle: roomTitle
        });

        //please remove this function when socket connect. its a test function
        this.props.roomAction.addRoom({
            id: Math.random(),
            title: roomTitle,
        });

    }
    handleOpenMessage() {
        this.setState({ channelopen: false })
        this.setState({ messageopen: true })
    }

    handleProfile() {
        //    console.log('test');
        this.setState({ open: false })
        this.setState({ channelopen: false })
        this.setState({ messageopen: false })

        if (this.state.profileopen == false) {
            this.setState({ profileopen: true })
        } else {
            this.setState({ profileopen: false })
        }
    }
    handleBackMainOpen() {
        this.setState({ open: true })
        this.setState({ channelopen: false })
        this.setState({ messageopen: false })
    }

    handleOpen() {
        this.setState({ open: true })
        this.setState({ messageopen: false })

        if (this.state.open == false) {
            this.setState({ open: true })
        } else {
            this.setState({ open: false })
        }
    }

    handleOpenChannel() {
        // if (this.state.open == false) {
        //     this.setState({ open: true })
        // } else {
        this.setState({ open: false })
        this.setState({ channelopen: true })
        this.setState({ messageopen: false })

        //}
        console.log('openchannel');
    }


    render() {
        const { dispatch, markers, messages, messageAction, rooms, profile } = this.props

        return (
            <div style={style.container} >
                <Modal isOpen={!this.state.isLogin} style={style.loginDialog}>
                    <Login
                        isLogin={this.state.isLogin}
                        fbLogin={this.fbLogin.bind(this)}
                        guestLogin={this.guestLogin.bind(this)}
                        logout={this.logout.bind(this)}
                        />
                </Modal>


                <div style={style.content}>
                    <Map center={this.state.init.center} zoom={this.state.init.zoom} markers={markers} />
                </div>

                <div style={style.functionButton}>
                    <FloatingActionButton mini={true} onClick={this.addMarker.bind(this)}>
                        <ContentAdd />
                    </FloatingActionButton>

                </div>
                <div style={style.ProfileButton}>
                    <BadgeExampleSimple></BadgeExampleSimple>
                </div>
                <div style={style.ButtonNavigation}>
                    <BottomNavigationExampleSimple handleOpen={this.handleOpen} handleProfile={this.handleProfile} ></BottomNavigationExampleSimple >

                </div>

                <div style={style.menu}>
                    <Menu open={this.state.open} markers={markers} setMapCenter={this.setMapCenter} handleOpenChannel={this.handleOpenChannel} handleCreateRoom={this.handleCreateRoom}
                        />
                    <ChannelMenu open={this.state.channelopen} handleOpenMessage={this.handleOpenMessage} handleBackMainOpen={this.handleBackMainOpen} rooms={rooms} />
                    <MessageChannel open={this.state.messageopen} handleSendGlobalMessage={this.handleSendGlobalMessage} roomsMessage={messages} handleOpenChannel={this.handleOpenChannel} />
                    <ProfileMenu open={this.state.profileopen} handleProfile={this.handleProfile} />
                </div>



            </div >
        )
    }

    addMarker() {
        const { markerAction } = this.props
        const markers = [
            {
                position: { lat: 22.6246197, lng: 120.28278 },
                text: '鹽埕埔2號出口',
                photo: 'https://goo.gl/q2d8HC'
            }, {
                position: { lat: 22.6233427, lng: 120.2867754 },
                text: '樺達奶茶',
                photo: 'https://goo.gl/dsS35b'
            }, {
                position: { lat: 22.6261609, lng: 120.2718653 },
                text: '忠烈祠',
                photo: 'https://goo.gl/v4I9dl'
            }
        ]

        markers.map((marker, idx) => {
            markerAction.addMarker(marker)
        })
    }

    setMapCenter(location) {
        this.setState({
            init: {
                center: location,
                zoom: zoom
            }
        })
    }

    watchPosition(profile) {
        const that = this

        if (navigator.geolocation) {
            // 設定目前位置
            const watchId = navigator.geolocation.watchPosition((position) => {

                const { markerAction, markers } = that.props
                const location = { lat: position.coords.latitude, lng: position.coords.longitude }

                let myLocation = markers.filter(x => x.userId == profile.userId)[0]

                if (myLocation) {
                    markerAction.setLocation(profile.userId, location)
                } else {
                    markerAction.addMarker({
                            ...profile,
                        position: location
                        })

            this.setMapCenter(location)
        }
    })

            this.setState({ watchId })
        }
    }

fbLogin(response) {
    if (response.status) return;

    const { profileAction } = this.props;

    const profile = {
        name: response.name,
        photo: response.picture.data.url,
        userId: response.id,
        role: 'FB',
        message: `大家好，我是${response.name}！`
    }

    profileAction.initProfile(profile);
    this.watchPosition(profile);
    this.setState({
        isLogin: true
    });
}

guestLogin() {
    const { profileAction } = this.props;

    const profile = {
        name: '訪客',
        photo: 'https://goo.gl/6dcw3S',
        userId: new Date().getTime(),
        role: 'GUEST',
        message: '大家好，我是訪客！'
    }

    profileAction.initProfile(profile);
    this.watchPosition(profile);
    this.setState({
        isLogin: true,
        profile
    });
}

logout() {
    const { markerAction } = this.props
    const {profile, watchId} = this.state

    markerAction.removeMarker(profile.userId)
    navigator.geolocation.clearWatch(watchId);

    if (profile.role == 'FB') {
        FB.logout()
    }

    this.setState({
        isLogin: false
    })
}
}

function mapStateToProps(state) {
    return {
        markers: state.markers,
        messages: state.messages,
        rooms: state.rooms,
        profile: state.profile
    }
}

function mapDispatchToProps(dispatch) {
    return {
        markerAction: bindActionCreators(markerAction, dispatch),
        messageAction: bindActionCreators(messageAction, dispatch),
        roomAction: bindActionCreators(roomAction, dispatch),
        profileAction: bindActionCreators(profileAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
