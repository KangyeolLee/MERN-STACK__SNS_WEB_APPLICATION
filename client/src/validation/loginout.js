import jwt_decode from 'jwt-decode'; //MORE: jwt 토큰 복호화 패키지 모듈 로드
import { setAuthToken } from '../apis/userAPIs';
import { setCurrentUser, logout } from '../actions/authActions';
import store from '../store';

//DESC: 최상단 컴포넌트 App.js 에서 로커 스토리지의 토큰 정보를 바탕으로 로그인 상태 검사 및 만료시간 검사
export const checkLogInOrOut = () => {
  if (localStorage.getItem('jwtToken')) {
    const dispatch = store.dispatch; //MORE: react component가 아닌 관계로 useDispatch 사용 불가
    const token = localStorage.getItem('jwtToken');

    setAuthToken(token); //MORE: Header Authorization 에 토근 정보 기록
    const decoded = jwt_decode(token);
    dispatch(setCurrentUser(decoded)); //MORE: 복호화 한 토큰 정보를 바탕으로 redux-state 에 기록

    const currentTime = Date.now() / 1000; //MORE: 현재 시간 (토큰 만료시간 단위 일치를 위해 1000 나눗셈)

    //MORE: 발행된 토근 만료시간이 지났다면 로그아웃 액션 디스패치 및 메인화면으로 이동
    if (currentTime > decoded.exp) {
      dispatch(logout());
      window.location.href = '/'; //MORE: New HTTP Call (NOT: history.push)
    }
  }
};
