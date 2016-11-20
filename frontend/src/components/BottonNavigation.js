import React, { Component } from 'react';
import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import ActionFace from 'material-ui/svg-icons/action/face';
import ActionHome from 'material-ui/svg-icons/action/home';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';


const faceIcon = <ActionFace />;
const homeIcon = <ActionHome />;
const nearbyIcon = <IconLocationOn />;

/**
 * A simple example of `BottomNavigation`, with three labels and icons
 * provided. The selected `BottomNavigationItem` is determined by application
 * state (for instance, by the URL).
 */
class BottomNavigationExampleSimple extends Component {
    state = {
        selectedIndex: 0,
        open: false,

    };
    constructor(props) {
        super(props);
        this.handleOpen = this.handleOpen.bind(this)
        this.handleProfile = this.handleProfile.bind(this)

        // this.state = { open: false };
    }


    handleOpen() {
        this.props.handleOpen();
    };
    handleProfile() {
        // console.log('test');
        this.props.handleProfile();
    }

    handleClose = () => {
        this.setState({ open: false });
    };

    select = (index) => this.setState({ selectedIndex: index });

    render() {
        return (
            <Paper zDepth={1}>
                <BottomNavigation selectedIndex={this.state.selectedIndex}>
                    <BottomNavigationItem
                        label="個人資料"
                        icon={faceIcon}
                        onTouchTap={() => { this.handleProfile() } }
                        />
                    <BottomNavigationItem
                        label="回首頁"
                        icon={homeIcon}
                        onTouchTap={() => this.select(1)}
                        />
                    <BottomNavigationItem
                        label="頻道"
                        icon={nearbyIcon}
                        onTouchTap={() => { this.handleOpen() } }

                        />
                </BottomNavigation>


            </Paper>

        );
    }
}

export default BottomNavigationExampleSimple;