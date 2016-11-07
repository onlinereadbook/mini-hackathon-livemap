import * as types from '../constants/markerConstant'

const initState = [
    {
        title: "預設值",
        userID: 'FBID',
        memo: 'memo'
    }
];

const roomReducer = (state = initState, action) => {
    let index
    switch (action.type) {
        case types.ADD_ROOM:
            return [
                ...state,
                action.title
            ]

        default:
            return state
    }
}

export default roomReducer