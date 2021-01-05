//DESC: 로그인 관련 정보 Validator 검사
const Validator = require('validator');
const isEmpty = require('./empty');

//DESC: validateLoginInput 으로 호출
module.exports = (data) => {
  let errors = {};

  //DESC: 각 정보 초기화
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  //DESC: 이메일 유효성 처리
  if (!Validator.isEmail(data.email)) {
    errors.email = '이메일 주소가 유효하지 않습니다.';
  }

  //DESC: 이메일 미기입 처리
  if (Validator.isEmpty(data.email)) {
    errors.email = '이메일을 입력하세요.';
  }

  //DESC: 비밀번호 미기입 처리
  if (Validator.isEmpty(data.password)) {
    errors.password = '비밀번호를 입력하세요.';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
