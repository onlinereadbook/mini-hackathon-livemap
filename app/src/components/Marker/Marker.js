import React from 'react'
import Avatar from 'material-ui/Avatar'
import './Marker.css'

const Marker = ({text, message, photo, index}) => {
    return (
        <div style={{position: 'relative'}}>
            <Avatar
                src={photo}
                size={40}
                title={text}
                className='avatar'
                onClick={() => alert(text)}
            />
            {
                message 
                ? (<div className="arrow_box">
                        <span>{message}</span>
                   </div>)
                : <div />
            }
            
        </div>
    )
}

export default Marker;