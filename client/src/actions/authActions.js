import {
  GET_ERRORS,
  CLEAR_ERRORS,
  USER_REGISTER,
  SET_CURRENT_USER,
  USER_LOGIN,
  USER_LOGOUT,
} from './types';
import jwt_decode from 'jwt-decode'; //MORE: jwt 토큰 복호화 패키지 모듈 로드
import { takeLatest, put, call } from 'redux-saga/effects'; //MORE: redux-saga 헬퍼함수 로드
import { createAction } from 'redux-actions'; //MORE: action creator 함수 로드
import { registerAPI, loginAPI, setAuthToken } from '../apis/userAPIs';

//DESC: 에러 관련 액션 생성 함수
const getError = createAction(GET_ERRORS, (error) => error);
export const clearErrors = createAction(CLEAR_ERRORS);

//DESC: 회원가입 / 로그인 / 로그아웃 / 현재 유저 설정 관련 액션 생성 함수
export const register = createAction(USER_REGISTER, (userData) => userData);
export const login = createAction(USER_LOGIN, (userData) => userData);
export const logout = createAction(USER_LOGOUT);
export const setCurrentUser = createAction(
  SET_CURRENT_USER,
  (decoded) => decoded
);

//DESC: 회원가입 처리 redux-saga 함수
function* registerUser(action) {
  const { userData, history } = action.payload; //MORE: action의 전달매개체는 payload로 통일

  try {
    //MORE: JS Generator 문법
    yield call(registerAPI, userData);
    yield put(clearErrors());
    yield call(history.push, '/login');
  } catch (error) {
    yield put(clearErrors());
    yield put(getError(error.response.data));
  }
}

//DESC: 로그인 처리 redux-saga 함수
function* loginUser(action) {
  const { userData } = action.payload;

  try {
    //MORE: JS Generator 문법
    const user = yield call(loginAPI, userData);
    const { token } = user.data;
    localStorage.setItem('jwtToken', token);
    yield call(setAuthToken, token); //MORE: 생성된 토큰 정보 HTTP Authorization Header 에 등록
    const decoded = yield call(jwt_decode, token);

    yield put(setCurrentUser(decoded));
    yield put(clearErrors());
  } catch (error) {
    yield put(clearErrors());
    yield put(getError(error.response.data));
  }
}

//DESC: 로그아웃 처리 redux-saga 함수
function* logoutUser() {
  try {
    //MORE: JS Generator 문법
    localStorage.removeItem('jwtToken');
    yield call(setAuthToken, false);
    yield put(setCurrentUser({}));
    window.location.href = '/';
  } catch (error) {
    yield put(getError(error.response.data));
  }
}

//DESC: 각 redux-saga 함수 Observer saga 핸들러
export function* authAtcionSaga() {
  yield takeLatest(USER_REGISTER, registerUser);
  yield takeLatest(USER_LOGIN, loginUser);
  yield takeLatest(USER_LOGOUT, logoutUser);
}
