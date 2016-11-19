import * as types from '../constants/messageConstant';

export function addGlobalMessage(message) {
    return {
        type: types.ADD_GLOBAL_MESSAGE,
        message
    }
}

