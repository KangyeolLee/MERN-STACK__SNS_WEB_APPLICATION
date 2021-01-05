import axios from 'axios';

//DESC: 현재 사용자의 profile 조회 비동기 API
export const getCurrentProfileAPI = async () => await axios.get('/api/profile');

//DESC: id 값으로 사용자 프로필 조회 비동기 API
export const getProfileBYIdAPI = async (id) =>
  await axios.get(`/api/profile/id/${id}`);

//DESC: profileName 값으로 사용자 프로필 조회 비동기 API
export const getProfileByProfileNameAPI = async (profileName) =>
  await axios.get(`/api/profile/profileName/${profileName}`);

//DESC: 모든 유저의 프로필 정보 조회 비동기 API
export const getProfilesAPI = async () => await axios.get(`/api/profile/all`);

//DESC: 유저 프로필 정보 생성 비동기 API
export const createProfileAPI = async (profileData) =>
  await axios.post(`/api/profile`, profileData);

//DESC: 유저 프로필 정보 삭제 (= 계정 삭제 동시 진행) 비동기 API
export const deleteUserDataAPI = async () =>
  await axios.delete(`/api/users/unregister`);

//DESC: 기존 프로필 정보에 추가 경력 사항 추가 비동기 API
export const addExperienceAPI = async (expData) =>
  await axios.post(`/api/profile/experience`, expData);
