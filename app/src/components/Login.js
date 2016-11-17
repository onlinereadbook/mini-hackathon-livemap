import React from 'react'
import FacebookLogin from 'react-facebook-login';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
    guest: {
        width: '100%',
        marginTop: '10px'
    }
}

const Login = ({isLogin, fbLogin, guestLogin, logout}) => {
    return (
        <div>
            {
                !isLogin
                    ? (
                        <div>
                            <FacebookLogin
                                appId="532588166938909"
                                fields="name,email,picture"
                                callback={fbLogin}
                                icon="fa-facebook"
                                />
                            <RaisedButton label="訪客登入" style={style.guest} primary={true} onTouchTap={() => guestLogin()} />
                        </div>
                    ) : <RaisedButton label="Logout" secondary={true} onTouchTap={() => logout()} />
            }
        </div>
    )
}

export default Login