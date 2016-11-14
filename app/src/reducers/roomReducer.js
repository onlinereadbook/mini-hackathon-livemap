import * as types from '../constants/roomConstant'

const initState = [
    {
        id: 'AE23423-fwf32',
        title: "預設值",
        userID: 'FBID',
        memo: 'memo'
    },
    {
        id: 'AE23423-fwf3332',
        title: "美麗的房間",
        userID: 'QQQ',
        memo: 'memo'
    }
];

const roomReducer = (state = initState, action) => {
    let index
    switch (action.type) {
        case types.ADD_ROOM:
            return [
                ...state,
                action.roomData
            ]

        default:
            return state
    }
}

export default roomReducer
