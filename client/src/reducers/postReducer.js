import { handleActions } from 'redux-actions';
import {
  POST_LOADING,
  GET_POSTS,
  GET_POST,
  ADD_POST,
  UPDATE_POST,
  DELETE_POST,
  TOGGLE_LIKE,
  ADD_COMMENT,
  DELETE_COMMENT,
} from '../actions/types';

//DESC: profileReducer 초기상태 정의
const initialState = {
  posts: [],
  post: {},
  loading: false,
};

//DESC: handleActions 함수를 통해 reducer 동작 정의
export default handleActions(
  {
    [GET_POSTS]: (state, action) => ({
      ...state,
      posts: action.payload,
      loading: false,
    }),
    [GET_POST]: (state, action) => ({
      ...state,
      post: action.payload,
      loading: false,
    }),
    [ADD_POST]: (state, action) => ({
      ...state,
      posts: [action.payload, ...state.posts],
    }),
    [UPDATE_POST]: (state, action) => ({
      ...state,
      post: action.payload,
    }),
    [DELETE_POST]: (state, action) => ({
      ...state,
      posts: state.posts.filter((post) => post._id !== action.payload),
    }),
    [TOGGLE_LIKE]: (state, action) => ({
      ...state,
      post: action.payload,
    }),
    [ADD_COMMENT]: (state, action) => ({
      ...state,
      post: action.payload,
    }),
    [DELETE_COMMENT]: (state, action) => ({
      ...state,
      post: action.payload,
    }),
    [POST_LOADING]: (state, action) => ({
      ...state,
      loading: true,
    }),
  },
  initialState
);
