//DESC: 포스트 작성 관련 Validator 검사
const Validator = require('validator');
const isEmpty = require('./empty');
const PostInfoLimit = require('../config/PostInfoLimit');

//DESC: validatePostInput 으로 호출
module.exports = (data) => {
  let errors = {};

  //DESC: 각 정보 초기화
  data.text = !isEmpty(data.text) ? data.text : '';
  data.title = !isEmpty(data.title) ? data.title : '';

  //DESC: 포스트 내용 길이 제한 검증 처리
  if (
    !Validator.isLength(data.text, {
      min: PostInfoLimit.postTextMinLength,
      max: PostInfoLimit.postTextMaxLength,
    })
  ) {
    errors.text =
      '내용은 ' +
      PostInfoLimit.postTextMaxLength +
      '자 까지만 작성 가능합니다.';
  }

  //DESC: 포스트 내용 미기입 검증 처리
  if (Validator.isEmpty(data.text)) {
    errors.text = '내용을 입력해주세요.';
  }

  //DESC: 포스트 타이틀 길이 제한 검증 처리
  if (
    !Validator.isLength(data.title, {
      min: PostInfoLimit.postTitleMinLength,
      max: PostInfoLimit.postTItleMaxLength,
    })
  ) {
    errors.title =
      '제목은 ' +
      PostInfoLimit.postTItleMaxLength +
      '자 까지만 작성 가능합니다.';
  }

  //DESC: 포스트 타이틀 미기입 검증 처리
  if (Validator.isEmpty(data.title)) {
    errors.title = '제목을 입력해주세요.';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
