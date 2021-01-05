const Validator = require('validator');
const isEmpty = require('./empty');

// DESC: validateExperienceInput 으로 호출
module.exports = (data) => {
  let errors = {};

  //DESC: 초기 정보 초기화
  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.title)) {
    errors.title = '근무한 내용을 입력해주세요.';
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = '근무한 회사 명을 입력해주세요.';
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = '해당 근무 시작일을 입력해주세요.';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
