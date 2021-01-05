import { useState } from 'react';

//DESC: input 태그 value 및 onChange 핸들러 공통 관리 커스텀 훅
export const useInput = (defaultValue, option = false) => {
  //MORE: Input value는 null값을 제대로 인식하지 못하므로 빈 String을 할당
  if (defaultValue === null) defaultValue = '';

  const [value, setValue] = useState(defaultValue);

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setValue(value);

    // 필수 입력 사항 옵션 체크 -- 양식에 맞게 재입력 시 레드 박스모델 해제
    if (option && e.target.classList.contains('required')) {
      e.target.classList.remove('required');
    }
  };

  return { value, onChange };
};
