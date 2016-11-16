import * as types from '../constants/profileConstant';

const profileReducer = (state = {}, action) => {
    switch (action.type) {
        case types.INIT_PROFILE:
            return {
                ...action.profile
            }
        case types.UPDATE_PROFILE:
return {
                ...state,
    name: action.name
}
        default:
return state;
    }
}

export default profileReducer;