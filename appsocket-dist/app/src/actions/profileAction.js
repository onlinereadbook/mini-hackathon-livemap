import * as types from '../constants/profileConstant';

export function initProfile(profile) {
    return {
        type: types.INIT_PROFILE,
        profile
    }
}

export function updateProfile(name) {
    return {
        type: types.UPDATE_PROFILE,
        name
    }
}