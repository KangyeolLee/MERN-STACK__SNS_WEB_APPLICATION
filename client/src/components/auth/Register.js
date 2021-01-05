import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { register, clearErrors } from '../../actions/authActions';
import { useInput } from '../../utils/customHooks';
import { InputField } from '../../utils/InputFieldContainer';

const Register = ({ history }) => {
  //DESC: redux 연동
  const { auth, error } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { success, errors } = error;

  //DESC: state 관리 Input cutomHook 등록
  const name = useInput('', true);
  const email = useInput('', true);
  const password = useInput('', true);
  const password_check = useInput('', true);

  //DESC: form submit Action
  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      name: name.value,
      email: email.value,
      password: password.value,
      password_check: password_check.value,
    };
    //MORE: 회원가입 액션 디스패치
    dispatch(
      register({
        userData,
        history,
      })
    );
  };

  //DESC: 컴포넌트 마운트/언마운트 설정 관리
  useEffect(() => {
    //MORE: 로그인 되어있는 상태면 해당 경로로 이동
    if (auth.isAuthenticated) {
      history.push('/dashboard');
    }
    //MORE: 언마운트 시 화면에 표시되는 에러 관련 메시지 초기화
    return () => dispatch(clearErrors());
  }, [history, dispatch, auth.isAuthenticated]); //MORE: useEffect 의존성 관리

  return (
    <form className='user-form main'>
      <div className='container'>
        <h2>회원가입</h2>

        <InputField
          className='name'
          type='text'
          placeholder='이름'
          stateSet={name}
          icon='FaRegUserCircle'
          errors={errors}
          success={success}
        />

        <InputField
          className='email'
          type='email'
          placeholder='이메일(아이디)'
          stateSet={email}
          icon='AiOutlineMail'
          errors={errors}
          success={success}
        />

        <InputField
          className='password'
          type='password'
          placeholder='비밀번호'
          stateSet={password}
          icon='RiLockPasswordLine'
          errors={errors}
          success={success}
        />

        <InputField
          className='password_check'
          type='password'
          placeholder='비밀번호 확인'
          stateSet={password_check}
          icon='RiLockPasswordLine'
          errors={errors}
          success={success}
        />

        <button onClick={(e) => handleSubmit(e)} className='btn login-btn'>
          회원가입
        </button>
      </div>
    </form>
  );
};

export default Register;
