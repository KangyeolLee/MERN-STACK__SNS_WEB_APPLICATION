import {
  GET_ERRORS,
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_LOADING,
  // PROFILE_NOT_FOUND,
  CLEAR_CURRENT_PROFILE,
} from './types';
import { createAction } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  getCurrentProfileAPI,
  getProfileBYIdAPI,
  getProfileByProfileNameAPI,
  getProfilesAPI,
  createProfileAPI,
  deleteUserDataAPI,
  addExperienceAPI,
} from '../apis/profileAPIs';
import { logout, setCurrentUser, clearErrors } from './authActions';

//DESC: redux-saga async type 정의
const GET_PROFILE_SAGA = 'GET_PROFILE_SAGA';
const GET_PROFILE_BY_ID_SAGA = 'GET_PROFILE_BY_ID_SAGA';
const GET_PROFILE_BY_PROFILENAME_SAGA = 'GET_PROFILE_BY_PROFILENAME_SAGA';
const GET_PROFIELS_SAGA = 'GET_PROFIELS_SAGA';
const CREATE_PROFILE_SAGA = 'CREATE_PROFILE_SAGA';
const DELETE_PROFILE_SAGA = 'DELETE_PROFILE_SAGA';
const ADD_EXPERIENCE_SAGA = 'ADD_EXPERIENCE_SAGA';

//DESC: profile reducer action type 정의
const getProfileData = createAction(GET_PROFILE, (profile) => profile.data);
const getProfilesData = createAction(GET_PROFILES, (profile) => profile.data);
const getErrorData = createAction(GET_ERRORS, (error) => error);
// const getError = createAction(GET_PROFILE, () => {});

//DESC: 외부 component 에서 호출하는 dispatch action
export const getProfile_async = createAction(GET_PROFILE_SAGA);
export const getProfiles_async = createAction(GET_PROFIELS_SAGA);
export const getProfileById_async = createAction(
  GET_PROFILE_BY_ID_SAGA,
  (id) => id
);
export const getProfileByProfileName_async = createAction(
  GET_PROFILE_BY_PROFILENAME_SAGA,
  (profileName) => profileName
);
export const createProfile_async = createAction(
  CREATE_PROFILE_SAGA,
  (profileData) => profileData
);
export const deleteProfile_async = createAction(DELETE_PROFILE_SAGA);
export const addExperience_async = createAction(ADD_EXPERIENCE_SAGA);

export const setProfileLoading = createAction(PROFILE_LOADING);
export const clearCurrentProfile = createAction(CLEAR_CURRENT_PROFILE);

//DESC: Redux-saga Observer Generator Module
//MORE: 현재 로그인 된 유저의 프로필 정보 조회 처리 Saga function
function* getCurrentProfile() {
  yield put(setProfileLoading());

  try {
    const profile = yield call(getCurrentProfileAPI);
    yield put(getProfileData(profile.data));
  } catch (error) {
    yield put(getErrorData(error.response.data));
    yield put(setProfileLoading());
  }
}

//MORE: 유저의 id 값을 통해 프로필 정보 조회 처리 Saga function
function* getProfileById(action) {
  yield put(setProfileLoading());
  const { id } = action.payload;

  try {
    const profile = yield call(getProfileBYIdAPI, id);
    yield put(getProfileData(profile.data));
  } catch (error) {
    yield put(getErrorData(error.response.data));
  }
}

//MORE: 유저의 프로필명을 통해 프로필 정보 조회 처리 Saga function
function* getProfileByProfileName(action) {
  yield put(setProfileLoading());
  const { profileName } = action.payload;

  try {
    const profile = yield call(getProfileByProfileNameAPI, profileName);
    yield put(getProfileData(profile.data));
  } catch (error) {
    yield put(getErrorData(error.response.data));
  }
}

//MORE: 모든 유저 프로필 정보 조회 처리 Saga function
function* getProfiles() {
  yield put(setProfileLoading());

  try {
    const profiles = yield call(getProfilesAPI);
    yield put(getProfilesData(profiles.data));
  } catch (error) {
    yield put(getErrorData(error.response.data));
  }
}

//MORE: 유저 프로필 데이터 생성 처리 Saga function
function* createProfile(action) {
  const { profileData, history } = action.payload;

  try {
    yield call(createProfileAPI, profileData);
    yield put(clearErrors());
    yield call(history.push, '/dashboard');
  } catch (error) {
    yield put(clearErrors());
    yield put(getErrorData(error.response.data));
  }
}

//MORE: 유저 프로필 데이터 삭제 처리 Saga function (계정 삭제 동시 진행)
function* deleteProfile() {
  try {
    yield call(deleteUserDataAPI);
    yield put(logout());
    yield put(clearCurrentProfile());
    yield put(setCurrentUser({}));
  } catch (error) {
    yield put(getErrorData(error.response.data));
  }
}

//MORE: 기존 프로필 정보에 경력 사항 추가 처리 Saga function
function* addExperience(action) {
  const { expData, history } = action.payload;

  try {
    yield call(addExperienceAPI, expData);
    yield call(history.push, '/dashboard');
  } catch (error) {
    yield put(getErrorData(error.response.data));
  }
}

//DESC: 각 redux-saga 함수 Observer saga 핸들러
export function* profileAtcionSaga() {
  yield takeLatest(GET_PROFILE_SAGA, getCurrentProfile);
  yield takeLatest(GET_PROFILE_BY_ID_SAGA, getProfileById);
  yield takeLatest(GET_PROFILE_BY_PROFILENAME_SAGA, getProfileByProfileName);
  yield takeLatest(GET_PROFIELS_SAGA, getProfiles);
  yield takeLatest(CREATE_PROFILE_SAGA, createProfile);
  yield takeLatest(DELETE_PROFILE_SAGA, deleteProfile);
  yield takeLatest(ADD_EXPERIENCE_SAGA, addExperience);
}
