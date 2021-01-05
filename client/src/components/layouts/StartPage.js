import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const StartPage = ({ history }) => {
  //DESC: redux 연동
  const { auth } = useSelector((state) => state);

  //DESC: 컴포넌트 마운트/언마운트 설정 관리
  useEffect(() => {
    //MORE: 로그인 되어있는 상태면 해당 경로로 이동
    if (auth.isAuthenticated) {
      history.push('/dashboard');
    }
  }, [history, auth.isAuthenticated]);

  return (
    <div className='startpage main'>
      <div className='container'>
        <h1>Hello World!</h1>
        <h2>개발자들을 위한 페이지</h2>
        <Link className='btn start-btn' to='/login'>
          시작하기
        </Link>
      </div>
    </div>
  );
};

export default StartPage;
