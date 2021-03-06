import * as actionTypes from '../actions/actionTypes';

const initialState = {
    userInfo: null,
    postArr: null,
    postLoaded: false,
    error: null,
    profileImgSrc: null,
    headerImgSrc: null
};

const loadUserInfo = (state, action) => {
    return {
        ...state,
        userInfo: action.userInfo
    };
};

const loadUserPostsSuccess = (state, action) => {
    return {
        ...state,
        postArr: action.postArr,
        postLoaded: true,
        error: null
    };
};

const loadUserPostsFail = (state, action) => {
    return {
        ...state,
        postArr: null,
        postLoaded: false,
        error: action.error
    };
};

const loadUserProfileImageSuccess = (state, action) => {
    return {
        ...state,
        profileImgSrc: action.profileImgSrc
    };
};

const loadUserProfileImageFail = (state, action) => {
    return {
        ...state,
        profileImgSrc: null
    };
};

const deleteUserProfileImageSuccess = (state, action) => {
    return {
        ...state,
        profileImgSrc: action.profileImgSrc
    };
};

const loadUserHeaderImageSuccess = (state, action) => {
    return {
        ...state,
        headerImgSrc: action.headerImgSrc
    };
};

const loadUserHeaderImageFail = (state, action) => {
    return {
        ...state,
        headerImgSrc: null
    };
};

const deleteUserHeaderImageSuccess = (state, action) => {
    return {
        ...state,
        headerImgSrc: action.headerImgSrc
    };
};

const resetUser = (state, action) => {
    return {
        ...state,
        postArr: null,
        postLoaded: false,
        error: null,
        profileImgSrc: null,
        headerImgSrc: null
    };
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOAD_USER_POSTS_SUCCESS: return loadUserPostsSuccess(state, action);
        case actionTypes.LOAD_FEED_POSTS_FAIL: return loadUserPostsFail(state, action);
        case actionTypes.LOAD_USER_PROFILE_IMAGE_SUCCESS: return loadUserProfileImageSuccess(state, action);
        case actionTypes.LOAD_USER_PROFILE_IMAGE_FAIL: return loadUserProfileImageFail(state, action);
        case actionTypes.LOAD_USER_HEADER_IMAGE_SUCCESS: return loadUserHeaderImageSuccess(state, action);
        case actionTypes.LOAD_USER_HEADER_IMAGE_FAIL: return loadUserHeaderImageFail(state, action);
        case actionTypes.DELETE_USER_PROFILE_IMAGE_SUCCESS: return deleteUserProfileImageSuccess(state, action);
        case actionTypes.DELETE_USER_HEADER_IMAGE_SUCCESS: return deleteUserHeaderImageSuccess(state, action);
        case actionTypes.LOAD_USER_INFO: return loadUserInfo(state, action);
        case actionTypes.RESET_USER: return resetUser(state, action);
        default:
            return state;
    }
};

export default reducer;