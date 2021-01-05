//DESC: 회원가입 관련 정보 Validator 검사
const Validator = require('validator');
const isEmpty = require('./empty');
const UserInfoLimit = require('../config/UserInfoLimit');

const validateRegisterInput = (data) => {
  let errors = {};

  //DESC: 각 정보 초기화
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password_check = !isEmpty(data.password_check)
    ? data.password_check
    : '';

  //DESC: 유저 이름 허용 글자 범위 미만 및 초과 처리
  if (
    !Validator.isLength(data.name, {
      min: UserInfoLimit.userNameMinLength,
      max: UserInfoLimit.userNameMaxLength,
    })
  ) {
    errors.name =
      '이름을 ' +
      UserInfoLimit.userNameMinLength +
      ' - ' +
      UserInfoLimit.userNameMaxLength +
      '자 이내로 작성해주세요.';
  }

  //DESC: 유저 이름 미기입 처리
  if (Validator.isEmpty(data.name)) {
    errors.name = '이름을 입력하세요.';
  }

  //DESC: 유저 이메일 유효성 처리
  if (!Validator.isEmail(data.email)) {
    errors.email = '이메일 주소가 유효하지 않습니다.';
  }

  //DESC: 유저 이메일 미기입 처리
  if (Validator.isEmpty(data.email)) {
    errors.email = '이메일을 입력하세요.';
  }

  //DESC: 유저 패스워드 미기입 처리
  if (Validator.isEmpty(data.password)) {
    errors.password = '비밀번호를 입력하세요.';
  }

  //DESC: 유저 패스워드 확인 미기입 처리
  if (Validator.isEmpty(data.password_check)) {
    errors.password_check = '비밀번호 재확인을 입력하세요.';
  }

  //DESC: 유저 패스워드 및 패스워드 확인 불일치 처리
  if (!Validator.equals(data.password, data.password_check)) {
    errors.password_check = '비밀번호가 서로 일치하지 않습니다.';
  }

  //DESC: 유저 패스워드 허용범위 미만 및 초과 처리
  if (
    !Validator.isLength(data.password, {
      min: UserInfoLimit.userPasswordMinLength,
      max: UserInfoLimit.userPasswordMaxLength,
    })
  ) {
    errors.password =
      '비밀번호를 ' +
      UserInfoLimit.userPasswordMinLength +
      ' - ' +
      UserInfoLimit.userPasswordMaxLength +
      '자 이내로 작성해주세요';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = validateRegisterInput;
