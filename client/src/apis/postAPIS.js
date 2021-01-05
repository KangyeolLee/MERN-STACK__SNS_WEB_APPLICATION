import axios from 'axios';

//DESC: post 추가(글 작성) 비동기 API
export const addPostAPI = async (postData) =>
  await axios.post('/api/posts/', postData);

//DESC: 기존 post 수정 비동기 API
export const updatePostAPI = async (id, postData) =>
  await axios.post(`/api/posts/update/${id}`, postData);

//DESC: 모든 post 목록 불러오기 비동기 API
export const getPostsAPI = async () => await axios.get('/api/posts');

//DESC: 로그인 한 회원의 post 목록 불러오기 비동기 API
export const getMyPostsAPI = async () => await axios.get('/api/posts/myPosts');

//DESC: id값에 해당하는 post 한 개 불러오기 비동기 API
export const getPostAPI = async (id) =>
  await axios.get(`/api/posts/search/${id}`);

//DESC: id값에 일치하는 post 제거 비동기 API
export const deletePostAPI = async (id) =>
  await axios.delete(`/api/posts/delete/${id}`);

//DESC: id값과 일치하는 post에 '좋아요' 추가비동기 API
export const addLikeAPI = async (id) =>
  await axios.post(`/api/posts/like/${id}`);

//DESC: id값과 일치하는 post에 체크한 '좋아요' 삭제 비동기 API
//HACK: toggle식으로 좋아요 클릭으로 변경 ( cf. youtube like btn )
// export const removeLikeAPI = async (id) =>
//   await axios.delete(`/api/posts/unlike/${id}`);

//DESC: id값과 일치하는 post에 코멘트 추가(댓글 작성) 비동기 API
export const addCommentAPI = async (id, commentData) =>
  await axios.post(`/api/posts/comment/${id}`, commentData);

//DESC: id값과 일치하는 post에서 해당 코멘트 삭제 비동기 API
export const deleteCommentAPI = async (id, commentId) =>
  await axios.delete(`/api/posts/comment/${id}/${commentId}`);
