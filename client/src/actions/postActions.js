import { createAction } from 'redux-actions';
import { call, put, takeLatest } from 'redux-saga/effects';
import { addCommentAPI, addLikeAPI, addPostAPI, deleteCommentAPI, deletePostAPI, getMyPostsAPI, getPostAPI, getPostsAPI, updatePostAPI } from '../apis/postAPIS';
import {
  POST_LOADING,
  GET_POSTS,
  GET_POST,
  ADD_POST,
  UPDATE_POST,
  DELETE_POST,
  GET_ERRORS,
  TOGGLE_LIKE,
  ADD_COMMENT,
  DELETE_COMMENT,
} from './types';

//DESC: redux-saga async type 정의
const ADD_POST_SAGA = 'ADD_POST_SAGA';
const UPDATE_POST_SAGA = 'UPDATE_POST_SAGA';
const DELETE_POST_SAGA = 'DELETE_POST_SAGA';
const GET_POSTS_SAGA = 'GET_POSTS_SAGA';
const GET_MY_POSTS_SAGA = 'GET_MY_POSTS_SAGA';
const GET_POST_BY_ID_SAGA = 'GET_POST_BY_ID_SAGA';
const ADD_LIKE_SAGA = 'ADD_LIKE_SAGA';
// const REMOVE_LIKE_SAGA = 'REMOVE_LIKE_SAGA';
const ADD_COMMENT_SAGA = 'ADD_COMMENT_SAGA';
const DELETE_COMMENT_SAGA = 'DELETE_COMMENT_SAGA';

//DESC: profile reducer action type 정의
const dispatchAddPost = createAction(ADD_POST, (postdata) => postdata);
const dispatchUpdatePost = createAction(UPDATE_POST, (postdata) => postdata);
const dispatchDeletePost = createAction(DELETE_POST, (post) => post);
const dispatchGetPost = createAction(GET_POST, (post) => post);
const dispatchGetPosts = createAction(GET_POSTS, (posts) => posts);
const dispatchToggleLike = createAction(TOGGLE_LIKE, (post) => post);
const dispatchAddComment = createAction(ADD_COMMENT, (comment) => comment);
const dispatchDeleteComment = createAction(DELETE_COMMENT, (comment) => comment);
const dispatchErrorData = createAction(GET_ERRORS, (error) => error);

//DESC: 외부 component 에서 호출하는 dispatch action
export const addPost_async = createAction(
  ADD_POST_SAGA,
  (postData) => postData
);
export const updatePost_async = createAction(
  UPDATE_POST_SAGA,
  (postData) => postData
);
export const deletePost_async = createAction(
  DELETE_POST_SAGA,
  (id) => id
);
export const getPosts_async = createAction(GET_POSTS_SAGA);
export const getMyPosts_async = createAction(GET_MY_POSTS_SAGA);
export const getPostById_async = createAction(GET_POST_BY_ID_SAGA, (id) => id);
export const addLike_async = createAction(ADD_LIKE_SAGA, (id) => id);
// export const removeLike_async = createAction(REMOVE_LIKE_SAGA, (id) => id);
export const addComment_async = createAction(ADD_COMMENT_SAGA,
  (comment) => comment);
export const deleteComment_async = createAction(DELETE_COMMENT_SAGA,
  (comment) => comment);
export const setPostLoading = createAction(POST_LOADING);

//DESC: Redux-saga Observer Generator Module
//MORE: 텍스트 에디터로 작성한 포스트 게시글 등록 Saga function
function* addPost(action) {
  const { postData, history } = action.payload;
  try {
    const post = yield call(addPostAPI, postData);
    yield put(dispatchAddPost(post.data.data));
    yield call(history.push, '/postboard/' + post.data.data._id);
  } catch (error) {
    yield put(dispatchErrorData(error.response.data));
  }
}
//MORE: 등록된 기존 포스트 게시글 업데이트 Saga Function
function* updatePost(action) {
  const { id, postData, history } = action.payload;
  try {
    const post = yield call(updatePostAPI, id, postData);
    yield put(dispatchUpdatePost(post.data.data));
    yield call(history.push, '/postboard/' + id);
  } catch (error) {
    yield put(dispatchErrorData(error.response.data));
  }
}
//MORE: 등록된 포스트 게시글 제거 Saga Funtion
function* deletePost(action) {
  const { id, history } = action.payload;
  try {
    const post = yield call(getPostAPI, id);
    const res = window.confirm('정말 해당 게시글을 삭제하시겠습니까?');

    if (res) {
      yield call(deletePostAPI, id);
      yield put(dispatchDeletePost(post.data.data));
      yield call(history.push, '/posts');
    }

  } catch (error) {
    yield put(dispatchErrorData(error.response.data));
  }
}

