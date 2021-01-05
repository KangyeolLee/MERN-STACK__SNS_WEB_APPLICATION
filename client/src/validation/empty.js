// DESC:  주어진 인자가 비어있는지에 대한 여부를 검사 (비어있다면 true 반환)
const isEmpty = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0) //MORE: 빈 공백 역시 비어있는 것으로 처리
  );
};

module.exports = isEmpty;
