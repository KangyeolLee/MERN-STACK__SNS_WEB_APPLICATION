//DESC: 프로필 관련 정보 Validator 검사
const Validator = require('validator');
const isEmpty = require('./empty');
const ProfileInfoLimit = require('../config/ProfileInfoLimit');
const { default: validator } = require('validator');

//DESC: validateProfileInput 로 호출
module.exports = (data, profileName = null) => {
  let errors = {};

  //DESC: 각 정보 초기화
  data.profileName = !isEmpty(data.profileName) ? data.profileName : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  //DESC: 프로필 명 중복 검증 처리
  if (profileName) {
    errors.profileName = '해당 프로필 명을 가진 사용자가 이미 존재합니다.';
  }

  //DESC: 프로필 명 글자수 허용 범위 이내 검증 처리
  if (
    !Validator.isLength(data.profileName, {
      min: ProfileInfoLimit.profileNameMinLength,
      max: ProfileInfoLimit.profileNameMaxLength,
    })
  ) {
    errors.profileName =
      '프로필 명을 ' +
      ProfileInfoLimit.profileNameMinLength +
      ' - ' +
      ProfileInfoLimit.profileNameMaxLength +
      '자 이내로 입력해주세요.';
  }

  //DESC: 프로필 명 미기입 검증 처리
  if (Validator.isEmpty(data.profileName)) {
    errors.profileName = '프로필 명을 입력해주세요.';
  }

  //DESC: 직업 미기입 검증 처리
  if (Validator.isEmpty(data.status)) {
    errors.status = '직업을 선택해주세요.';
  }

  //DESC: 언어 미기입 검증 처리
  if (Validator.isEmpty(data.skills)) {
    errors.skills = '사용하고 있는 언어를 입력해주세요.';
  }

  //DESC: 웹사이트 주소 입력 시 유효성 검증 처리
  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = '입력하신 웹사이트 주소가 유효하지 않습니다.';
    }
  }

  //DESC: 트위터 주소 입력 시 유효성 검증 처리
  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = '입력하신 트위터 주소가 유효하지 않습니다.';
    }
  }

  //DESC: 페이스북 주소 입력 시 유효성 검증 처리
  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = '입력하신 페이스북 주소가 유효하지 않습니다.';
    }
  }

  //DESC: 인스타그램 주소 입력 시 유효성 검증 처리
  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = '입력하신 인스타그램 주소가 유효하지 않습니다.';
    }
  }

  //DESC: 유튜브 주소 입력 시 유효성 검증 처리
  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = '입력하신 유튜브 주소가 유효하지 않습니다.';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
