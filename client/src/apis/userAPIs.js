import axios from 'axios';

//DESC: 회원가입 처리 비동기 함수
export const registerAPI = async (userData) =>
  await axios.post('api/users/register', userData);

//DESC: 로그인 처리 비동기 함수
export const loginAPI = async (userData) =>
  await axios.post('api/users/login', userData);

//DESC: 토큰 정보 헤더에 기록하는 함수
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};
