import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import { authAtcionSaga } from '../actions/authActions';
import auth from './authReducer';
import error from './errorReducer';
import profile from './profileReducer';
import post from './postReducer';
import { profileAtcionSaga } from '../actions/profileActions';
import { postAtcionSaga } from '../actions/postActions';

//DESC:   각 actions Observer 패턴의 redux-saga 함수 모두 등록
//        store.js에 전달하여 createStore 생성 후 run
export function* rootSaga() {
  yield all([authAtcionSaga(), profileAtcionSaga(), postAtcionSaga()]);
}

//DESC:   각종 reducer 하나로 통합
const rootReducer = combineReducers({ auth, error, profile, post });

export default rootReducer;
