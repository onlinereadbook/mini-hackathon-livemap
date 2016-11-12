import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as markerAction from '../actions/markerAction'
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

import Menu from '../components/Menu'
import ChannelMenu from '../components/ChannelMenu'
import MessageChannel from '../components/MessageChannel'
import ProfileMenu from '../components/ProfileMenu'
import Dialog from '../components/Dialog'
import BadgeExampleSimple from '../components/IconButton'

var socket = io('http://localhost:3000');

var name = prompt("請輸入暱稱", "guest");
if (name == "" || name == null) {
    name = "guest";
}
socket.emit('createroom', {});
//加入房間
setTimeout(function () {
    socket.emit('joinroom', {
        roomId: roomId
    });
}, 1000);
//發送區域性訊息
setTimeout(function () {
    socket.emit('localmessage', {
        roomId: roomId,
        params: {
            message: '這是區域訊息'
        },
    });
}, 1200);

//發送區域性訊息
setTimeout(function () {
    socket.emit('globalmessage', {
        roomId: roomId,
        params: {
            message: '這是全域訊息'
        },
    });
}, 1400);
//離開房間
setTimeout(function () {
    socket.emit('leaveroom', {
        roomId: roomId
    });
}, 2000);
//tell server
socket.emit("add user", name);
//監聽新訊息事件
socket.on('success', function (resp) {
    if (resp.roomId) {
        roomId = resp.roomId;
    }
    appendMessage(resp.message);
});
socket.on('localmessage', function (data) {
    appendMessage('LocalMessage:' + JSON.stringify(data));
});
socket.on('globalmessage', function (data) {
    appendMessage('GlobalMessage:' + JSON.stringify(data));
});
socket.on('getuid', function (data) {
    if (data.uid !== undefined) {
        uid = data.uid;
        appendMessage("UID: " + data.uid);
    }
});
socket.on('chat message', function (data) {
    appendMessage(data.username + ":" + data.msg);
});
socket.on('add user', function (data) {
    appendMessage(data.username + "已加入");
});
socket.on('user left', function (data) {
    appendMessage(data.username + "已離開");
});




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
    login: {
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1
    }
}

const zoom = 12

class App extends Component {
    constructor(props) {
        super(props)
        //  console.log(props);
        this.addMarker = this.addMarker.bind(this)
        this.setMapCenter = this.setMapCenter.bind(this)

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
            watchId: 0,
            userData: {}
        }


        this.handleOpen = this.handleOpen.bind(this)   // 第一層選單
        this.handleOpenChannel = this.handleOpenChannel.bind(this) //頻道選單
        this.handleOpenMessage = this.handleOpenMessage.bind(this) //聊天頻道選單
        this.handleProfile = this.handleProfile.bind(this)   // 第一層選單

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

        //}
        console.log('openchannel');
    }


    render() {
        const { dispatch, markers} = this.props

        return (
            <div style={style.container}>
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

                <div style={style.login}>
                    <Menu open={this.state.open} markers={markers} setMapCenter={this.setMapCenter} handleOpenChannel={this.handleOpenChannel} />
                    <ChannelMenu open={this.state.channelopen} handleOpenMessage={this.handleOpenMessage} />
                    <MessageChannel open={this.state.messageopen} />
                    <ProfileMenu open={this.state.profileopen} handleProfile={this.handleProfile} />

                    <Dialog />
                    <Login
                        isLogin={this.state.isLogin}
                        fbLogin={this.fbLogin.bind(this)}
                        guestLogin={this.guestLogin.bind(this)}
                        logout={this.logout.bind(this)}
                        />
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

    watchPosition(userData) {
        const that = this

        if (navigator.geolocation) {
            // 設定目前位置
            const watchId = navigator.geolocation.watchPosition((position) => {

                const { markerAction, markers } = that.props
                const location = { lat: position.coords.latitude, lng: position.coords.longitude }

                let myLocation = markers.filter(x => x.userId == userData.userId)[0]

                if (myLocation) {
                    markerAction.setLocation(userData.userId, location)
                } else {
                    markerAction.addMarker({
                        ...userDat,
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

    const userData = {
        text: response.name,
        photo: response.picture.data.url,
        userId: response.id,
        role: 'FB',
        message: `大家好，我是${response.name}！`
    }

    this.watchPosition(userData)
    this.setState({
        isLogin: true,
        userData
    })
}

guestLogin() {
    const userData = {
        text: '訪客',
        photo: 'https://goo.gl/6dcw3S',
        userId: new Date().getTime(),
        role: 'GUEST',
        message: '大家好，我是訪客！'
    }

    this.watchPosition(userData)
    this.setState({
        isLogin: true,
        userData
    })
}

logout() {
    const { markerAction } = this.props
    const {userData, watchId} = this.state

    markerAction.removeMarker(userData.userId)
    navigator.geolocation.clearWatch(watchId);

    if (userData.role == 'FB') {
        FB.logout()
    }

    this.setState({
        isLogin: false
    })
}
}

function mapStateToProps(state) {
    return {
        markers: state.markers
    }
}

function mapDispatchToProps(dispatch) {
    return {
        markerAction: bindActionCreators(markerAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
