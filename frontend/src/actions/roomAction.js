import * as types from '../constants/roomConstant'

export function addRoom(roomData) {
    console.log('room action get room data', roomData);
    return {
        type: types.ADD_ROOM,
        roomData
    }
}
