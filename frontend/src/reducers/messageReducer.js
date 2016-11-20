import * as types from '../constants/messageConstant';

const messageReducer = (state = [], action) => {
    switch (action.type) {
        case types.ADD_GLOBAL_MESSAGE:
            return [
                ...state,
                {
                    roomId: '',
                    message: action.message
                }
            ]
        default:
            return state;
    }
}

export default messageReducer;