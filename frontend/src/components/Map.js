import React from 'react'
import GoogleMap from 'google-map-react'

import Marker from './Marker/Marker.js'
const API_KEY = { key: 'AIzaSyCy5iDWaadnc5waobnsdyQf5dM2NLrSefY' }
const style = {
    map: {
        borderRadius: '10px 0 0 10px',
        float: 'left',
        width: '100px',
        height: '100px',
        backgroundColor: '#2d2b2b'
    }
}
console.log(API_KEY);

const Map = ({center, zoom, markers}) => {
    return (
        <GoogleMap center={center} zoom={zoom} bootstrapURLKeys={API_KEY}>
            {
                markers.map((marker, idx) => <Marker key={`marker_${idx}`} {...marker.position} name={marker.name} message={marker.message} photo={marker.photo} index={idx + 1} />)
            }
        </GoogleMap >
    )
}



export default Map