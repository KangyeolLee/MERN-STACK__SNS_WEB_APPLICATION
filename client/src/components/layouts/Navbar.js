import React from 'react';
import { Link } from 'react-router-dom';
import './layouts.scss';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../actions/authActions';

const Navbar = () => {
  //DESC: redux 연동
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  //DESC: logout button Action
  const handleLogout = (e) => {
    e.preventDefault();
    //MORE: 로그아웃 액션 디스패치
    dispatch(logout());
  };

  //DESC: 로그인 되어있는 유저의 상단 Navbar
  const userNav = (
    <>
      <li className='navbar-list right'>
        <a onClick={(e) => handleLogout(e)} className='nav-link' href='/'>
          로그아웃
        </a>
      </li>
    </>
  );


  //DESC: 로그아웃 되어있는 유저의 상단 Navbar
  const guestNav = (
    <>
      <li className='navbar-list right'>
        <Link className='nav-link' to='/login'>
          로그인
        </Link>
      </li>
      <li className='navbar-list right'>
        <Link className='nav-link' to='/register'>
          회원가입
        </Link>
      </li>
    </>
  );

  return (
    <nav className='navbar'>
      <ul className='container'>
        <li className='navbar-list logo'>
          <Link className='nav-link' to={auth.isAuthenticated ? '/dashboard' : '/'}>
            DEVPAGE
          </Link>
        </li>
        <li className='navbar-list left'>
          <Link className='nav-link' to='/developers'>
            개발자 목록
          </Link>
        </li>
        <li className='navbar-list left'>
          <Link className='nav-link' to='/posts'>
            포스트 목록
          </Link>
        </li>
        <span>|</span>
        {auth.isAuthenticated ? userNav : guestNav}
      </ul>
    </nav>
  );
};

export default Navbar;
