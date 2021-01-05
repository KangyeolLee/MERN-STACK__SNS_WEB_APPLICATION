import { handleActions } from 'redux-actions';
import {
  GET_PROFILE,
  PROFILE_NOT_FOUND,
  GET_PROFILES,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
} from '../actions/types';

//DESC: profileReducer 초기상태 정의
const initialState = {
  profile: null,
  profiles: null,
  loading: false,
};

//DESC: handleActions 함수를 통해 reducer 동작 정의
export default handleActions(
  {
    [GET_PROFILE]: (state, action) => ({
      ...state,
      profile: action.payload,
      loading: false,
    }),
    [GET_PROFILES]: (state, action) => ({
      ...state,
      profiles: action.payload,
      loading: false,
    }),
    [PROFILE_LOADING]: (state, action) => ({
      ...state,
      loading: true, //기본상태에서 호출 - 로딩중 / 로딩상태에서 호출 - 로딩완료 동작
    }),
    [CLEAR_CURRENT_PROFILE]: (state, action) => ({
      ...state,
      profile: null,
    }),
    [PROFILE_NOT_FOUND]: (state, action) => ({
      ...state,
      error: action.payload,
    }),
  },
  initialState
);