//MORE: 포럼에 작성된 모든 포스트 목록 조회 Saga function
function* getPosts() {
  yield put(setPostLoading());

  try {
    const posts = yield call(getPostsAPI);
    yield put(dispatchGetPosts(posts.data.data));
  } catch (error) {
    yield put(dispatchGetPosts(null));
  }
}

//MORE: 현재 로그인 된 사용자가 작성한 포스트 목록만 조회 Saga function
function* getMyPosts() {
  yield put(setPostLoading());

  try {
    const posts = yield call(getMyPostsAPI);
    yield put(dispatchGetPosts(posts.data.data));
  } catch (error) {
    yield put(dispatchGetPosts(null));
  }
}

//MORE: Post id값으로 해당하는 포스트 목록 조회 Saga Function
function* getPostById(action) {
  const { id } = action.payload;
  yield put(setPostLoading());

  try {
    const post = yield call(getPostAPI, id);
    yield put(dispatchGetPost(post.data.data));
  } catch (error) {
    yield put(dispatchGetPost(null));
  }
}

//MORE: 해당 포스트 게시글 좋아요 추가 Saga Function
function* addLike(action) {
  const { id } = action.payload;
  try {
    const post = yield call(addLikeAPI, id);
    yield put(dispatchToggleLike(post.data.data));
  } catch (error) {
    yield put(dispatchErrorData(error.response.data));
  }
}

//MORE: 해당 포스트 게시글 좋아요 취소 Saga Function
//HACK: API 기능 변경으로 인해 더 이상 사용 X
// function* removeLike(action) {
//   const { id } = action.payload;
//   try {
//     const post = yield call(removeLikeAPI, id);
//     yield put(dispatchToggleLike(post.data.data));
//   } catch (error) {
//     yield put(dispatchErrorData(error.response.data));
//   }
// }

//MORE: 포스트 게시글에 댓글 등록 Saga Function
function* addComment(action) {
  const { id, commentData } = action.payload;
  try {
    const post = yield call(addCommentAPI, id, commentData);
    yield put(dispatchAddComment(post.data.data));
  } catch (error) {
    yield put(dispatchErrorData(error.response.data));
  }
}

//MORE: 포스트 게시글에 등록된 댓글 삭제 Saga Function
function* deleteComment(action) {
  const { id, commentId } = action.payload;
  try {
    const post = yield call(deleteCommentAPI, id, commentId);
    yield put(dispatchDeleteComment(post.data.data));
  } catch (error) {
    yield put(dispatchErrorData(error.response.data));
  }
}

//DESC: 각 redux-saga 함수 Observer saga 핸들러
export function* postAtcionSaga() {
  yield takeLatest(ADD_POST_SAGA, addPost);
  yield takeLatest(UPDATE_POST_SAGA, updatePost);
  yield takeLatest(DELETE_POST_SAGA, deletePost);
  yield takeLatest(GET_POSTS_SAGA, getPosts);
  yield takeLatest(GET_MY_POSTS_SAGA, getMyPosts);
  yield takeLatest(GET_POST_BY_ID_SAGA, getPostById);
  yield takeLatest(ADD_LIKE_SAGA, addLike);
  // yield takeLatest(REMOVE_LIKE_SAGA, removeLike);
  yield takeLatest(ADD_COMMENT_SAGA, addComment);
  yield takeLatest(DELETE_COMMENT_SAGA, deleteComment);
}
